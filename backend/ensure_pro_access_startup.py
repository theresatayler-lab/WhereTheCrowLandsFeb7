#!/usr/bin/env python3
"""
Auto-ensure Theresa Tayler has PRO access on every backend start.
This runs automatically before the server starts.
"""
import sys
sys.path.append('/app/backend')

from pymongo import MongoClient
import bcrypt
import os
import uuid
from datetime import datetime, timedelta

def ensure_pro_access():
    """Ensure both email variations have PRO access"""
    try:
        MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
        client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        db = client['crowlands']
        users_collection = db['users']
        
        # Both email variations
        emails = ['TheresaTayler@me.com', 'theresatayler@me.com']
        password = 'NinaROck1!'
        name = 'Theresa Tayler'
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        for email in emails:
            existing_user = users_collection.find_one({'email': email})
            
            pro_data = {
                'password_hash': password_hash,
                'subscription_tier': 'pro',
                'subscription_status': 'active',
                'subscription_start': datetime.utcnow(),
                'subscription_end': datetime.utcnow() + timedelta(days=36500),
                'stripe_customer_id': 'manual_premium_user',
                'stripe_subscription_id': 'manual_premium_subscription',
                'updated_at': datetime.utcnow()
            }
            
            if existing_user:
                # Ensure id field exists
                if 'id' not in existing_user:
                    pro_data['id'] = str(uuid.uuid4())
                users_collection.update_one({'email': email}, {'$set': pro_data})
                print(f'✅ PRO access ensured: {email}')
            else:
                user_doc = {
                    'id': str(uuid.uuid4()),
                    'email': email,
                    'password_hash': password_hash,
                    'name': name,
                    'spell_generation_count': 0,
                    'created_at': datetime.utcnow(),
                    **pro_data
                }
                users_collection.insert_one(user_doc)
                print(f'✅ PRO account created: {email}')
        
        print('🎉 Theresa Tayler PRO access: CONFIRMED')
        return True
    except Exception as e:
        print(f'⚠️  Could not ensure PRO access: {e}')
        return False

if __name__ == '__main__':
    ensure_pro_access()
