import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const navigate = useNavigate();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus(sessionId);
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  const pollPaymentStatus = async (sid, attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setStatus('timeout');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/pro/status/${sid}`);
      const data = await response.json();

      if (data.payment_status === 'paid') {
        setStatus('success');
        setPaymentInfo(data);
        
        // Update local user if subscription
        const storedUser = localStorage.getItem('user');
        if (storedUser && data.package_id?.includes('pro')) {
          const user = JSON.parse(storedUser);
          user.subscription_tier = 'pro';
          localStorage.setItem('user', JSON.stringify(user));
        }
        return;
      } else if (data.status === 'expired') {
        setStatus('expired');
        return;
      }

      // Continue polling
      setTimeout(() => pollPaymentStatus(sid, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Status check error:', error);
      if (attempts < maxAttempts - 1) {
        setTimeout(() => pollPaymentStatus(sid, attempts + 1), pollInterval);
      } else {
        setStatus('error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center px-4" data-testid="payment-success-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {status === 'checking' && (
          <>
            <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-6" />
            <h1 className="font-cinzel text-2xl text-gold mb-2">Processing Payment...</h1>
            <p className="font-crimson text-cream/70">Please wait while we confirm your purchase.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="font-cinzel text-3xl text-gold mb-3">Payment Successful!</h1>
            <p className="font-crimson text-xl text-cream/90 mb-2">
              {paymentInfo?.package_name || 'Your purchase'} is now active.
            </p>
            <p className="font-crimson text-cream/60 mb-8">
              Thank you for supporting Where The Crowlands. Your magical journey awaits!
            </p>
            <div className="space-y-3">
              {paymentInfo?.package_id?.includes('pro') && (
                <Link 
                  to="/guides"
                  className="block w-full py-3 bg-gold text-navy-dark font-cinzel rounded-lg hover:bg-gold/90 transition-colors"
                >
                  Start Creating Spells
                </Link>
              )}
              <Link 
                to="/"
                className="block w-full py-3 border border-gold/30 text-gold font-cinzel rounded-lg hover:border-gold/50 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </>
        )}

        {status === 'timeout' && (
          <>
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-cinzel text-2xl text-gold mb-3">Processing Taking Longer Than Expected</h1>
            <p className="font-crimson text-cream/70 mb-6">
              Your payment may still be processing. Please check your email for confirmation.
            </p>
            <Link 
              to="/"
              className="inline-block py-3 px-8 border border-gold/30 text-gold font-cinzel rounded-lg hover:border-gold/50 transition-colors"
            >
              Return Home
            </Link>
          </>
        )}

        {(status === 'error' || status === 'expired') && (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-cinzel text-2xl text-gold mb-3">
              {status === 'expired' ? 'Session Expired' : 'Something Went Wrong'}
            </h1>
            <p className="font-crimson text-cream/70 mb-6">
              {status === 'expired' 
                ? 'This payment session has expired. Please try again.'
                : 'We couldn\'t verify your payment. Please contact support if you were charged.'}
            </p>
            <Link 
              to="/pro"
              className="inline-block py-3 px-8 bg-gold text-navy-dark font-cinzel rounded-lg hover:bg-gold/90 transition-colors"
            >
              Try Again
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

export function PaymentCancel() {
  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center px-4" data-testid="payment-cancel-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="font-cinzel text-2xl text-gold mb-3">Payment Cancelled</h1>
        <p className="font-crimson text-cream/70 mb-6">
          No worries! Your payment was cancelled and you haven't been charged.
        </p>
        <div className="space-y-3">
          <Link 
            to="/pro"
            className="block w-full py-3 bg-gold text-navy-dark font-cinzel rounded-lg hover:bg-gold/90 transition-colors"
          >
            View Plans Again
          </Link>
          <Link 
            to="/"
            className="block w-full py-3 border border-gold/30 text-gold font-cinzel rounded-lg hover:border-gold/50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
