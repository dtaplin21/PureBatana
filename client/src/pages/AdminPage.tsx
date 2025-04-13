import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  shortDescription: string | null;
  images: string[];
  category: string;
  stock: number;
  featured: boolean | null;
  benefits: string[] | null;
  usage: string | null;
  isBestseller: boolean | null;
  isNew: boolean | null;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  
  // Track edited prices
  const [editedPrices, setEditedPrices] = useState<Record<number, number>>({});
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      
      // Initialize edited prices with current prices
      const initialPrices: Record<number, number> = {};
      data.forEach((product: Product) => {
        initialPrices[product.id] = product.price;
      });
      setEditedPrices(initialPrices);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePriceChange = (id: number, value: string) => {
    const price = parseFloat(value);
    if (!isNaN(price)) {
      setEditedPrices({
        ...editedPrices,
        [id]: price
      });
    }
  };
  
  const updateProductPrice = async (id: number) => {
    try {
      setUpdating(true);
      
      const response = await apiRequest('PATCH', `/api/products/${id}`, {
        price: editedPrices[id]
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Product price updated successfully",
        });
        // Refresh products
        fetchProducts();
      } else {
        throw new Error("Failed to update product price");
      }
    } catch (error) {
      console.error('Error updating product price:', error);
      toast({
        title: "Error",
        description: "Failed to update product price",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-6">Admin Panel</h1>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-6">Admin Panel</h1>
      <h2 className="font-display text-xl mb-6">Manage Product Prices</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {products.map(product => (
          <Card key={product.id} className="shadow-sm">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  {product.images && product.images.length > 0 && (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="mb-2 text-sm text-gray-600">Current Price: ${product.price.toFixed(2)}</p>
                  <div className="flex gap-2 items-center">
                    <label htmlFor={`price-${product.id}`} className="text-sm font-medium">
                      New Price ($):
                    </label>
                    <Input
                      id={`price-${product.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={editedPrices[product.id]}
                      onChange={(e) => handlePriceChange(product.id, e.target.value)}
                      className="max-w-[120px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => updateProductPrice(product.id)} 
                disabled={updating || editedPrices[product.id] === product.price}
                className="bg-[#3a5a40] hover:bg-[#588157]"
              >
                {updating ? 'Updating...' : 'Update Price'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}