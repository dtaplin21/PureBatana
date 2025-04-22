import { Link } from "@/lib/routing";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

// Extended type for product with review count
type ProductWithMeta = Product & {
  reviewCount: number;
};

export default function Hero() {
  // Fetch the product data for the hero 
  const { data: product, isLoading } = useQuery<ProductWithMeta>({
    queryKey: ['/api/products/pure-batana-oil'],
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

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-[rgba(58,90,64,0.05)] to-[rgba(163,177,138,0.1)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-[#3a5a40] mb-4 leading-tight">Pure Batana Oil</h1>
            <p className="text-[#588157] text-xl font-medium mb-6">Ancient Honduran beauty secret for hair & skin</p>
            <p className="text-neutral-800 mb-8 max-w-xl">Handcrafted by indigenous Miskito women in Honduras, our 100% pure, cold-pressed Batana Oil delivers transformative moisturizing and revitalizing benefits. This centuries-old beauty secret is now available to you in its purest form.</p>
            <div className="flex items-center mb-8">
              {!isLoading && (
                <>
                  <div className="flex mr-3">
                    {product?.reviewCount && product.reviewCount > 0 ? (
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
                    {product?.reviewCount && product.reviewCount > 0 
                      ? `4.8/5 (${product.reviewCount} ${product.reviewCount === 1 ? 'review' : 'reviews'})`
                      : 'No reviews yet'
                    }
                  </span>
                  
                  {product?.viewCount && product.viewCount > 0 && (
                    <span className="ml-3 text-sm text-neutral-500 flex items-center">
                      <i className="fas fa-eye mr-1"></i>
                      {product.viewCount} views
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center mb-8">
              <p className="text-2xl font-display font-bold mr-4">
                ${isLoading ? '29.95' : product?.price.toFixed(2)}
              </p>
              <span className="text-neutral-600">2 oz (60ml)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://buy.stripe.com/bIYaH15It3iq2yI6oo?items[0][quantity]=1&adjust_quantity[pure_batana]=total&quantity=1" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#3a5a40] hover:bg-[#588157] h-12 px-8">
                  <i className="fas fa-credit-card mr-2"></i> Buy Now
                </Button>
              </a>
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
              src="/batana-front.jpg" 
              alt="Pure Batana Oil" 
              className="w-full max-w-md mx-auto rounded-lg shadow-xl" 
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
