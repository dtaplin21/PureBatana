import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleThumbnailClick = (image: string, index: number) => {
    setMainImage(image);
    setSelectedIndex(index);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  };

  return (
    <div>
      <div className="mb-4">
        <img 
          src={mainImage} 
          alt="Product Image" 
          className="w-full rounded-lg h-96 object-cover object-center"
          onError={handleImageError}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`product-gallery-thumb border-2 rounded-md overflow-hidden cursor-pointer ${
              selectedIndex === index ? 'border-[#3a5a40]' : 'border-transparent'
            }`}
            onClick={() => handleThumbnailClick(image, index)}
          >
            <img 
              src={image} 
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-20 object-cover"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
