import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import ProductGallery from "@/components/ProductGallery";
import QuantitySelector from "@/components/QuantitySelector";
import Newsletter from "@/components/Newsletter";
import { Badge } from "@/components/ui/badge";

export default function ProductPage() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
          <div className="lg:w-1/2">
            <div className="mb-4 h-96 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h2>
        <p className="mb-8">Sorry, the product you're looking for doesn't exist or has been removed.</p>
        <a href="/" className="bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-3 px-8 rounded-full transition-colors">
          Return to Home
        </a>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.location.href = "/checkout";
  };

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Gallery */}
            <div className="lg:w-1/2">
              <ProductGallery images={product.images} />
            </div>
            
            {/* Product Details */}
            <div className="lg:w-1/2">
              <div className="mb-8">
                <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex mr-3">
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star-half-alt text-yellow-500"></i>
                  </div>
                  <a href="#reviews" className="text-sm text-[#588157] hover:underline">124 reviews</a>
                </div>
                {product.isBestseller && <Badge className="bg-[#588157] mb-2">Bestseller</Badge>}
                {product.isNew && <Badge className="bg-[#a3b18a] mb-2 ml-2">New</Badge>}
                <p className="text-2xl font-display font-bold">${product.price.toFixed(2)}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-display font-semibold text-lg mb-3">Description</h3>
                <p className="mb-4">{product.description}</p>
              </div>
              
              {product.benefits && (
                <div className="mb-8">
                  <h3 className="font-display font-semibold text-lg mb-3">Key Benefits</h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <i className="fas fa-check text-[#588157] mr-2 mt-1"></i>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="font-display font-semibold text-lg mb-3">Quantity</h3>
                <div className="flex items-center mb-6">
                  <QuantitySelector 
                    quantity={quantity} 
                    onIncrease={() => setQuantity(qty => qty + 1)} 
                    onDecrease={() => setQuantity(qty => (qty > 1 ? qty - 1 : 1))}
                    onChangeQuantity={(value) => setQuantity(parseInt(value) || 1)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-3 px-8 rounded-full transition-colors inline-flex items-center w-full sm:w-auto justify-center"
                    onClick={handleAddToCart}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                  </button>
                  <button 
                    className="border border-[#3a5a40] text-[#3a5a40] hover:bg-[#3a5a40] hover:text-white font-medium py-3 px-8 rounded-full transition-colors w-full sm:w-auto justify-center"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-6">
                <div className="flex items-center gap-x-4">
                  <div className="flex items-center">
                    <i className="fas fa-shipping-fast text-[#588157] mr-2"></i>
                    <span className="text-sm">Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-lock text-[#588157] mr-2"></i>
                    <span className="text-sm">Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {product.usage && (
        <section className="py-16 bg-[#f8f7f4]">
          <div className="container mx-auto px-4">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-[#3a5a40] mb-6 text-center">How to Use</h2>
            <div className="max-w-3xl mx-auto">
              <p className="mb-4">{product.usage}</p>
            </div>
          </div>
        </section>
      )}
      
      <section id="reviews" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-[#3a5a40] mb-8 text-center">Customer Reviews</h2>
          
          {/* Show reviews when we implement the reviews system */}
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Be the first to review this product</p>
            <button className="bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-2 px-6 rounded-full transition-colors">
              Write a Review
            </button>
          </div>
        </div>
      </section>
      
      <Newsletter />
    </>
  );
}
