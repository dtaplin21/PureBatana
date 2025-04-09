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
      <div className="bg-white py-3 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo - Left Side */}
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="font-display font-bold text-2xl text-[#3a5a40] tracking-wider cursor-pointer">
                  PURE BATANA
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation - Right Side */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/">
                <span className={`text-gray-800 hover:text-[#588157] font-medium cursor-pointer text-base transition-colors ${currentLocation === '/' ? 'text-[#588157]' : ''}`}>
                  Our Products
                </span>
              </Link>
              <Link href="/benefits">
                <span className={`text-gray-800 hover:text-[#588157] font-medium cursor-pointer text-base transition-colors ${currentLocation === '/benefits' ? 'text-[#588157]' : ''}`}>
                  Benefits of Batana Oil
                </span>
              </Link>
              <Link href="/how-to-use">
                <span className={`text-gray-800 hover:text-[#588157] font-medium cursor-pointer text-base transition-colors ${currentLocation === '/how-to-use' ? 'text-[#588157]' : ''}`}>
                  How to Use Batana Oil
                </span>
              </Link>
              
              {/* Cart Icon */}
              <Link href="/cart">
                <span className="hover:text-[#588157] transition-colors relative cursor-pointer ml-4">
                  <i className="fas fa-shopping-bag text-lg"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#588157] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </span>
              </Link>
            </div>
            
            {/* Mobile Navigation Button */}
            <div className="flex lg:hidden items-center">
              <Link href="/cart" className="mr-4">
                <span className="hover:text-[#588157] transition-colors relative cursor-pointer">
                  <i className="fas fa-shopping-bag text-lg"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#588157] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </span>
              </Link>
              <button 
                className="text-gray-800" 
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
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