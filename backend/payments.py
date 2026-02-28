"""
Stripe Payment Integration for Where The Crowlands
Handles: PRO subscriptions, single spell purchases, physical products

To switch from test to live:
1. Update STRIPE_API_KEY in .env to your live key (sk_live_...)
2. Update STRIPE_PUBLISHABLE_KEY in frontend/.env to your live key (pk_live_...)
3. That's it! No code changes needed.
"""

import os
import logging
from datetime import datetime, timezone
from typing import Optional, Dict
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, 
    CheckoutSessionResponse, 
    CheckoutStatusResponse, 
    CheckoutSessionRequest
)

# MongoDB will be injected from server.py
db = None

def init_payments_db(mongo_db):
    """Initialize the database connection for payments"""
    global db
    db = mongo_db

router = APIRouter(prefix="/api/payments", tags=["payments"])

# ============================================================================
# FIXED PRICE PACKAGES (Security: Never accept amounts from frontend)
# ============================================================================

PACKAGES = {
    # Subscriptions
    "pro_monthly": {
        "name": "PRO Monthly",
        "amount": 9.99,
        "currency": "usd",
        "type": "subscription",
        "description": "Unlimited spells, save to grimoire, exclusive guides",
        "subscription_tier": "pro"
    },
    "pro_yearly": {
        "name": "PRO Yearly",
        "amount": 99.99,
        "currency": "usd",
        "type": "subscription",
        "description": "PRO access for a full year (save $20!)",
        "subscription_tier": "pro"
    },
    
    # Single purchases
    "single_spell": {
        "name": "Single Spell Generation",
        "amount": 4.99,
        "currency": "usd",
        "type": "one_time",
        "description": "Generate one custom spell",
        "credits": 1
    },
    "spell_pack_5": {
        "name": "5 Spell Pack",
        "amount": 19.99,
        "currency": "usd",
        "type": "one_time",
        "description": "5 spell generations (save $5!)",
        "credits": 5
    },
    
    # Physical products
    "printed_grimoire": {
        "name": "Printed Grimoire",
        "amount": 49.99,
        "currency": "usd",
        "type": "physical",
        "description": "Your saved spells beautifully printed and bound"
    },
    "tarot_deck": {
        "name": "Custom Tarot Deck",
        "amount": 39.99,
        "currency": "usd",
        "type": "physical",
        "description": "22-card deck of your generated tarot images"
    },
    "anchor_box_shigg": {
        "name": "Shigg's Kitchen Box",
        "amount": 59.99,
        "currency": "usd",
        "type": "physical",
        "description": "Curated ritual supplies: tea, herbs, candle, and more"
    }
}

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class CreateCheckoutRequest(BaseModel):
    package_id: str = Field(..., description="ID of the package to purchase")
    origin_url: str = Field(..., description="Frontend origin URL for redirects")
    user_email: Optional[str] = Field(None, description="User email if logged in")
    user_id: Optional[str] = Field(None, description="User ID if logged in")
    # For physical products
    shipping_address: Optional[Dict] = Field(None, description="Shipping address for physical products")

class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str
    package: dict

class PaymentStatusResponse(BaseModel):
    status: str
    payment_status: str
    amount: float
    currency: str
    package_id: str
    package_name: str

# ============================================================================
# API ENDPOINTS
# ============================================================================

@router.get("/packages")
async def get_packages():
    """Get all available packages for purchase"""
    return {
        "packages": PACKAGES,
        "categories": {
            "subscriptions": ["pro_monthly", "pro_yearly"],
            "spell_credits": ["single_spell", "spell_pack_5"],
            "physical": ["printed_grimoire", "tarot_deck", "anchor_box_shigg"]
        }
    }

@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(request: CreateCheckoutRequest, http_request: Request):
    """Create a Stripe checkout session for a package"""
    
    # Validate package exists
    if request.package_id not in PACKAGES:
        raise HTTPException(status_code=400, detail=f"Invalid package: {request.package_id}")
    
    package = PACKAGES[request.package_id]
    
    # Get Stripe API key
    api_key = os.environ.get("STRIPE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    # Build URLs from frontend origin (never hardcode!)
    success_url = f"{request.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{request.origin_url}/payment/cancel"
    
    # Initialize Stripe
    host_url = str(http_request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    # Prepare metadata
    metadata = {
        "package_id": request.package_id,
        "package_type": package["type"],
        "user_email": request.user_email or "guest",
        "user_id": request.user_id or "guest"
    }
    
    # Add shipping info for physical products
    if package["type"] == "physical" and request.shipping_address:
        metadata["requires_shipping"] = "true"
    
    try:
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=float(package["amount"]),
            currency=package["currency"],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Record transaction in database
        if db is not None:
            transaction = {
                "session_id": session.session_id,
                "package_id": request.package_id,
                "package_name": package["name"],
                "amount": package["amount"],
                "currency": package["currency"],
                "type": package["type"],
                "user_email": request.user_email,
                "user_id": request.user_id,
                "payment_status": "pending",
                "status": "initiated",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
            db.payment_transactions.insert_one(transaction)
            logging.info(f"Created payment transaction: {session.session_id}")
        
        return CheckoutResponse(
            checkout_url=session.url,
            session_id=session.session_id,
            package=package
        )
        
    except Exception as e:
        logging.error(f"Stripe checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")

@router.get("/status/{session_id}", response_model=PaymentStatusResponse)
async def get_payment_status(session_id: str, http_request: Request):
    """Check the status of a payment session"""
    
    api_key = os.environ.get("STRIPE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    host_url = str(http_request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Get package info from metadata
        package_id = status.metadata.get("package_id", "unknown")
        package = PACKAGES.get(package_id, {"name": "Unknown", "amount": 0})
        
        # Update database if payment completed
        if db is not None and status.payment_status == "paid":
            # Check if already processed (prevent double-processing)
            existing = db.payment_transactions.find_one({
                "session_id": session_id,
                "payment_status": "paid"
            })
            
            if not existing:
                # Update transaction status
                db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {
                        "$set": {
                            "payment_status": "paid",
                            "status": "completed",
                            "updated_at": datetime.now(timezone.utc)
                        }
                    }
                )
                
                # Handle post-payment actions based on package type
                await _handle_successful_payment(session_id, package_id, status.metadata)
        
        return PaymentStatusResponse(
            status=status.status,
            payment_status=status.payment_status,
            amount=status.amount_total / 100,  # Convert from cents
            currency=status.currency,
            package_id=package_id,
            package_name=package["name"]
        )
        
    except Exception as e:
        logging.error(f"Status check error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Status check error: {str(e)}")

async def _handle_successful_payment(session_id: str, package_id: str, metadata: dict):
    """Handle post-payment actions based on package type"""
    
    package = PACKAGES.get(package_id)
    if not package:
        return
    
    user_email = metadata.get("user_email")
    user_id = metadata.get("user_id")
    
    if package["type"] == "subscription":
        # Upgrade user to PRO
        if db is not None and user_email and user_email != "guest":
            # Calculate subscription end date
            if package_id == "pro_monthly":
                from datetime import timedelta
                end_date = datetime.now(timezone.utc) + timedelta(days=30)
            else:  # yearly
                from datetime import timedelta
                end_date = datetime.now(timezone.utc) + timedelta(days=365)
            
            db.users.update_one(
                {"email": {"$regex": f"^{user_email}$", "$options": "i"}},
                {
                    "$set": {
                        "subscription_tier": "pro",
                        "subscription_started": datetime.now(timezone.utc),
                        "subscription_ends": end_date,
                        "subscription_package": package_id
                    }
                }
            )
            logging.info(f"Upgraded user {user_email} to PRO")
    
    elif package["type"] == "one_time" and "credits" in package:
        # Add spell credits
        if db is not None and user_email and user_email != "guest":
            db.users.update_one(
                {"email": {"$regex": f"^{user_email}$", "$options": "i"}},
                {
                    "$inc": {"spell_credits": package["credits"]}
                }
            )
            logging.info(f"Added {package['credits']} spell credits to {user_email}")
    
    elif package["type"] == "physical":
        # Create fulfillment order record
        if db is not None:
            order = {
                "session_id": session_id,
                "package_id": package_id,
                "user_email": user_email,
                "status": "pending_fulfillment",
                "created_at": datetime.now(timezone.utc)
            }
            db.physical_orders.insert_one(order)
            logging.info(f"Created physical order for {package_id}")

# ============================================================================
# WEBHOOK HANDLER
# ============================================================================

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    
    api_key = os.environ.get("STRIPE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    try:
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        logging.info(f"Webhook received: {webhook_response.event_type}")
        
        # Handle different event types
        if webhook_response.event_type == "checkout.session.completed":
            session_id = webhook_response.session_id
            if webhook_response.payment_status == "paid":
                # Process successful payment
                if db is not None:
                    transaction = db.payment_transactions.find_one({"session_id": session_id})
                    if transaction and transaction.get("payment_status") != "paid":
                        package_id = transaction.get("package_id")
                        await _handle_successful_payment(
                            session_id, 
                            package_id, 
                            webhook_response.metadata
                        )
                        
                        db.payment_transactions.update_one(
                            {"session_id": session_id},
                            {
                                "$set": {
                                    "payment_status": "paid",
                                    "status": "completed",
                                    "updated_at": datetime.now(timezone.utc)
                                }
                            }
                        )
        
        return {"status": "ok"}
        
    except Exception as e:
        logging.error(f"Webhook error: {str(e)}")
        return {"status": "error", "message": str(e)}
