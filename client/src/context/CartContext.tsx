import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@shared/schema";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface CartItemType {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItemType[];
  addToCart: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  refreshCartPrices: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  refreshCartPrices: async () => {},
  cartTotal: 0,
  cartCount: 0,
  isLoading: true,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItemType[]>([]);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart to localStorage", error);
      }
    }
  }, [cart, isLoading]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(currentCart => {
      // Check if product already exists in cart
      const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if product already exists
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new product to cart
        return [...currentCart, { product, quantity }];
      }
    });
  };

  const removeItem = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(currentCart => 
      currentCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Refresh cart prices by fetching fresh product data
  const refreshCartPrices = async () => {
    if (cart.length === 0) return;
    
    try {
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          try {
            // Fetch fresh product data from API with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`${API_ENDPOINTS.RENDER.PRODUCT_BY_SLUG(item.product.slug)}?t=${Date.now()}`, {
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            
            const result = await response.json();
            const freshProduct = result.data || result;
            
            return {
              ...item,
              product: freshProduct
            };
          } catch (error) {
            console.error(`Failed to refresh price for product ${item.product.id}:`, error);
            // Return original item if refresh fails
            return item;
          }
        })
      );
      
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to refresh cart prices:', error);
    }
  };

  // Calculate cart total (convert cents to dollars, handle both formats)
  const cartTotal = cart.reduce((total, item) => {
    // If price is less than 100, assume it's already in dollars
    // If price is 100 or more, assume it's in cents and convert
    const priceInDollars = item.product.price < 100 ? item.product.price : item.product.price / 100;
    return total + (priceInDollars * item.quantity);
  }, 0);
  
  // Calculate total number of items
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
      refreshCartPrices,
      cartTotal,
      cartCount,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};
