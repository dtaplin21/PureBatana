export default function Story() {
  return (
    <section id="story" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="/images/jar-front.jpg" 
              alt="Pure Batana Oil Jar" 
              className="w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
          
          <div className="md:w-1/2">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-6">Our Story</h2>
            
            <p className="mb-4">For centuries, the indigenous Miskito women of Honduras have harvested and processed American palm fruit to create Batana Oil, a natural beauty elixir revered for its remarkable properties.</p>
            
            <p className="mb-4">Our founder discovered this treasure while traveling through the La Mosquitia region, where she witnessed its transformative effects firsthand. Partnering directly with Miskito communities, we ensure fair compensation and sustainable harvesting practices.</p>
            
            <p className="mb-8">Each bottle of Pure Batana supports traditional knowledge, indigenous livelihoods, and rainforest conservation while delivering an authentic, potent beauty oil to your daily routine.</p>
            
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
