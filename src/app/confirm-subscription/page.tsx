'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmSubscriptionPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Simulate checking the confirmation token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const emailParam = urlParams.get('email');

    if (emailParam) {
      setEmail(emailParam);
    }

    // Simulate API call to confirm subscription
    setTimeout(() => {
      if (token && emailParam) {
        // In a real app, you would validate the token with your backend
        if (token.length > 10) {
          setStatus('success');
        } else {
          setStatus('invalid');
        }
      } else {
        setStatus('error');
      }
    }, 2000);
  }, []);

  const handleResendConfirmation = async () => {
    setStatus('loading');
    // Simulate resending confirmation email
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const handleUnsubscribe = async () => {
    setStatus('loading');
    // Simulate unsubscribe process
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Email Subscription
          </h1>
          <p className="text-gray-600">
            Manage your email subscription preferences
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Confirming Subscription
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your email subscription...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Subscription Confirmed!
              </h2>
              <p className="text-gray-600 mb-4">
                Thank you for subscribing to InvoicePDF updates. 
                You'll receive notifications about new features and improvements.
              </p>
              {email && (
                <p className="text-sm text-gray-500 mb-4">
                  Confirmed email: <span className="font-medium">{email}</span>
                </p>
              )}
              <div className="space-y-3">
                <button
                  onClick={handleUnsubscribe}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Unsubscribe
                </button>
                <Link
                  href="/"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  Continue to App
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Confirmation Failed
              </h2>
              <p className="text-gray-600 mb-4">
                We couldn't confirm your subscription. The link may be expired or invalid.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleResendConfirmation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Resend Confirmation Email
                </button>
                <Link
                  href="/"
                  className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {status === 'invalid' && (
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Invalid Confirmation Link
              </h2>
              <p className="text-gray-600 mb-4">
                The confirmation link appears to be invalid or has expired. 
                Please request a new confirmation email.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleResendConfirmation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Request New Confirmation
                </button>
                <Link
                  href="/"
                  className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@easyinvoicepdf.com" className="text-blue-600 hover:text-blue-700">
              support@easyinvoicepdf.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
