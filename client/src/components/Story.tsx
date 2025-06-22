export default function Story() {
  return (
    <section id="story" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="/images/founder.png" 
              alt="Our Founder" 
              className="w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
          
          <div className="md:w-1/2">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-6">Our Mission</h2>
            
            <p className="mb-4">At Pure Batana, we believe true beauty starts with intention. Our mission is to deliver pure, natural hair care powered by Batana oil—while using every purchase to fund education and build opportunity in Segbeh, Liberia.</p>
            
            <p className="mb-4">We are more than a hair care company. We are a bridge between wellness and purpose. Every bottle sold fuels our commitment to healthy, transformative products and sustainable change for the people of Segbeh.</p>
            
            <h3 className="font-display font-semibold text-xl text-[#3a5a40] mb-3 mt-6">Healing Hair, Empowering Communities</h3>
            <p className="mb-4">Our core ingredient—Batana oil—is prized for its ability to restore thinning, damaged, or dry hair. Rich in essential fatty acids and antioxidants, it helps revive growth, shine, and strength. But our passion for Batana oil goes beyond its benefits.</p>
            
            <p className="mb-4">We source it ethically and use it to fund something bigger: progress.</p>
            
            <p className="mb-4">We donate 20% of our proceeds directly to the village of Segbeh. This money pays for schoolbooks, supplies, and local educational efforts. It also seeds projects that help create a sustainable economy—driven by the people, for the people.</p>
            
            <p className="mb-6">We're not just sending aid. We're investing in resilience, in dignity, and in a future that Liberians shape themselves.</p>
            
            <h3 className="font-display font-semibold text-xl text-[#3a5a40] mb-3">Clean Ingredients. Honest Care.</h3>
            <p className="mb-4">We take a strict stand on health and transparency. Every formula is free from sulfates, parabens, silicones, and synthetic fragrances. Our products are designed to nourish naturally, without compromising your well-being.</p>
            
            <p className="mb-8">We believe what you put on your scalp matters—because beauty should never come at the cost of health.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                <i className="fas fa-handshake text-[#588157] text-xl mr-3"></i>
                <div>
                  <h4 className="font-medium">Fair Trade</h4>
                  <p className="text-sm text-neutral-600">Supporting local communities</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                <i className="fas fa-tree text-[#588157] text-xl mr-3"></i>
                <div>
                  <h4 className="font-medium">Sustainable</h4>
                  <p className="text-sm text-neutral-600">Eco-friendly harvesting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
