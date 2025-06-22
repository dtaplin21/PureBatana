export default function HowToUse() {
  return (
    <section id="howtouse" className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">How to Use Batana Oil</h2>
          <p className="text-neutral-800">Simple ways to incorporate this versatile oil into your daily routine</p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-16">
          <img 
            src="/images/batana-front.jpg" 
            alt="Pure Batana Oil Usage Instructions" 
            className="w-full rounded-lg mx-auto shadow-md"
            onError={(e) => {
              console.error("Image failed to load in HowToUse");
              e.currentTarget.src = "/images/batana-front.jpg"; // Fallback image
            }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-neutral-100 rounded-lg p-8">
            <div className="text-4xl font-display font-bold text-[#a3b18a] mb-6">01</div>
            <h3 className="font-display font-semibold text-xl mb-4">For Hair</h3>
            <p className="text-neutral-600">Apply a small amount to palms and work through damp hair, focusing on ends. Can be used as a deep conditioning treatment by leaving on for 30 minutes before washing.</p>
          </div>
          
          <div className="bg-white border border-neutral-100 rounded-lg p-8">
            <div className="text-4xl font-display font-bold text-[#a3b18a] mb-6">02</div>
            <h3 className="font-display font-semibold text-xl mb-4">For Face</h3>
            <p className="text-neutral-600">Warm 2-3 drops between fingertips and gently press into clean, slightly damp skin. Perfect as the final step in your evening skincare routine.</p>
          </div>
          
          <div className="bg-white border border-neutral-100 rounded-lg p-8">
            <div className="text-4xl font-display font-bold text-[#a3b18a] mb-6">03</div>
            <h3 className="font-display font-semibold text-xl mb-4">For Body</h3>
            <p className="text-neutral-600">Massage a generous amount into skin after bathing while still damp. Focus on dry areas like elbows, knees, and heels.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
