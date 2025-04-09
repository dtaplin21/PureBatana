import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import Benefits from "@/components/Benefits";
import Story from "@/components/Story";
import HowToUse from "@/components/HowToUse";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  return (
    <>
      <Hero />
      <FeaturesBar />
      <section id="shop" className="py-16 md:py-24 bg-[#dad7cd]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">Our Products</h2>
            <p className="text-neutral-800">Explore our collection of premium Batana Oil products</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm h-96 animate-pulse">
                  <div className="bg-gray-200 h-64 w-full"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded-full w-28"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <a href="#" className="bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-3 px-8 rounded-full transition-colors inline-flex items-center">
              View All Products
            </a>
          </div>
        </div>
      </section>
      <Benefits />
      <Story />
      <HowToUse />
      <Testimonials />
      <Newsletter />
    </>
  );
}
