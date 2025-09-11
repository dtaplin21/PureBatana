import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { paymentService } from "@/lib/paymentService";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment form component using Stripe Elements
function CheckoutForm({ 
  orderTotal, 
  shippingInfo, 
  contactInfo,
  onSuccess,
  onError
}: { 
  orderTotal: number, 
  shippingInfo: any,
  contactInfo: any,
  onSuccess: () => void,
  onError: (error: string) => void
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded
      return;
    }

    setIsLoading(true);

    try {
      // Create the order in your database
      const orderData = {
        order: {
          userId: 1, // Use actual user ID if available
          status: "pending",
          total: orderTotal,
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}, ${shippingInfo.country}`,
          billingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}, ${shippingInfo.country}`,
          email: contactInfo.email,
          name: `${contactInfo.firstName} ${contactInfo.lastName}`
        }
      };
      
      // Confirm the payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect to the success page
          return_url: `${window.location.origin}/checkout/success`,
          receipt_email: contactInfo.email,
          payment_method_data: {
            billing_details: {
              name: `${contactInfo.firstName} ${contactInfo.lastName}`,
              email: contactInfo.email,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.zip,
                country: shippingInfo.country
              }
            }
          }
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
      <Button 
        type="submit"
        className="w-full bg-[#3a5a40] hover:bg-[#588157] text-lg h-12 mt-4"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : `Complete Purchase • $${orderTotal.toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const [location, setLocation] = useLocation();
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  // Fixed shipping fee
  const shippingFee = 5.95;
  const orderTotal = cartTotal + shippingFee;
  
  // Contact and shipping info objects
  const contactInfo = {
    firstName,
    lastName,
    email,
    phone
  };
  
  const shippingInfo = {
    address,
    city,
    state,
    zip,
    country
  };
  
  // Load the payment intent when necessary
  useEffect(() => {
    // Only create a payment intent once we have contact and shipping info
    if (showStripeForm && !clientSecret) {
      const createPaymentIntent = async () => {
        try {
          setIsSubmitting(true);
          console.log("Creating payment intent...", { 
            orderTotal, 
            amountInCents: Math.round(orderTotal * 100), 
            orderItems: cart,
            calculation: `${orderTotal} * 100 = ${Math.round(orderTotal * 100)}`
          });
          
          // Create a payment intent by calling your server
          const orderItems = cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }));
          
          const amountInCents = Math.round(orderTotal * 100);
          const requestData = {
            amount: amountInCents, // Convert dollars to cents
            orderItems,
            metadata: {
              email: email,
              customerName: `${firstName} ${lastName}`,
              phone: phone,
              shippingAddress: `${address}, ${city}, ${state} ${zip}, ${country}`
            }
          };
          
          console.log("Amount conversion:", {
            orderTotal,
            amountInCents,
            calculation: `${orderTotal} * 100 = ${amountInCents}`,
            isCorrect: amountInCents >= 50
          });
          console.log("Sending payment intent request:", requestData);
          const response = await paymentService.createPaymentIntent(requestData);
          
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
          toast({
            title: "Payment error",
            description: "Could not initialize payment. Please try again.",
            variant: "destructive"
          });
          setShowStripeForm(false);
        } finally {
          setIsSubmitting(false);
        }
      };
      
      createPaymentIntent();
    }
  }, [showStripeForm, clientSecret, cart, orderTotal, toast]);
  
  // Handle successful payment
  const handlePaymentSuccess = () => {
    toast({
      title: "Payment successful!",
      description: "Your order has been placed. We've sent a confirmation email with your receipt.",
    });
    
    // Clear cart
    clearCart();
    
    // Redirect to success page
    setTimeout(() => {
      setLocation("/checkout/success");
    }, 2000);
  };
  
  // Handle payment errors
  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: "Payment failed",
      description: errorMessage,
      variant: "destructive",
    });
  };
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-6">Checkout</h1>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
          <i className="fas fa-shopping-cart text-4xl text-[#a3b18a] mb-4"></i>
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-neutral-600 mb-6">You need to add items to your cart before checking out.</p>
          <Link href="/">
            <Button className="bg-[#3a5a40] hover:bg-[#588157]">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Show Stripe form after validating user info
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation of contact and shipping info
    if (!firstName || !lastName || !email || !address || !city || !state || !zip || !country) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // If validation passes, move to payment step
    setShowStripeForm(true);
  };

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
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {showStripeForm && clientSecret ? (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
              <h2 className="font-display font-semibold text-xl mb-4">Payment Information</h2>
              <Elements stripe={stripePromise} options={options as any}>
                <CheckoutForm 
                  orderTotal={orderTotal} 
                  shippingInfo={shippingInfo}
                  contactInfo={contactInfo}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
              <Button 
                className="mt-4 w-full"
                variant="outline"
                onClick={() => setShowStripeForm(false)}
              >
                Back to Shipping Information
              </Button>
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
                <p>isSubmitting: {isSubmitting.toString()}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleContinueToPayment}>
              <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
                <h2 className="font-display font-semibold text-xl mb-4">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
                <h2 className="font-display font-semibold text-xl mb-4">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input 
                      id="address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input 
                        id="state" 
                        value={state} 
                        onChange={(e) => setState(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip">ZIP/Postal Code *</Label>
                      <Input 
                        id="zip" 
                        value={zip} 
                        onChange={(e) => setZip(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input 
                        id="country" 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#3a5a40] hover:bg-[#588157] text-lg h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : `Continue to Payment • $${orderTotal.toFixed(2)}`}
                </Button>
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
            
            <Separator className="my-4" />
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">${shippingFee.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f8f7f4] p-4 rounded-lg">
            <h3 className="font-medium mb-2">Have a promo code?</h3>
            <div className="flex gap-2">
              <Input placeholder="Enter code" className="bg-white" />
              <Button variant="outline">Apply</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
