import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InsertContactMessage } from "@shared/schema";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <section id="contact" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-8 text-center">Get in Touch</h1>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <p className="mb-8">Have questions about our products or need assistance with your order? We're here to help!</p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#588157] bg-opacity-10 text-[#588157] mr-4">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email Us</h4>
                    <p className="text-neutral-600">hello@purebatana.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#588157] bg-opacity-10 text-[#588157] mr-4">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Call Us</h4>
                    <p className="text-neutral-600">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#588157] bg-opacity-10 text-[#588157] mr-4">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-neutral-600">123 Botanical Way, Portland, OR 97205</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-50 hover:bg-[#3a5a40] hover:text-white text-[#3a5a40] transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-50 hover:bg-[#3a5a40] hover:text-white text-[#3a5a40] transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-50 hover:bg-[#3a5a40] hover:text-white text-[#3a5a40] transition-colors">
                  <i className="fab fa-pinterest-p"></i>
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-50 hover:bg-[#3a5a40] hover:text-white text-[#3a5a40] transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-[#f8f7f4]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-800">Find answers to commonly asked questions about our products and services</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-2">What makes Batana Oil different from other oils?</h3>
              <p>Batana Oil is a traditional oil sourced from the American palm fruit harvested by indigenous Miskito women in Honduras. It's exceptionally rich in omega fatty acids, vitamins, and antioxidants, making it more nourishing and penetrating than many common oils. Its cold-pressed extraction preserves all the natural benefits.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-2">How long does shipping take?</h3>
              <p>Standard shipping typically takes 3-5 business days within the continental US. Expedited shipping options are available at checkout. International shipping times vary by location, usually between 7-14 business days.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-2">Are your products tested on animals?</h3>
              <p>No, Pure Batana is proudly cruelty-free. We never test our products on animals, and neither do our suppliers. We're committed to ethical, sustainable practices across our entire production process.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-2">What is your return policy?</h3>
              <p>We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, you can return it for a full refund within 30 days of delivery. The product must be at least 75% full and in its original packaging.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
