import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orderStatus, setOrderStatus] = useState<null | {
    id: number;
    status: string;
    createdAt: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrderStatus(null);
    setLoading(true);

    try {
      // Simulate API call to track order
      // In a real implementation, we would call an actual API endpoint
      // For now, we'll simulate the response
      
      if (!orderNumber || !email) {
        throw new Error("Please provide both order number and email");
      }

      // Convert to number for validation
      const orderNumberInt = parseInt(orderNumber, 10);
      if (isNaN(orderNumberInt)) {
        throw new Error("Order number must be a valid number");
      }
      
      // Simulate a delay to mimic an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate order found or not found
      if (orderNumberInt > 0 && orderNumberInt < 1000 && email.includes('@')) {
        // Simulate a found order with sample data
        setOrderStatus({
          id: orderNumberInt,
          status: "Shipped",
          createdAt: new Date().toLocaleDateString(),
          items: [
            { name: "Pure Batana Oil", quantity: 1, price: 29.99 }
          ],
          total: 29.99
        });
        
        toast({
          title: "Order Found",
          description: `We found your order #${orderNumber}`,
        });
      } else {
        throw new Error("No order found with the provided information");
      }
    } catch (err: any) {
      setError(err.message || "Failed to find order");
      toast({
        title: "Error",
        description: err.message || "Failed to find order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <p className="text-gray-600 mb-6">
          Enter your order number and email address used for the order to track its status.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Order Number
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3a5a40] focus:outline-none"
              placeholder="Enter your order number"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3a5a40] focus:outline-none"
              placeholder="Enter your email address"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#3a5a40] hover:bg-[#588157] text-white font-medium py-3 px-8 rounded-full transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Tracking...
              </span>
            ) : (
              "Track Order"
            )}
          </button>
        </form>
        {error && (
          <div className="mt-6 bg-red-50 text-red-800 p-4 rounded-md">
            {error}
          </div>
        )}
      </div>

      {orderStatus && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold">Order #{orderStatus.id}</h2>
            <p className="text-gray-600">Placed on {orderStatus.createdAt}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderStatus.status)}`}>
                {orderStatus.status}
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Items</h3>
            <div className="space-y-3">
              {orderStatus.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                  </div>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${orderStatus.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}