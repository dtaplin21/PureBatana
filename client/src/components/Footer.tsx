import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#344e41] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-display font-bold text-xl mb-6">PURE BATANA</h3>
            <p className="text-neutral-200 mb-6">Bringing the traditional beauty wisdom of Honduras to modern skincare routines.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                <i className="fab fa-pinterest-p"></i>
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-6">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-neutral-200 hover:text-white transition-colors">All Products</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=hair">
                  <a className="text-neutral-200 hover:text-white transition-colors">Hair Care</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=skin">
                  <a className="text-neutral-200 hover:text-white transition-colors">Skin Care</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=gift-sets">
                  <a className="text-neutral-200 hover:text-white transition-colors">Gift Sets</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-neutral-200 hover:text-white transition-colors">Accessories</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-6">Customer Care</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact">
                  <a className="text-neutral-200 hover:text-white transition-colors">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-200 hover:text-white transition-colors">FAQs</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-neutral-200 hover:text-white transition-colors">Shipping & Returns</a>
                </Link>
              </li>
              <li>
                <Link href="/orders">
                  <a className="text-neutral-200 hover:text-white transition-colors">Track Your Order</a>
                </Link>
              </li>
              <li>
                <Link href="/account">
                  <a className="text-neutral-200 hover:text-white transition-colors">My Account</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-6">About</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#story">
                  <a className="text-neutral-200 hover:text-white transition-colors">Our Story</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-neutral-200 hover:text-white transition-colors">Sustainability</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-neutral-200 hover:text-white transition-colors">Ingredients</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-neutral-200 hover:text-white transition-colors">Press</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-200 hover:text-white transition-colors">Wholesale</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#3a5a40] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-neutral-300">© {new Date().getFullYear()} Pure Batana. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/">
              <a className="text-sm text-neutral-300 hover:text-white transition-colors">Privacy Policy</a>
            </Link>
            <Link href="/">
              <a className="text-sm text-neutral-300 hover:text-white transition-colors">Terms of Service</a>
            </Link>
            <Link href="/">
              <a className="text-sm text-neutral-300 hover:text-white transition-colors">Accessibility</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
