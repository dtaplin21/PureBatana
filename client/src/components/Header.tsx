import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full px-6 py-4 shadow-md bg-white flex justify-between items-center sticky top-0 z-50">
      {/* Logo on the left */}
      <div className="text-xl font-bold text-black">
        <Link href="/">
          <span className="cursor-pointer">PURE BATANA</span>
        </Link>
      </div>

      {/* Navigation links in the middle */}
      <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <Link href="/">
          <span className="hover:text-black transition cursor-pointer">Our Products</span>
        </Link>
        <Link href="/benefits">
          <span className="hover:text-black transition cursor-pointer">Benefits</span>
        </Link>
        <Link href="/how-to-use">
          <span className="hover:text-black transition cursor-pointer">How to Use</span>
        </Link>
      </nav>
      
      {/* Cart button on the right */}
      <div className="hidden md:block">
        <Link href="/cart">
          <button className="flex items-center bg-[#3a5a40] hover:bg-[#588157] text-white px-4 py-2 rounded-full transition-colors">
            <i className="fas fa-shopping-cart mr-2"></i>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-2 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm">
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden flex items-center">
        <Link href="/cart" className="mr-4">
          <button className="flex items-center bg-[#3a5a40] hover:bg-[#588157] text-white px-3 py-1 rounded-full transition-colors">
            <i className="fas fa-shopping-cart mr-1"></i>
            {cartCount > 0 && (
              <span className="ml-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full font-bold text-xs">
                {cartCount}
              </span>
            )}
          </button>
        </Link>
        <button 
          className="text-gray-700" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md z-50 md:hidden">
          <div className="px-6 py-4 flex flex-col space-y-4">
            <Link href="/">
              <span className="block text-gray-700 hover:text-black cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                Our Products
              </span>
            </Link>
            <Link href="/benefits">
              <span className="block text-gray-700 hover:text-black cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                Benefits of Batana Oil
              </span>
            </Link>
            <Link href="/how-to-use">
              <span className="block text-gray-700 hover:text-black cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                How to Use Batana Oil
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;