import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart, cartTotal, isLoading, refreshCartPrices } = useCart();
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
  
  // Calculate total quantity across all cart items
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  // Disable automatic refresh to prevent hanging - user can manually refresh
  // useEffect(() => {
  //   if (cart.length > 0 && !isLoading) {
  //     refreshCartPrices();
  //   }
  // }, [cart.length, isLoading, refreshCartPrices]);

  const handleRefreshPrices = async () => {
    setIsRefreshingPrices(true);
    try {
      await refreshCartPrices();
    } finally {
      setIsRefreshingPrices(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-6">Your Cart</h1>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4 max-w-xs mx-auto"></div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-6">Your Cart</h1>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
          <i className="fas fa-shopping-cart text-4xl text-[#a3b18a] mb-4"></i>
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-neutral-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/">
            <Button className="bg-[#3a5a40] hover:bg-[#588157]">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Shipping configuration
  const FREE_SHIPPING = import.meta.env.VITE_FREE_SHIPPING === 'true';
  const SHIPPING_COST = 5.95;
  const shippingFee = FREE_SHIPPING ? 0 : SHIPPING_COST;
  const orderTotal = cartTotal + shippingFee;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40]">Your Cart</h1>
        <Button 
          onClick={handleRefreshPrices}
          disabled={isRefreshingPrices}
          variant="outline"
          size="sm"
          className="border-[#3a5a40] text-[#3a5a40] hover:bg-[#3a5a40] hover:text-white"
        >
          {isRefreshingPrices ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#3a5a40] border-t-transparent"></div>
              Refreshing...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh Prices
            </>
          )}
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-neutral-50 border-b border-neutral-100">
              <div className="col-span-6 font-medium">Product</div>
              <div className="col-span-2 font-medium text-center">Price</div>
              <div className="col-span-2 font-medium text-center">Quantity</div>
              <div className="col-span-2 font-medium text-right">Total</div>
            </div>
            
            {cart.map(item => (
              <CartItem 
                key={`${item.product.id}`} 
                item={item} 
                onRemove={() => removeItem(item.product.id)}
                onUpdateQuantity={(quantity) => updateQuantity(item.product.id, quantity)}
              />
            ))}
            
            <div className="p-4 border-t border-neutral-100 flex justify-between">
              <button 
                className="text-[#588157] hover:text-[#3a5a40] text-sm font-medium inline-flex items-center"
                onClick={() => clearCart()}
              >
                <i className="fas fa-trash-alt mr-2"></i> Clear Cart
              </button>
              <Link href="/">
                <button className="text-[#588157] hover:text-[#3a5a40] text-sm font-medium inline-flex items-center">
                  <i className="fas fa-arrow-left mr-2"></i> Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
            <h2 className="font-display font-semibold text-xl mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">
                  {FREE_SHIPPING ? "Free" : `$${SHIPPING_COST.toFixed(2)}`}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="bg-[#f8f7f4] p-3 rounded-md text-sm">
                <p className="flex items-center mb-2">
                  <i className="fas fa-truck text-[#588157] mr-2"></i>
                  <span>Free shipping on all orders!</span>
                </p>
                <p className="flex items-center">
                  <i className="fas fa-shield-alt text-[#588157] mr-2"></i>
                  <span>Secure checkout with SSL encryption</span>
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link href="/checkout">
                <Button className="w-full bg-[#3a5a40] hover:bg-[#588157] text-lg h-12">
                  <i className="fas fa-credit-card mr-2"></i> Secure Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
