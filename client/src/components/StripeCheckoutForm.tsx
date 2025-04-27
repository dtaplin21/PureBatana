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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sameBillingAddress, setSameBillingAddress] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    if (!email || !name || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Check if shipping address is complete
    const shippingLine1 = document.getElementById('shipping-address-line1')?.getAttribute('data-value');
    const shippingCity = document.getElementById('shipping-address-city')?.getAttribute('data-value');
    const shippingPostalCode = document.getElementById('shipping-address-postal-code')?.getAttribute('data-value');
    const shippingCountry = document.getElementById('shipping-address-country')?.getAttribute('data-value');
    
    if (!shippingLine1 || !shippingCity || !shippingPostalCode || !shippingCountry) {
      toast({
        title: "Missing Shipping Address",
        description: "Please provide a complete shipping address",
        variant: "destructive",
      });
      return;
    }
    
    // Check if billing address is complete when different from shipping
    if (!sameBillingAddress) {
      const billingLine1 = document.getElementById('billing-address-line1')?.getAttribute('data-value');
      const billingCity = document.getElementById('billing-address-city')?.getAttribute('data-value');
      const billingPostalCode = document.getElementById('billing-address-postal-code')?.getAttribute('data-value');
      const billingCountry = document.getElementById('billing-address-country')?.getAttribute('data-value');
      
      if (!billingLine1 || !billingCity || !billingPostalCode || !billingCountry) {
        toast({
          title: "Missing Billing Address",
          description: "Please provide a complete billing address",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);

    // Get the return URL for successful payments or cancellations
    const returnUrl = `${window.location.origin}/checkout-success`;

    try {
      // Get shipping address details
      const shippingAddress = {
        line1: document.getElementById('shipping-address-line1')?.getAttribute('data-value') || '',
        line2: document.getElementById('shipping-address-line2')?.getAttribute('data-value') || '',
        city: document.getElementById('shipping-address-city')?.getAttribute('data-value') || '',
        state: document.getElementById('shipping-address-state')?.getAttribute('data-value') || '',
        postal_code: document.getElementById('shipping-address-postal-code')?.getAttribute('data-value') || '',
        country: document.getElementById('shipping-address-country')?.getAttribute('data-value') || '',
      };
      
      // Get billing address details if different from shipping
      let billingAddress;
      if (!sameBillingAddress) {
        billingAddress = {
          line1: document.getElementById('billing-address-line1')?.getAttribute('data-value') || '',
          line2: document.getElementById('billing-address-line2')?.getAttribute('data-value') || '',
          city: document.getElementById('billing-address-city')?.getAttribute('data-value') || '',
          state: document.getElementById('billing-address-state')?.getAttribute('data-value') || '',
          postal_code: document.getElementById('billing-address-postal-code')?.getAttribute('data-value') || '',
          country: document.getElementById('billing-address-country')?.getAttribute('data-value') || '',
        };
      } else {
        billingAddress = shippingAddress;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              name: name,
              email: email,
              phone: phone,
              address: billingAddress,
            },
          },
          shipping: {
            name: name,
            phone: phone,
            address: shippingAddress,
          }
        },
      });

      if (error) {
        console.error('Payment confirmation error:', error);
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
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({
        title: "Payment Failed",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
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
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="phone" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-4">
        <label 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Shipping Address <span className="text-red-500">*</span>
        </label>
        <AddressElement 
          options={{
            mode: 'shipping',
            // Remove phone field and validation since we have a separate field
          }}
          id="shipping-address"
        />
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-[#3a5a40] focus:ring-[#588157] border-gray-300 rounded"
            checked={sameBillingAddress}
            onChange={(e) => setSameBillingAddress(e.target.checked)}
          />
          <span className="ml-2 text-sm text-gray-700">
            Billing address same as shipping address
          </span>
        </label>
      </div>
      
      {!sameBillingAddress && (
        <div className="mb-4">
          <label 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Billing Address <span className="text-red-500">*</span>
          </label>
          <AddressElement 
            options={{
              mode: 'billing',
            }}
            id="billing-address"
          />
        </div>
      )}
      
      <div className="mb-4">
        <label 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Payment Information <span className="text-red-500">*</span>
        </label>
        <PaymentElement 
          options={{
            defaultValues: {
              billingDetails: {
                name: name,
                email: email,
                phone: phone,
              }
            },
            fields: {
              billingDetails: 'never', // We're handling billing details separately
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
          <span className="flex items-center justify-center">
            <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
          </span> : 
          <span className="flex items-center justify-center">
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