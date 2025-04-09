interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChangeQuantity: (value: string) => void;
  small?: boolean;
}

export default function QuantitySelector({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  onChangeQuantity,
  small = false 
}: QuantitySelectorProps) {
  const btnSize = small ? "w-8 h-8" : "w-10 h-10";
  const inputSize = small ? "w-12 h-8" : "w-16 h-10";
  
  return (
    <div className="flex items-center">
      <button 
        className={`border border-neutral-300 hover:border-[#3a5a40] text-neutral-800 ${btnSize} flex items-center justify-center`}
        onClick={onDecrease}
        type="button"
        aria-label="Decrease quantity"
      >
        <i className="fas fa-minus"></i>
      </button>
      <input 
        type="number" 
        value={quantity} 
        min="1" 
        className={`${inputSize} border-t border-b border-neutral-300 text-center`}
        onChange={(e) => onChangeQuantity(e.target.value)}
        aria-label="Quantity"
      />
      <button 
        className={`border border-neutral-300 hover:border-[#3a5a40] text-neutral-800 ${btnSize} flex items-center justify-center`}
        onClick={onIncrease}
        type="button"
        aria-label="Increase quantity"
      >
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
}
