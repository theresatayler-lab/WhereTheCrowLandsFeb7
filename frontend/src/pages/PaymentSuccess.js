import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking'); // checking, success, error
  const [pollCount, setPollCount] = useState(0);
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  
  const pollPaymentStatus = async () => {
    const maxAttempts = 5;
    
    const checkStatus = async (attempt) => {
      if (attempt >= maxAttempts) {
        setStatus('error');
        toast.error('Payment verification timed out. Please check your email.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${BACKEND_URL}/api/stripe/checkout-status/${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.payment_status === 'paid') {
          setStatus('success');
          toast.success('Payment successful! Your account has been upgraded to Pro!');
          
          // Redirect to profile after 3 seconds
          setTimeout(() => {
            navigate('/profile');
          }, 3000);
        } else if (response.data.status === 'expired') {
          setStatus('error');
          toast.error('Payment session expired');
        } else {
          // Continue polling
          setPollCount(attempt + 1);
          setTimeout(() => checkStatus(attempt + 1), 2000);
        }
      } catch (error) {
        console.error('Status check error:', error);
        setStatus('error');
        toast.error('Failed to verify payment');
      }
    };

    checkStatus(0);
  };

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      toast.error('No payment session found');
      return;
    }

    pollPaymentStatus();
  }, [sessionId]); // pollPaymentStatus is stable - defined in component scope

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card/50 border-2 border-primary/30 rounded-sm p-8 text-center"
      >
        {status === 'checking' && (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="font-cinzel text-2xl text-secondary mb-2">Verifying Payment...</h2>
            <p className="font-montserrat text-sm text-muted-foreground mb-4">
              Please wait while we confirm your payment
            </p>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= pollCount ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="font-cinzel text-2xl text-secondary mb-2">Payment Successful!</h2>
            <p className="font-montserrat text-sm text-foreground mb-4">
              Welcome to Pro! Your account has been upgraded.
            </p>
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-sm">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-montserrat text-sm text-primary font-medium">
                You now have unlimited access to all features!
              </p>
            </div>
            <p className="font-montserrat text-xs text-muted-foreground mt-4">
              Redirecting to your profile...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✕</span>
            </div>
            <h2 className="font-cinzel text-2xl text-secondary mb-2">Verification Issue</h2>
            <p className="font-montserrat text-sm text-muted-foreground mb-4">
              We couldn&apos;t verify your payment. If you were charged, please contact support.
            </p>
            <button
              onClick={() => navigate('/upgrade')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all"
            >
              Try Again
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};