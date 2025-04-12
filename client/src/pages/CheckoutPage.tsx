import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutPage() {
  const [location, setLocation] = useLocation();
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Payment info state (in a real app, would use a payment processor)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Determine shipping
  const shippingFee = cartTotal >= 50 ? 0 : 5.95;
  const orderTotal = cartTotal + shippingFee;
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation (basic example)
    if (!firstName || !lastName || !email || !address || !city || !state || !zip || !country) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast({
        title: "Payment information required",
        description: "Please enter your payment details",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, you'd process payment through a payment processor
      
      // Hard-coded user ID for demo (in a real app, this would be the logged-in user)
      const userId = 1;
      
      // Create order with order items
      const orderData = {
        order: {
          userId,
          status: "pending",
          total: orderTotal,
          shippingAddress: `${address}, ${city}, ${state} ${zip}, ${country}`,
          billingAddress: `${address}, ${city}, ${state} ${zip}, ${country}`,
        },
        orderItems: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };
      
      // Submit order to backend
      await apiRequest("POST", "/api/orders", orderData);
      
      // Clear cart
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
      
      // Redirect to confirmation page (in a real app)
      setTimeout(() => {
        setLocation("/");
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error placing order",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
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
            
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
              <h2 className="font-display font-semibold text-xl mb-4">Payment Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="•••• •••• •••• ••••" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Name on Card *</Label>
                  <Input 
                    id="cardName" 
                    value={cardName} 
                    onChange={(e) => setCardName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiration Date (MM/YY) *</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      value={expiry} 
                      onChange={(e) => setExpiry(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      value={cvv} 
                      onChange={(e) => setCvv(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#3a5a40] hover:bg-[#588157] text-lg h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Complete Purchase • $${orderTotal.toFixed(2)}`}
            </Button>
          </form>
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
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
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
                <span className="font-medium">
                  {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
                </span>
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
