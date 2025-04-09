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
    <header className="border-b border-neutral-100 sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
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
            <a className="font-display font-bold text-2xl text-[#3a5a40] tracking-wider order-2 lg:order-1 mx-auto lg:mx-0">PURE BATANA</a>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8 order-2">
            <div className="relative group">
              <Link href="/">
                <a className={`font-medium hover:text-[#588157] transition-colors py-2 ${currentLocation === '/' ? 'text-[#588157]' : ''}`}>Shop</a>
              </Link>
              {/* Dropdown menu */}
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <Link href="/">
                    <a className="block px-4 py-2 text-sm hover:bg-neutral-50 hover:text-[#588157]">All Products</a>
                  </Link>
                  <Link href="/?category=hair">
                    <a className="block px-4 py-2 text-sm hover:bg-neutral-50 hover:text-[#588157]">Hair Care</a>
                  </Link>
                  <Link href="/?category=skin">
                    <a className="block px-4 py-2 text-sm hover:bg-neutral-50 hover:text-[#588157]">Skin Care</a>
                  </Link>
                  <Link href="/?category=gift-sets">
                    <a className="block px-4 py-2 text-sm hover:bg-neutral-50 hover:text-[#588157]">Gift Sets</a>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/#benefits">
              <a className={`font-medium hover:text-[#588157] transition-colors py-2 ${currentLocation.includes('benefits') ? 'text-[#588157]' : ''}`}>Benefits</a>
            </Link>
            <Link href="/#story">
              <a className={`font-medium hover:text-[#588157] transition-colors py-2 ${currentLocation.includes('story') ? 'text-[#588157]' : ''}`}>Our Story</a>
            </Link>
            <Link href="/#reviews">
              <a className={`font-medium hover:text-[#588157] transition-colors py-2 ${currentLocation.includes('reviews') ? 'text-[#588157]' : ''}`}>Reviews</a>
            </Link>
            <Link href="/contact">
              <a className={`font-medium hover:text-[#588157] transition-colors py-2 ${currentLocation === '/contact' ? 'text-[#588157]' : ''}`}>Contact</a>
            </Link>
          </div>
          
          {/* Cart and Account */}
          <div className="flex items-center space-x-5 order-3">
            <Link href="/account">
              <a className="hover:text-[#588157] transition-colors">
                <i className="fas fa-user text-lg"></i>
              </a>
            </Link>
            <Link href="/cart">
              <a className="hover:text-[#588157] transition-colors relative">
                <i className="fas fa-shopping-bag text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#588157] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </a>
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white w-full absolute left-0 shadow-md ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <a className="font-medium py-2 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>Shop</a>
            </Link>
            <Link href="/#benefits">
              <a className="font-medium py-2 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
            </Link>
            <Link href="/#story">
              <a className="font-medium py-2 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>Our Story</a>
            </Link>
            <Link href="/#reviews">
              <a className="font-medium py-2 border-b border-neutral-100" onClick={() => setIsMobileMenuOpen(false)}>Reviews</a>
            </Link>
            <Link href="/contact">
              <a className="font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
