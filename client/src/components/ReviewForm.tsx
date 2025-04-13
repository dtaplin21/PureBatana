import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reviewSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  rating: z.string().min(1, "Please select a rating"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment must be less than 500 characters"),
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
      productId: productId ? productId.toString() : "",
      rating: "",
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      await apiRequest("POST", "/api/reviews", {
        productId: parseInt(values.productId),
        rating: parseInt(values.rating),
        comment: values.comment,
        // User ID will be handled on server based on session
      });

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
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!productId && (
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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