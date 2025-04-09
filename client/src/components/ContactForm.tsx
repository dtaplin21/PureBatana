import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("order");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await apiRequest("POST", "/api/contact", {
        name,
        email,
        subject,
        message
      });
      
      toast({
        title: "Message sent",
        description: "Thank you for contacting us! We'll get back to you soon.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("order");
      setMessage("");
      
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100" onSubmit={handleSubmit}>
      <h3 className="font-display font-semibold text-xl mb-6">Send Us a Message</h3>
      
      <div className="mb-4">
        <Label htmlFor="name" className="block text-sm font-medium mb-2">Name</Label>
        <Input 
          type="text" 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a5a40] focus:border-transparent" 
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="email" className="block text-sm font-medium mb-2">Email</Label>
        <Input 
          type="email" 
          id="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a5a40] focus:border-transparent" 
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</Label>
        <Select
          value={subject}
          onValueChange={setSubject}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order">Order Question</SelectItem>
            <SelectItem value="product">Product Information</SelectItem>
            <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="message" className="block text-sm font-medium mb-2">Message</Label>
        <Textarea 
          id="message" 
          rows={5} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a5a40] focus:border-transparent" 
          required
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-3 px-8 rounded-full transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
