import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Review } from "@shared/schema";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import ProductGallery from "@/components/ProductGallery";
import QuantitySelector from "@/components/QuantitySelector";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

// Extended type for product with review count
type ProductWithMeta = Product & {
  reviewCount: number;
};

// Extended type for review with user info
type ReviewWithUser = Review & {
  user?: {
    firstName: string | null;
    lastName: string | null;
  };
};

export default function ProductPage() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: productLoading, isError: productError } = useQuery<ProductWithMeta>({
    queryKey: [`/api/products/${slug}`],
  });
  
  // Fetch reviews once we have the product ID
  const { data: reviews, isLoading: reviewsLoading } = useQuery<ReviewWithUser[]>({
    queryKey: [`/api/reviews/product/${product?.id}`],
    enabled: !!product?.id, // Only run the query if we have a product ID
  });

  if (productLoading) {
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

  if (productError || !product) {
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
    // Add quantity parameter to the Stripe URL using multiple formats to ensure compatibility
    window.location.href = `https://buy.stripe.com/bIYaH15It3iq2yI6oo?items[0][quantity]=${quantity}&adjust_quantity[pure_batana]=total&quantity=${quantity}`;
  };

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Gallery */}
            <div className="lg:w-1/2">
              {product.slug === "pure-batana-oil" ? (
                <ProductGallery images={["/images/batana-front.jpg", "/images/batana-instructions.jpg", "/images/batana-benefits.jpg", "/images/batana-topview.jpg"]} />
              ) : (
                <ProductGallery images={product.images} />
              )}
            </div>
            
            {/* Product Details */}
            <div className="lg:w-1/2">
              <div className="mb-8">
                <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-2">{product.name}</h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex mr-3">
                      {product.reviewCount > 0 ? (
                        <div className="flex">
                          <i className="fas fa-star text-yellow-500"></i>
                          <i className="fas fa-star text-yellow-500"></i>
                          <i className="fas fa-star text-yellow-500"></i>
                          <i className="fas fa-star text-yellow-500"></i>
                          <i className="fas fa-star-half-alt text-yellow-500"></i>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm mr-1">No ratings yet</span>
                      )}
                    </div>
                    <a href="#reviews" className="text-sm text-[#588157] hover:underline">
                      {product.reviewCount > 0 ? (
                        `${product.reviewCount} ${product.reviewCount === 1 ? 'review' : 'reviews'}`
                      ) : (
                        'Write the first review'
                      )}
                    </a>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <i className="fas fa-eye mr-1"></i>
                    <span>{product.viewCount} views</span>
                  </div>
                </div>
                <div className="flex flex-wrap mb-2">
                  {product.isBestseller && <Badge className="bg-[#588157] mb-2 mr-2">Bestseller</Badge>}
                  {product.isNew && <Badge className="bg-[#a3b18a] mb-2">New</Badge>}
                </div>
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
          <h2 className="font-display font-bold text-2xl md:text-3xl text-[#3a5a40] mb-8 text-center">
            Customer Reviews {product.reviewCount > 0 && `(${product.reviewCount})`}
          </h2>
          
          {/* Show empty state or reviews */}
          {product.reviewCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Be the first to review this product</p>
              <button className="bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-2 px-6 rounded-full transition-colors">
                Write a Review
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {reviewsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="h-5 bg-gray-200 rounded w-28 mb-2"></div>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <div key={s} className="h-4 w-4 bg-gray-200 rounded-full"></div>
                            ))}
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-16 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : reviews && reviews.length > 0 ? (
                <>
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-display font-semibold text-lg">
                            {review.user ? 
                              `${review.user.firstName || ''} ${review.user.lastName ? review.user.lastName.charAt(0) + '.' : ''}` : 
                              'Anonymous User'}
                          </h3>
                          <div className="flex text-yellow-500 mt-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <i key={star} className={`fas fa-star${star > review.rating ? '-half-alt' : ''} ${star > Math.ceil(review.rating) ? 'text-gray-300' : 'text-yellow-500'}`}></i>
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {review.createdAt ? format(new Date(review.createdAt), 'MMMM d, yyyy') : ''}
                        </span>
                      </div>
                      <p className="text-gray-700">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews available at this moment.</p>
                </div>
              )}
              
              <div className="text-center mt-8">
                <button className="bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-2 px-6 rounded-full transition-colors">
                  Write a Review
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
