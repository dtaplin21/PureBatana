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
            
            <p className="mb-4">Jessica Jones Taplin knows firsthand the frustration of searching for truly natural hair care—time and again she ran into products that promised nourishment but left her hair dry, brittle, or irritated. Drawing on her sensitivity to harsh chemicals and her passion for holistic wellness, Jessica set out to create a line of hair products made purely from nature's finest ingredients—no sulfates, no parabens, no compromises. At Gaia Grow, we believe that what's good for your hair should also be good for the planet. That's why every bottle is crafted with sustainably sourced botanical extracts and packaged in eco‑friendly materials, helping us cultivate a healthier, more natural environment for everyone.</p>
            
            <p className="mb-8">But our mission doesn't stop there. Jessica takes pride in building a better world, pledging a portion of every sale to support community‑driven projects in Liberia and beyond. From clean‑water initiatives to educational programs in rural villages, your purchase helps nourish people and places that have given so much to us. Together, we're not just growing healthy hair—we're growing hope.</p>
            
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
