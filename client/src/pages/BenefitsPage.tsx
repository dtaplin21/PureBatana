import Benefits from "@/components/Benefits";
import { Helmet } from "react-helmet";

export default function BenefitsPage() {
  return (
    <div>
      <Helmet>
        <title>Benefits of Batana Oil | Pure Batana</title>
        <meta name="description" content="Discover the amazing benefits of Batana Oil for hair, skin, and more. Learn why this traditional oil from Honduras is treasured for its nourishing properties." />
      </Helmet>
      
      <div className="py-12 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-center text-[#3a5a40] mb-6">Benefits of Batana Oil</h1>
          <p className="text-center text-lg text-neutral-700 max-w-3xl mx-auto">
            Discover the amazing natural benefits of this ancient beauty secret from the Miskito people of Honduras.
          </p>
        </div>
      </div>
      
      <Benefits />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-8">More About Batana Oil Benefits</h2>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Batana oil, derived from the American palm fruit (Elaeis oleifera), has been a treasured beauty secret of the Miskito people in Honduras for generations. This extraordinary oil is packed with nutrients that offer remarkable benefits for hair, skin, and overall wellness.
              </p>
              
              <h3>Rich in Essential Nutrients</h3>
              <p>
                What makes Batana oil so special is its exceptional composition of beneficial compounds:
              </p>
              <ul>
                <li><strong>Omega-3, 6, and 9 fatty acids</strong> - Essential for maintaining cell membrane health and promoting skin elasticity</li>
                <li><strong>Tocotrienols and tocopherols</strong> - Forms of vitamin E that provide powerful antioxidant protection</li>
                <li><strong>Beta-carotene</strong> - A precursor to vitamin A that supports skin cell regeneration</li>
                <li><strong>Sterols</strong> - Plant compounds that help strengthen the skin barrier</li>
              </ul>
              
              <h3>Transformative Hair Benefits</h3>
              <p>
                Batana oil works wonders for all hair types but is especially beneficial for dry, damaged, or chemically treated hair:
              </p>
              <ul>
                <li>Deeply penetrates the hair shaft to repair damage from within</li>
                <li>Seals the cuticle to prevent moisture loss and protect against environmental stressors</li>
                <li>Reduces frizz and enhances natural shine without weighing hair down</li>
                <li>Stimulates the scalp to promote healthier hair growth</li>
                <li>Protects against heat damage from styling tools</li>
              </ul>
              
              <h3>Exceptional Skin Benefits</h3>
              <p>
                The nourishing properties of Batana oil make it an ideal skincare solution:
              </p>
              <ul>
                <li>Creates a protective barrier that locks in moisture without clogging pores</li>
                <li>Helps reduce the appearance of fine lines by improving skin elasticity</li>
                <li>Soothes irritated skin and may help with conditions like eczema and psoriasis</li>
                <li>Enhances the skin's natural repair processes to address scarring and hyperpigmentation</li>
                <li>Provides antioxidant protection against environmental damage</li>
              </ul>
              
              <h3>Sustainability and Ethical Sourcing</h3>
              <p>
                Beyond its beauty benefits, our Batana oil offers social and environmental advantages:
              </p>
              <ul>
                <li>Sustainably harvested using traditional methods that preserve the rainforest ecosystem</li>
                <li>Provides fair income to indigenous Miskito communities, supporting their economic independence</li>
                <li>Helps preserve cultural traditions and indigenous knowledge</li>
                <li>Encourages conservation of the American palm and its natural habitat</li>
              </ul>
              
              <p>
                By choosing Pure Batana products, you're not only giving yourself the gift of extraordinary natural care but also supporting sustainable practices and indigenous communities who have been the guardians of this remarkable oil for centuries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}