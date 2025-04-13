import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Star, StarHalf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    firstName: string | null;
    lastName: string | null;
  };
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  shortDescription: string | null;
  images: string[];
  category: string;
  stock: number;
  featured: boolean | null;
  benefits: string[] | null;
  usage: string | null;
  isBestseller: boolean | null;
  isNew: boolean | null;
}

export default function ReviewsPage() {
  const [filteredProductId, setFilteredProductId] = useState<number | null>(null);
  
  // Fetch all reviews
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/reviews");
      const data = await response.json();
      return data as Review[];
    }
  });
  
  // Fetch products for filtering
  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/products");
      const data = await response.json();
      return data as Product[];
    }
  });
  
  // Filter reviews by product if needed
  const displayedReviews = filteredProductId 
    ? reviews?.filter(review => review.productId === filteredProductId)
    : reviews;
  
  // Render rating stars
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400 w-4 h-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400 w-4 h-4" />);
    }
    
    // Add empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300 w-4 h-4" />);
    }
    
    return stars;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return "Unknown date";
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-neutral-600">Loading reviews...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-2xl text-[#3a5a40] mb-4">Error Loading Reviews</h1>
        <p className="text-neutral-600 mb-6">We couldn't load the reviews. Please try again later.</p>
        <Link href="/">
          <Button className="bg-[#3a5a40] hover:bg-[#588157]">Return to Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-8 text-center">Customer Reviews</h1>
      
      {products && products.length > 1 && (
        <div className="mb-8 flex justify-center">
          <div className="inline-flex flex-wrap gap-2 justify-center">
            <Button 
              variant={filteredProductId === null ? "default" : "outline"}
              className={filteredProductId === null ? "bg-[#3a5a40]" : ""}
              onClick={() => setFilteredProductId(null)}
            >
              All Products
            </Button>
            
            {products.map(product => (
              <Button 
                key={product.id}
                variant={filteredProductId === product.id ? "default" : "outline"}
                className={filteredProductId === product.id ? "bg-[#3a5a40]" : ""}
                onClick={() => setFilteredProductId(product.id)}
              >
                {product.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {displayedReviews && displayedReviews.length > 0 ? (
          displayedReviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-100">
              <div className="flex items-center mb-4">
                <div className="bg-[#f8f7f4] w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-[#3a5a40]" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {review.user ? `${review.user.firstName} ${review.user.lastName.charAt(0)}.` : 'Anonymous User'}
                  </h3>
                  <p className="text-sm text-neutral-500">Verified Buyer</p>
                </div>
                <div className="ml-auto text-sm text-neutral-500">
                  {review.createdAt ? formatDate(review.createdAt) : ''}
                </div>
              </div>
              
              <div className="flex mb-3">
                {renderRating(review.rating)}
              </div>
              
              <p className="text-neutral-700">{review.comment}</p>
              
              {/* Show product info if in "All Products" view */}
              {filteredProductId === null && products && (
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <Link href={`/product/${products.find(p => p.id === review.productId)?.slug || ''}`}>
                    <span className="text-sm font-medium text-[#3a5a40] hover:underline">
                      {products.find(p => p.id === review.productId)?.name || 'Unknown Product'}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-neutral-500 mb-4">No reviews found{filteredProductId !== null ? ' for this product' : ''}.</p>
            <Link href="/">
              <Button className="bg-[#3a5a40] hover:bg-[#588157]">Continue Shopping</Button>
            </Link>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/">
          <Button variant="outline" className="mr-4">
            Continue Shopping
          </Button>
        </Link>
        <Button className="bg-[#3a5a40] hover:bg-[#588157]">
          Write a Review
        </Button>
      </div>
    </div>
  );
}