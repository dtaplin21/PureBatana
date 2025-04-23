import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface StripeCheckoutFormProps {
  amount: number;
  orderItems: any[];
  quantity: number;
  onSuccess?: () => void;
}

export default function StripeCheckoutForm({ amount, orderItems, quantity, onSuccess }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsProcessing(true);

    // Get the return URL for successful payments or cancellations
    const returnUrl = `${window.location.origin}/checkout-success`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        receipt_email: email, // Send receipt to customer's email
        shipping: {
          name: document.getElementById('shipping-name')?.getAttribute('data-value') || '',
          address: {
            line1: document.getElementById('shipping-address-line1')?.getAttribute('data-value') || '',
            line2: document.getElementById('shipping-address-line2')?.getAttribute('data-value') || '',
            city: document.getElementById('shipping-address-city')?.getAttribute('data-value') || '',
            state: document.getElementById('shipping-address-state')?.getAttribute('data-value') || '',
            postal_code: document.getElementById('shipping-address-postal-code')?.getAttribute('data-value') || '',
            country: document.getElementById('shipping-address-country')?.getAttribute('data-value') || '',
          }
        }
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred with your payment",
        variant: "destructive",
      });
    } else {
      // If no error, the payment has been initiated
      // The customer will be redirected to the return_url
      if (onSuccess) {
        onSuccess();
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="mb-4">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Your email for order confirmation"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-4">
        <label 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Shipping Address
        </label>
        <AddressElement 
          options={{
            mode: 'shipping',
            fields: {
              phone: 'always',
            },
            validation: {
              phone: {
                required: 'always',
              },
            },
          }}
          id="shipping-address"
        />
      </div>
      
      <div className="mb-4">
        <label 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Payment Information
        </label>
        <PaymentElement 
          options={{
            defaultValues: {
              billingDetails: {
                email: email,
              }
            }
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#3a5a40] hover:bg-[#588157] text-lg h-12"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 
          <span className="flex items-center">
            <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
          </span> : 
          <span className="flex items-center">
            <i className="fas fa-credit-card mr-2"></i> Pay Now ${amount.toFixed(2)}
          </span>
        }
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Your information is secured with SSL encryption. We never store your card details.
      </p>
    </form>
  );
}