import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLocation] = useLocation();
  const { cart } = useCart();
  
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header className="sticky top-0 bg-white z-50 shadow-sm">
      {/* Promotion Banner */}
      <div className="bg-[#3a5a40] text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            Free shipping on orders over $50 • Use code WELCOME10 for 10% off your first order
          </p>
        </div>
      </div>
    </header>
  );
}