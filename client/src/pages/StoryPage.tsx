import Story from "@/components/Story";
import { Helmet } from "react-helmet";

export default function StoryPage() {
  return (
    <div>
      <Helmet>
        <title>Our Mission | Pure Batana</title>
        <meta name="description" content="Learn about the mission of Pure Batana. Discover our commitment to natural hair care products and sustainable practices that benefit communities around the world." />
      </Helmet>
      
      <div className="py-12 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-center text-[#3a5a40] mb-6">Our Mission</h1>
          <p className="text-center text-lg text-neutral-700 max-w-3xl mx-auto">
            Creating natural hair care products while making a positive impact on the world.
          </p>
        </div>
      </div>
      
      <Story />
      
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-8">The Full Story</h2>
            
            <div className="prose prose-lg max-w-none">
              <h3>The Founder's Journey</h3>
              <p>
                Jessica Jones Taplin's journey began with a personal struggle. For years, she searched for truly natural hair care products that would nourish her hair without causing irritation or damage. Time and again, products that promised natural care left her hair dry, brittle, or irritated.
              </p>
              <p>
                Drawing on her sensitivity to harsh chemicals and her passion for holistic wellness, Jessica became determined to create something better—a line of hair products made purely from nature's finest ingredients, without compromises.
              </p>
              
              <div className="my-8">
                <img 
                  src="/images/founder.png" 
                  alt="Our Founder Jessica" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-neutral-600 italic mt-2">Our founder Jessica Jones Taplin, who developed Pure Batana Oil</p>
              </div>
              
              <h3>Our Commitment to Nature</h3>
              <p>
                At Gaia Grow, we firmly believe that what's good for your hair should also be good for the planet. This philosophy guides everything we do:
              </p>
              <ul>
                <li>Sustainably sourced botanical extracts from trusted providers</li>
                <li>No sulfates, parabens, or harsh chemicals in any of our products</li>
                <li>Eco-friendly packaging that minimizes environmental impact</li>
                <li>Recyclable materials used throughout our supply chain</li>
                <li>Carbon-neutral shipping options for all orders</li>
              </ul>
              <p>
                These commitments help us cultivate a healthier, more natural environment for everyone.
              </p>
              
              <h3>Making a Global Impact</h3>
              <p>
                Jessica's vision extends beyond creating exceptional hair care products. She takes pride in building a better world, which is why we pledge a portion of every sale to support community-driven projects in Liberia and beyond.
              </p>
              <p>
                Our global initiatives include:
              </p>
              <ul>
                <li><strong>Clean Water</strong> - Funding wells and water purification systems in rural villages</li>
                <li><strong>Education</strong> - Supporting schools and educational programs for children</li>
                <li><strong>Women's Empowerment</strong> - Creating economic opportunities for women in developing regions</li>
                <li><strong>Environmental Conservation</strong> - Protecting natural resources and supporting sustainable practices</li>
              </ul>
              
              <h3>Growing Hope Together</h3>
              <p>
                When you purchase Pure Batana Oil, you're joining us in a mission that extends far beyond beauty. Your support helps us:
              </p>
              <ul>
                <li>Provide clean drinking water to families in need</li>
                <li>Fund school supplies and teacher training in underserved communities</li>
                <li>Support women entrepreneurs through microloans and business education</li>
                <li>Preserve natural environments through conservation initiatives</li>
              </ul>
              <p>
                Together, we're not just growing healthy hair—we're growing hope for a better future.
              </p>
              
              <div className="my-8">
                <img 
                  src="/images/batana-new.jpeg" 
                  alt="Pure Batana Oil Usage" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-neutral-600 italic mt-2">Natural ingredients for natural results</p>
              </div>
              
              <h3>Looking Forward</h3>
              <p>
                Today, Gaia Grow continues to expand its product line while staying true to our founding principles. We remain committed to:
              </p>
              <ul>
                <li>Creating clean, effective products without harmful chemicals</li>
                <li>Maintaining sustainable practices that protect our precious environment</li>
                <li>Supporting communities in need around the world</li>
                <li>Growing our positive impact with every bottle sold</li>
              </ul>
              <p>
                When you choose Pure Batana Oil, you're not just choosing exceptional hair care—you're choosing to be part of a movement that values both personal wellness and global responsibility.
              </p>
              <p>
                We invite you to join Jessica on this journey toward a more beautiful world, inside and out.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}