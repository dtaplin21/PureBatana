import { Link } from "@/lib/routing";
import { Button } from "@/components/ui/button";

export default function Testimonials() {
  // Empty testimonials array - no hardcoded testimonials
  const testimonials: any[] = [];

  return (
    <section id="reviews" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">What Our Customers Say</h2>
          <p className="text-neutral-800">Real experiences from our community of Batana Oil users</p>
        </div>
        
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
                <div className="flex text-yellow-500 mb-4">
                  {/* Rating stars would go here */}
                </div>
                <p className="italic mb-6 text-neutral-800">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden mr-4">
                    <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-neutral-600">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white p-8 rounded-lg shadow-sm border border-neutral-100 max-w-xl mx-auto">
            <p className="text-neutral-600 mb-6">Be the first to share your experience with Pure Batana Oil!</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link href="/reviews">
            <Button variant="outline" className="text-[#3a5a40] border-neutral-200 font-medium py-3 px-8 rounded-full inline-flex items-center">
              Write a Review
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
