
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { handleAuthCallback } from '@/utils/auth';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuth = async () => {
      try {
        setStatus('loading');
        // Extract code and state parameters from URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        if (!code || !state) {
          throw new Error('Missing required authentication parameters');
        }
        
        // Process the authentication callback
        await handleAuthCallback(code, state);
        
        // If we get here, authentication was successful
        setStatus('success');
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Authentication error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown authentication error occurred');
      }
    };
    
    processAuth();
  }, [location, navigate]);

  return (
    <FadeIn className="container max-w-md flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Completing Authentication</h2>
              <p className="text-muted-foreground">
                Please wait while we securely connect to your health records...
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Authentication Successful</h2>
              <p className="text-muted-foreground mb-4">
                You've been successfully authenticated. Redirecting to your dashboard...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
              <p className="text-muted-foreground mb-4">
                {errorMessage || 'An error occurred during authentication. Please try again.'}
              </p>
              <Button onClick={() => navigate('/')}>Return to Home</Button>
            </>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default AuthCallback;
