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
    <header className="border-b border-neutral-100 sticky top-0 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-6">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-[#344e41]" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          {/* Logo */}
          <Link href="/">
            <span className="font-display font-bold text-2xl text-[#3a5a40] tracking-wider order-2 lg:order-1 mx-auto lg:mx-0 cursor-pointer">PURE BATANA</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8 order-2">
            <div className="relative group">
              <Link href="/">
                <span className={`font-medium hover:text-[#588157] transition-colors py-2 text-lg cursor-pointer ${currentLocation === '/' ? 'text-[#588157]' : ''}`}>Our Products</span>
              </Link>
              {/* Dropdown menu */}
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <Link href="/">
                    <span className="block px-4 py-2 text-sm hover:bg-neutral-50 hover:text-[#588157] cursor-pointer">All Products</span>
                  </Link>
                  <Link href="/?category=hair">
                    <span className="block px-4 py-2 text-sm hover:bg-neutral-50 hover:text-[#588157] cursor-pointer">Hair Care</span>
                  </Link>
                  <Link href="/?category=skin">
                    <span className="block px-4 py-2 text-sm hover:bg-neutral-50 hover:text-[#588157] cursor-pointer">Skin Care</span>
                  </Link>
                  <Link href="/?category=gift-sets">
                    <span className="block px-4 py-2 text-sm hover:bg-neutral-50 hover:text-[#588157] cursor-pointer">Gift Sets</span>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/benefits">
              <span className={`font-medium hover:text-[#588157] transition-colors py-2 text-lg cursor-pointer ${currentLocation === '/benefits' ? 'text-[#588157]' : ''}`}>Benefits of Batana Oil</span>
            </Link>
            <Link href="/how-to-use">
              <span className={`font-medium hover:text-[#588157] transition-colors py-2 text-lg cursor-pointer ${currentLocation === '/how-to-use' ? 'text-[#588157]' : ''}`}>How to Use Batana Oil</span>
            </Link>
            <Link href="/story">
              <span className={`font-medium hover:text-[#588157] transition-colors py-2 text-lg cursor-pointer ${currentLocation === '/story' ? 'text-[#588157]' : ''}`}>Our Story</span>
            </Link>
            <Link href="/contact">
              <span className={`font-medium hover:text-[#588157] transition-colors py-2 text-lg cursor-pointer ${currentLocation === '/contact' ? 'text-[#588157]' : ''}`}>Contact</span>
            </Link>
          </div>
          
          {/* Cart and Account */}
          <div className="flex items-center space-x-5 order-3">
            <Link href="/account">
              <span className="hover:text-[#588157] transition-colors cursor-pointer">
                <i className="fas fa-user text-lg"></i>
              </span>
            </Link>
            <Link href="/cart">
              <span className="hover:text-[#588157] transition-colors relative cursor-pointer">
                <i className="fas fa-shopping-bag text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#588157] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white w-full absolute left-0 shadow-md ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
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
            <Link href="/story">
              <span className="font-medium py-2 border-b border-neutral-100 text-base block cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Our Story</span>
            </Link>
            <Link href="/contact">
              <span className="font-medium py-2 text-base block cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
