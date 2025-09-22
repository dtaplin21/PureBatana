import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useLocation } from 'wouter';
import { paymentService } from '../lib/paymentService';

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

// Payment form component using Stripe Elements
function CheckoutForm({ 
  orderTotal, 
  onSuccess,
  onError
}: { 
  orderTotal: number, 
  onSuccess: () => void,
  onError: (error: string) => void
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Confirm the payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect to the success page
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required"
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          onError(error.message || "An error occurred with your payment");
        } else {
          onError("An unexpected error occurred");
        }
      } else {
        // Payment successful
        onSuccess();
      }
    } catch (error) {
      onError("Failed to process payment");
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Processing...' : `Complete Purchase • $${orderTotal.toFixed(2)}`}
      </button>
    </form>
  );
}

const EmbeddedCheckoutPage: React.FC = () => {
  const { cart, clearCart, refreshCartPrices } = useCart();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);
  
  // User info state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Shipping address state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");
  
  // Shipping configuration
  const FREE_SHIPPING = import.meta.env.VITE_FREE_SHIPPING === 'true';
  const SHIPPING_COST = 5.95;
  const shippingFee = FREE_SHIPPING ? 0 : SHIPPING_COST;
  const orderTotal = cart.reduce((sum, item) => {
    const priceInDollars = item.product.price < 100 ? item.product.price : item.product.price / 100;
    return sum + (priceInDollars * item.quantity);
  }, 0) + shippingFee;

  useEffect(() => {
    // Only redirect if we're on the checkout page and cart is empty
    if (cart.length === 0 && window.location.pathname === '/checkout') {
      setLocation('/cart');
    }
  }, [cart, setLocation]);

  // Refresh cart prices when embedded checkout page loads
  useEffect(() => {
    if (cart.length > 0) {
      refreshCartPrices();
    }
  }, [cart.length, refreshCartPrices]);

  // Load the payment intent when necessary
  useEffect(() => {
    // Only create a payment intent once we have contact and shipping info
    if (showStripeForm && !clientSecret) {
      const createPaymentIntent = async () => {
        try {
          setLoading(true);
          console.log("Creating payment intent...", { amount: orderTotal, orderItems: cart });
          
          // Create a payment intent by calling your server
          const orderItems = cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }));
          
          const response = await paymentService.createPaymentIntent({
            amount: Math.round(orderTotal * 100), // Convert dollars to cents
            orderItems,
            metadata: {
              email: email,
              customerName: `${firstName} ${lastName}`,
              phone: phone,
              shippingAddress: `${address}, ${city}, ${state} ${zip}, ${country}`
            }
          });
          
          console.log("Payment intent response:", response);
          const data = response;
          
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            console.log("Client secret set:", data.clientSecret);
          } else {
            console.error("No client secret in response:", data);
            throw new Error("No client secret received");
          }
        } catch (error) {
          console.error("Error creating payment intent:", error);
          setError("Could not initialize payment. Please try again.");
          setShowStripeForm(false);
        } finally {
          setLoading(false);
        }
      };
      
      createPaymentIntent();
    }
  }, [showStripeForm, clientSecret, cart, orderTotal, email, firstName, lastName, phone, address, city, state, zip, country]);

  // Handle successful payment
  const handlePaymentSuccess = () => {
    // Clear cart
    clearCart();
    
    // Redirect to success page
    setTimeout(() => {
      setLocation("/checkout/success");
    }, 2000);
  };

  // Handle payment errors
  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Show Stripe form after validating user info
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation of contact and shipping info
    if (!firstName || !lastName || !email || !address || !city || !state || !zip || !country) {
      setError("Please fill out all required fields");
      return;
    }
    
    // If validation passes, move to payment step
    setShowStripeForm(true);
  };

  if (cart.length === 0) {
    return null;
  }

  // Appearance options for Stripe Elements
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3a5a40',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {showStripeForm && clientSecret ? (
              <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
                <h2 className="font-display font-semibold text-xl mb-4">Payment Information</h2>
                <Elements stripe={stripePromise} options={options as any}>
                  <CheckoutForm 
                    orderTotal={orderTotal} 
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
                <button 
                  className="mt-4 w-full"
                  onClick={() => setShowStripeForm(false)}
                >
                  Back to Shipping Information
                </button>
              </div>
            ) : showStripeForm && !clientSecret ? (
              <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
                <h2 className="font-display font-semibold text-xl mb-4">Loading Payment Form...</h2>
                <p className="text-gray-600 mb-4">Setting up secure payment...</p>
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a5a40]"></div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Debug Info:</p>
                  <p>showStripeForm: {showStripeForm.toString()}</p>
                  <p>clientSecret: {clientSecret ? 'Set' : 'Not set'}</p>
                  <p>loading: {loading.toString()}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContinueToPayment}>
                <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
                  <h2 className="font-display font-semibold text-xl mb-4">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
                      <input 
                        id="firstName" 
                        type="text"
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
                      <input 
                        id="lastName" 
                        type="text"
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                      <input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input 
                        id="phone" 
                        type="tel"
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
                  <h2 className="font-display font-semibold text-xl mb-4">Shipping Address</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address *</label>
                      <input 
                        id="address" 
                        type="text"
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
                        <input 
                          id="city" 
                          type="text"
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          required 
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province *</label>
                        <input 
                          id="state" 
                          type="text"
                          value={state} 
                          onChange={(e) => setState(e.target.value)} 
                          required 
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP/Postal Code *</label>
                        <input 
                          id="zip" 
                          type="text"
                          value={zip} 
                          onChange={(e) => setZip(e.target.value)} 
                          required 
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
                        <input 
                          id="country" 
                          type="text"
                          value={country} 
                          onChange={(e) => setCountry(e.target.value)} 
                          required 
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button 
                    type="submit" 
                    className="w-full bg-[#3a5a40] hover:bg-[#588157] text-lg h-12"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Continue to Payment • $${orderTotal.toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
              <h2 className="font-display font-semibold text-xl mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{item.quantity} ×</span>
                      <span>{item.product.name}</span>
                    </div>
                    <span>${((item.product.price < 100 ? item.product.price : item.product.price / 100) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">${(orderTotal - shippingFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">${shippingFee.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedCheckoutPage;
