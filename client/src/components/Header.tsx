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
      {/* Main Navigation */}
      <div className="bg-[#3a5a40] text-white py-3">
        <div className="container mx-auto px-4">
          <div className="hidden lg:flex justify-center">
            <div className="flex space-x-8">
              <Link href="/">
                <span className="text-white hover:text-gray-200 font-medium cursor-pointer text-base">
                  Our Products
                </span>
              </Link>
              <Link href="/benefits">
                <span className="text-white hover:text-gray-200 font-medium cursor-pointer text-base">
                  Benefits of Batana Oil
                </span>
              </Link>
              <Link href="/how-to-use">
                <span className="text-white hover:text-gray-200 font-medium cursor-pointer text-base">
                  How to Use Batana Oil
                </span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Nav Button */}
          <div className="lg:hidden flex justify-between items-center">
            <button 
              className="text-white" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <div className="text-center flex-grow">
              <Link href="/">
                <span className="font-display font-bold text-xl text-white tracking-wider cursor-pointer">
                  PURE BATANA
                </span>
              </Link>
            </div>
            <Link href="/cart">
              <span className="text-white relative cursor-pointer">
                <i className="fas fa-shopping-bag"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#3a5a40] text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white w-full absolute left-0 shadow-md z-50 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <span className="font-medium py-2 border-b border-neutral-100 text-base block cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Our Products</span>
            </Link>
            <Link href="/benefits">
              <span className="font-medium py-2 border-b border-neutral-100 text-base block cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Benefits of Batana Oil</span>
            </Link>
            <Link href="/how-to-use">
              <span className="font-medium py-2 border-b border-neutral-100 text-base block cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>How to Use Batana Oil</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}