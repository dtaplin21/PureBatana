import { useState } from "react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="bg-[#3a5a40] text-white text-center py-2 text-sm relative">
      <div className="container mx-auto px-4">
        Free shipping on orders over $50 • Use code WELCOME10 for 10% off your first order
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100"
          onClick={() => setIsVisible(false)}
          aria-label="Close announcement"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}
