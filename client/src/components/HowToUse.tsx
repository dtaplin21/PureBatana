export default function HowToUse() {
  return (
    <section id="how-to-use" className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">How to Use Batana Oil</h2>
          <p className="text-neutral-800">Simple ways to incorporate this versatile oil into your daily routine</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-neutral-100 rounded-lg p-8">
            <div className="text-4xl font-display font-bold text-[#a3b18a] mb-6">01</div>
            <h3 className="font-display font-semibold text-xl mb-4">For Hair</h3>
            <p className="text-neutral-600 mb-6">Apply a small amount to palms and work through damp hair, focusing on ends. Can be used as a deep conditioning treatment by leaving on for 30 minutes before washing.</p>
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Woman applying oil to hair" 
              className="w-full h-48 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          
          <div className="bg-white border border-neutral-100 rounded-lg p-8">
            <div className="text-4xl font-display font-bold text-[#a3b18a] mb-6">02</div>
            <h3 className="font-display font-semibold text-xl mb-4">For Face</h3>
            <p className="text-neutral-600 mb-6">Warm 2-3 drops between fingertips and gently press into clean, slightly damp skin. Perfect as the final step in your evening skincare routine.</p>
            <img 
              src="https://images.unsplash.com/photo-1596178060810-72c633641135?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Facial skincare routine" 
              className="w-full h-48 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          
          <div className="bg-white border border-neutral-100 rounded-lg p-8">
            <div className="text-4xl font-display font-bold text-[#a3b18a] mb-6">03</div>
            <h3 className="font-display font-semibold text-xl mb-4">For Body</h3>
            <p className="text-neutral-600 mb-6">Massage a generous amount into skin after bathing while still damp. Focus on dry areas like elbows, knees, and heels.</p>
            <img 
              src="https://images.unsplash.com/photo-1588607558181-ded5cd3adbb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Body moisturizing" 
              className="w-full h-48 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
