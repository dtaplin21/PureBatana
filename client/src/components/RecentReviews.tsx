import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/routing";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

type Review = {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  customerName?: string;
  user?: {
    firstName: string;
    lastName: string;
  };
};

export default function RecentReviews() {
  const { toast } = useToast();
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews'],
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return await apiRequest("DELETE", `/api/reviews/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">Customer Reviews</h2>
            <p className="text-neutral-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  const recentReviews = reviews?.slice(0, 5) || [];

  if (recentReviews.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">Customer Reviews</h2>
            <p className="text-neutral-600">No reviews yet. Be the first to share your experience!</p>
          </div>
        </div>
      </section>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getInitials = (review: Review) => {
    // Use customerName if provided, otherwise fall back to user data
    if (review.customerName) {
      const parts = review.customerName.trim().split(' ');
      return parts.length > 1 ? `${parts[0][0]}${parts[parts.length-1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
    }
    if (!review.user?.firstName && !review.user?.lastName) return "A"; // Anonymous
    return `${review.user.firstName?.[0] || ""}${review.user.lastName?.[0] || ""}`.toUpperCase();
  };

  const getName = (review: Review) => {
    // Use customerName if provided, otherwise fall back to user data
    if (review.customerName) return review.customerName;
    if (!review.user?.firstName && !review.user?.lastName) return "Anonymous";
    return `${review.user.firstName || ""} ${review.user.lastName || ""}`.trim();
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">Customer Reviews</h2>
          <p className="text-neutral-600">See what our customers are saying about Pure Batana Oil</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recentReviews.map((review) => (
            <Card key={review.id} className="bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#3a5a40] text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {getInitials(review)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{getName(review)}</p>
                      <p className="text-xs text-neutral-500">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReviewMutation.mutate(review.id)}
                    disabled={deleteReviewMutation.isPending}
                    className="h-8 w-8 p-0 text-neutral-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex mb-3">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/reviews">
            <Button 
              variant="outline" 
              className="border-[#3a5a40] text-[#3a5a40] hover:bg-[#3a5a40] hover:text-white px-8 py-3"
            >
              View All Reviews ({reviews?.length || 0})
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}