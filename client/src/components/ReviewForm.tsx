import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/apiConfig";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reviewSchema = z.object({
  rating: z.string().min(1, "Please select a rating"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment must be less than 500 characters"),
  customerName: z.string().optional(),
});

type Product = {
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
};

type ReviewFormProps = {
  products: Product[];
  buttonClassName?: string;
  buttonVariant?: "default" | "outline";
  productId?: number;
  onSuccess?: () => void;
};

export default function ReviewForm({ 
  products, 
  buttonClassName = "bg-[#3a5a40] hover:bg-[#588157]", 
  buttonVariant = "default",
  productId,
  onSuccess
}: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: "",
      comment: "",
      customerName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      const response = await fetch(API_ENDPOINTS.RENDER.REVIEWS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Always use the first product (Pure Batana Oil) for reviews
          productId: 1,
          rating: parseInt(values.rating),
          comment: values.comment,
          customerName: values.customerName || null,
          // User ID will be handled on server based on session
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      // Invalidate reviews cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      
      // Reset form
      form.reset();
      
      // Close dialog
      setOpen(false);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#3a5a40] text-xl">Write a Review</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Share your experience with Pure Batana Oil
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5">★★★★★ (5) Excellent</SelectItem>
                      <SelectItem value="4">★★★★☆ (4) Good</SelectItem>
                      <SelectItem value="3">★★★☆☆ (3) Average</SelectItem>
                      <SelectItem value="2">★★☆☆☆ (2) Below Average</SelectItem>
                      <SelectItem value="1">★☆☆☆☆ (1) Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your experience with this product..."
                      className="resize-none h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name (leave blank to post anonymously)"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#3a5a40] hover:bg-[#588157]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}