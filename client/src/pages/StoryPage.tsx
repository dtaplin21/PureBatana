import Story from "@/components/Story";
import { Helmet } from "react-helmet";

export default function StoryPage() {
  return (
    <div>
      <Helmet>
        <title>Our Story | Pure Batana</title>
        <meta name="description" content="Learn about the history and mission of Pure Batana. Discover how we work with indigenous Miskito communities to bring this traditional oil to the world." />
      </Helmet>
      
      <div className="py-12 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-center text-[#3a5a40] mb-6">Our Story</h1>
          <p className="text-center text-lg text-neutral-700 max-w-3xl mx-auto">
            The journey of Pure Batana from the rainforests of Honduras to you.
          </p>
        </div>
      </div>
      
      <Story />
      
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-8">The Full Story</h2>
            
            <div className="prose prose-lg max-w-none">
              <h3>The Discovery</h3>
              <p>
                Our journey began when our founder, Elena, was traveling through La Mosquitia, the easternmost region of Honduras. While staying with a Miskito community, she noticed the extraordinarily healthy hair and skin of the local women, despite their limited access to commercial beauty products.
              </p>
              <p>
                She learned that they used an oil extracted from the American palm fruit (Elaeis oleifera), which they called "Batana." The oil was made through a labor-intensive process that had been passed down through generations of Miskito women.
              </p>
              
              <div className="my-8">
                <img 
                  src="/images/jar-benefits.jpg" 
                  alt="Pure Batana Oil Benefits" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-neutral-600 italic mt-2">The lush rainforests of La Mosquitia where the American palm grows wild</p>
              </div>
              
              <h3>The Tradition</h3>
              <p>
                For centuries, Miskito women have harvested the fruit of the American palm, extracting its oil through a meticulous process:
              </p>
              <ol>
                <li>The ripe fruits are collected and their seeds removed</li>
                <li>The pulp is boiled in water until the oil separates</li>
                <li>The oil is carefully skimmed off the surface</li>
                <li>This process is repeated several times to purify the oil</li>
                <li>The final product is stored in calabash gourds for use</li>
              </ol>
              <p>
                This traditional method preserves all the beneficial properties of the oil while ensuring its purity.
              </p>
              
              <h3>Our Mission</h3>
              <p>
                Inspired by the transformative properties of Batana oil and the rich cultural heritage behind it, Elena returned to the United States with a vision: to create a company that would bring this extraordinary oil to a wider audience while supporting the indigenous communities who have been its stewards for generations.
              </p>
              <p>
                Pure Batana was founded on three core principles:
              </p>
              <ul>
                <li><strong>Quality</strong> - Maintaining the traditional methods that preserve the oil's potency</li>
                <li><strong>Sustainability</strong> - Ensuring responsible harvesting practices that protect the rainforest</li>
                <li><strong>Fair Trade</strong> - Providing fair compensation and economic opportunities for Miskito communities</li>
              </ul>
              
              <h3>The Partnership</h3>
              <p>
                We established direct partnerships with Miskito communities in La Mosquitia, creating a cooperative model that:
              </p>
              <ul>
                <li>Pays a premium well above market rates for the oil</li>
                <li>Invests in community infrastructure like schools and healthcare</li>
                <li>Provides training in sustainable harvesting techniques</li>
                <li>Supports women's economic independence through employment opportunities</li>
              </ul>
              <p>
                These partnerships ensure that as our business grows, the benefits flow back to the communities who have shared their traditional knowledge with us.
              </p>
              
              <div className="my-8">
                <img 
                  src="/images/jar-usage.jpg" 
                  alt="Pure Batana Oil Usage" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-neutral-600 italic mt-2">Our cooperative partners preparing Batana oil using traditional methods</p>
              </div>
              
              <h3>Looking Forward</h3>
              <p>
                Today, Pure Batana continues to expand its product line while staying true to our founding principles. We remain committed to:
              </p>
              <ul>
                <li>Preserving and honoring the traditional knowledge of the Miskito people</li>
                <li>Creating products that harness the full potential of this remarkable oil</li>
                <li>Maintaining sustainable practices that protect the environment</li>
                <li>Building a business model that benefits everyone in the supply chain, from harvesters to customers</li>
              </ul>
              <p>
                When you purchase Pure Batana products, you're not just buying a beauty oil—you're participating in a cycle of positive impact that supports indigenous communities, preserves cultural traditions, and protects the rainforest while providing you with nature's most effective beauty solution.
              </p>
              <p>
                We invite you to join us on this journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}