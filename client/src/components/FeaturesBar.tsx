export default function FeaturesBar() {
  return (
    <section className="bg-neutral-50 py-8 border-y border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <i className="fas fa-leaf text-[#588157] text-2xl mb-3"></i>
            <h3 className="font-medium">100% Natural</h3>
            <p className="text-sm text-neutral-600">No additives or chemicals</p>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-heart text-[#588157] text-2xl mb-3"></i>
            <h3 className="font-medium">Ethically Sourced</h3>
            <p className="text-sm text-neutral-600">Fair trade certified</p>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-truck text-[#588157] text-2xl mb-3"></i>
            <h3 className="font-medium">Free Shipping</h3>
            <p className="text-sm text-neutral-600">On orders over $50</p>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-undo text-[#588157] text-2xl mb-3"></i>
            <h3 className="font-medium">30-Day Returns</h3>
            <p className="text-sm text-neutral-600">Satisfaction guaranteed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
