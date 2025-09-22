import { Link } from "@/lib/routing";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/apiConfig";

// Extended type for product with review count
type ProductWithMeta = Product & {
  reviewCount: number;
};

export default function Hero() {
  // Fetch product data from API
  const { data: product, isLoading, error } = useQuery<ProductWithMeta>({
    queryKey: ['/api/products/pure-batana-oil'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.RENDER.PRODUCT_BY_SLUG('pure-batana-oil'));
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const result = await response.json();
      return result.data || result; // Handle different response formats
    },
    retry: 2, // Retry twice if it fails
    staleTime: 0, // No cache - always fetch fresh data
  });
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `1 × ${product.name} added to your cart`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Add to cart then redirect to checkout
      addToCart(product, 1);
      window.location.href = '/checkout';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-r from-[rgba(58,90,64,0.05)] to-[rgba(163,177,138,0.1)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
              <div className="animate-pulse">
                <div className="h-16 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-6 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-8 w-full"></div>
                <div className="h-4 bg-gray-300 rounded mb-8 w-2/3"></div>
                <div className="h-12 bg-gray-300 rounded w-48"></div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="animate-pulse">
                <div className="w-full max-w-md mx-auto h-96 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-r from-[rgba(58,90,64,0.05)] to-[rgba(163,177,138,0.1)]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Unable to load product</h1>
            <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#3a5a40] text-white px-6 py-2 rounded hover:bg-[#588157]"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show error if no product data
  if (!product) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-r from-[rgba(58,90,64,0.05)] to-[rgba(163,177,138,0.1)]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Product not found</h1>
            <p className="text-gray-600">The requested product could not be loaded.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-[rgba(58,90,64,0.05)] to-[rgba(163,177,138,0.1)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-[#3a5a40] mb-4 leading-tight">Pure Batana Oil</h1>
            <p className="text-[#588157] text-xl font-medium mb-6">Ancient Honduran beauty secret for hair & skin</p>
            <p className="text-neutral-800 mb-8 max-w-xl">Handcrafted by indigenous Miskito women in Honduras, our 100% pure, cold-pressed Batana Oil delivers transformative moisturizing and revitalizing benefits. This centuries-old beauty secret is now available to you in its purest form.</p>
            <div className="flex items-center mb-8">
              <div className="flex mr-3">
                {product.reviewCount && product.reviewCount > 0 ? (
                  <>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star-half-alt text-yellow-500"></i>
                  </>
                ) : (
                  <>
                    <i className="fas fa-star text-gray-300"></i>
                    <i className="fas fa-star text-gray-300"></i>
                    <i className="fas fa-star text-gray-300"></i>
                    <i className="fas fa-star text-gray-300"></i>
                    <i className="fas fa-star text-gray-300"></i>
                  </>
                )}
              </div>
              <span className="text-sm text-neutral-600">
                {product.reviewCount && product.reviewCount > 0 
                  ? `4.8/5 (${product.reviewCount} ${product.reviewCount === 1 ? 'review' : 'reviews'})`
                  : 'No reviews yet'
                }
              </span>
              
              {product.viewCount && product.viewCount > 0 && (
                <span className="ml-3 text-sm text-neutral-500 flex items-center">
                  <i className="fas fa-eye mr-1"></i>
                  {product.viewCount} views
                </span>
              )}
            </div>
            <div className="flex items-center mb-8">
              <p className="text-2xl font-display font-bold mr-4">
                ${(product.price < 100 ? product.price : product.price / 100).toFixed(2)}
              </p>
              <span className="text-neutral-600">2 oz (60ml)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                className="bg-[#3a5a40] hover:bg-[#588157] h-12 px-8" 
                onClick={handleBuyNow}
              >
                <i className="fas fa-credit-card mr-2"></i> Buy Now
              </Button>
              <Button 
                onClick={handleAddToCart}
                variant="outline" 
                className="border-[#3a5a40] text-[#3a5a40] hover:bg-[#3a5a40] hover:text-white h-12 px-8"
              >
                <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/images/batana-new.jpeg" 
              alt="Pure Batana Oil" 
              className="w-full max-w-md mx-auto rounded-lg shadow-xl" 
              loading="eager"
              onError={(e) => {
                console.error("Image failed to load");
                e.currentTarget.src = "/images/batana-new.jpeg"; // Fallback image
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
