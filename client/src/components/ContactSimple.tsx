import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import "./contact.css";

export default function ContactSimple() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const { toast } = useToast();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult("Sending....");
    
    try {
      // Use our existing API endpoint
      await apiRequest("POST", "/api/contact", {
        name,
        email,
        subject: "Contact Form Submission",
        message
      });
      
      setResult("Form Submitted Successfully");
      toast({
        title: "Message sent",
        description: "Thank you for contacting us! We'll get back to you soon.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      
    } catch (error) {
      console.log("Error", error);
      setResult("Failed to send message. Please try again.");
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="contact">        
      <div className="contact-col">
        <h3>Send us a message</h3>
        <p>
          Feel free to reach out through contact form or find our
          contact information below. Your feedback, questions, and 
          suggestions are important to us as we strive to provide exceptional 
          service to our customers.
        </p>
        <ul>
          <li>hello@purebatana.com</li>
          <li>(555) 123-4567</li>
          <li>123 Botanical Way, Portland, OR 97205</li>
        </ul>
      </div>
      <div className="contact-col">
        <form onSubmit={onSubmit}>
          <label>Your Name</label>
          <input 
            type="text" 
            name="name" 
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Write your message here</label>
          <textarea 
            name="message" 
            rows={6}
            placeholder="Message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button 
            type="submit" 
            className="bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-3 px-8 rounded-full transition-colors"
          >
            Submit
          </button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  );
}