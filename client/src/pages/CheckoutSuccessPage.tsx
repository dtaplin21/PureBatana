import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

// Lazy load Stripe only when needed
const stripePromise = (async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  const LIVE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!LIVE_STRIPE_PUBLIC_KEY) {
    console.warn('⚠️ VITE_STRIPE_PUBLIC_KEY not set - Stripe functionality disabled');
    return null;
  }
  
  return loadStripe(LIVE_STRIPE_PUBLIC_KEY);
})();

const CheckoutSuccessPage: React.FC = () => {
  const [location] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      // Fetch order details from your backend
      fetchOrderDetails(sessionId);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/order-details?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank you for your order!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your payment has been processed successfully. We'll send you an email confirmation shortly.
            </p>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">${orderDetails.total?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Paid</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
              <ul className="text-blue-800 space-y-2 text-left">
                <li>• You'll receive an email confirmation with order details</li>
                <li>• We'll process your order and ship it within 1-2 business days</li>
                <li>• You'll get tracking information once your order ships</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </Link>
              
              <Link
                to="/account/orders"
                className="inline-block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                View My Orders
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-2">
                Have questions about your order?
              </p>
              <Link
                to="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact our support team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
