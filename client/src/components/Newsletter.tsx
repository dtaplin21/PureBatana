import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
      
      toast({
        title: "Thank you for subscribing!",
        description: "You've been added to our newsletter list",
      });
      
      setEmail("");
    } catch (error) {
      const errorResponse = error instanceof Error ? error.message : "Unknown error";
      
      if (errorResponse.includes("409")) {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed to our newsletter",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscription failed",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#3a5a40]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">Join Our Community</h2>
          <p className="text-[#dad7cd] mb-8">Subscribe to our newsletter for exclusive offers, skincare tips, and updates on new products</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#a3b18a] h-12"
              required
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="bg-[#a3b18a] hover:bg-[#dad7cd] text-[#3a5a40] font-medium py-3 px-8 rounded-full transition-colors h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-xs text-[#dad7cd] mt-4">By subscribing, you agree to receive marketing emails from Pure Batana. You can unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
}
