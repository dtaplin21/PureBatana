import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
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
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="mb-4">
        <PaymentElement />
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
            <i className="fas fa-credit-card mr-2"></i> Pay Now
          </span>
        }
      </Button>
    </form>
  );
}