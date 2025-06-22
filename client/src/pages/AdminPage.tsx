import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { apiRequest, buildApiUrl } from "@/lib/queryClient";

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

interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
  } | null;
}

interface StripeOrder {
  id: string;
  customer: StripeCustomer;
  amount: number;
  currency: string;
  status: string;
  created: number;
  items: {
    description: string;
    quantity: number;
    amount: number;
  }[];
  shipping: {
    name: string;
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  } | null;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<StripeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  
  // Access code verification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  // Track edited prices
  const [editedPrices, setEditedPrices] = useState<Record<number, number>>({});
  
  // Notification settings
  const [phoneNumber, setPhoneNumber] = useState('5103261121');
  const [carrier, setCarrier] = useState('att');
  const [notificationSettingsLoading, setNotificationSettingsLoading] = useState(false);
  const [testingSms, setTestingSms] = useState(false);
  
  // Handler for updating notification settings
  const updateNotificationSettings = async () => {
    try {
      setNotificationSettingsLoading(true);
      
      const response = await apiRequest('POST', '/api/notifications/sms-settings', {
        phoneNumber,
        carrier
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification settings updated successfully. You'll receive SMS alerts at this number for new orders.",
        });
      } else {
        throw new Error("Failed to update notification settings");
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setNotificationSettingsLoading(false);
    }
  };
  
  // Handler for testing SMS notifications
  const testSmsNotification = async () => {
    try {
      setTestingSms(true);
      
      const response = await apiRequest('POST', '/api/notifications/test-sms', {
        phoneNumber
      });
      
      if (response.ok) {
        const data = await response.json();
        
        toast({
          title: "Test SMS Sent",
          description: "A test SMS notification has been sent to your phone. You should receive it shortly.",
        });
      } else {
        throw new Error("Failed to send test SMS notification");
      }
    } catch (error) {
      console.error('Error sending test SMS:', error);
      toast({
        title: "Error",
        description: "Failed to send test SMS notification. Please make sure your Twilio credentials are configured correctly.",
        variant: "destructive",
      });
    } finally {
      setTestingSms(false);
    }
  };
  
  // Handler for verifying access code
  const verifyAccessCode = async () => {
    try {
      setVerifying(true);
      
      const response = await apiRequest('POST', '/api/admin/verify', {
        accessCode
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        
        // Save authentication status in sessionStorage (will persist until browser tab is closed)
        sessionStorage.setItem('adminAuthenticated', 'true');
        
        // Now load the data
        fetchProducts();
        fetchStripeOrders();
        
        toast({
          title: "Access Granted",
          description: "Welcome to the admin panel",
        });
      } else {
        throw new Error("Invalid access code");
      }
    } catch (error) {
      console.error('Error verifying access code:', error);
      toast({
        title: "Access Denied",
        description: "Invalid access code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };
  
  useEffect(() => {
    // Check if already authenticated from sessionStorage
    const authenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    
    if (authenticated) {
      setIsAuthenticated(true);
      fetchProducts();
      fetchStripeOrders();
    } else {
      // Still need to set loading to false if not authenticated
      setLoading(false);
    }
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Use the buildApiUrl function to create the full URL
      const response = await fetch(buildApiUrl('/api/products'));
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
  
  const fetchStripeOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await apiRequest('GET', '/api/stripe/orders');
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        throw new Error("Failed to fetch Stripe orders");
      }
    } catch (error) {
      console.error('Error fetching Stripe orders:', error);
      toast({
        title: "Error",
        description: "Failed to load Stripe orders",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-6">Admin Panel</h1>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-6">Admin Panel</h1>
        
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter your access code to manage products and view orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="access-code" className="text-sm font-medium">
                    Access Code
                  </label>
                  <Input
                    id="access-code"
                    type="password"
                    placeholder="Enter your access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        verifyAccessCode();
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#3a5a40] hover:bg-[#588157]"
                onClick={verifyAccessCode}
                disabled={verifying || !accessCode}
              >
                {verifying ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Verifying...
                  </>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // If authenticated, show admin panel
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40]">Admin Panel</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem('adminAuthenticated');
            toast({
              title: "Logged Out",
              description: "You have been logged out of the admin panel",
            });
          }}
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Log Out
        </Button>
      </div>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="products">Manage Products</TabsTrigger>
          <TabsTrigger value="orders">View Orders</TabsTrigger>
          <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
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
                          onError={(e) => {
                            console.error("Product image failed to load");
                            e.currentTarget.src = "/images/batana-new.jpeg"; // Fallback image
                          }}
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
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl">Customer Orders</h2>
            <Button 
              onClick={fetchStripeOrders} 
              className="bg-[#3a5a40] hover:bg-[#588157]"
              disabled={ordersLoading}
            >
              {ordersLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Refreshing...
                </>
              ) : (
                'Refresh Orders'
              )}
            </Button>
          </div>
          
          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No orders found</p>
              <p className="text-sm text-gray-400 mt-2">Orders will appear here when customers make purchases</p>
            </div>
          ) : (
            <div className="overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                          <div>{order.customer?.name || 'Anonymous'}</div>
                          <div className="text-sm text-gray-500">{order.customer?.email || 'No email'}</div>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(order.created * 1000), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {order.items.map((item, index) => (
                          <div key={index} className="mb-1">
                            <span className="font-medium">{item.quantity}x</span> {item.description}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>${(order.amount / 100).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'succeeded' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'succeeded' ? 'Paid' : order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications">
          <h2 className="font-display text-xl mb-6">SMS Notification Settings</h2>
          
          <Card className="shadow-sm max-w-md">
            <CardHeader>
              <CardTitle>Order SMS Alerts</CardTitle>
              <CardDescription>
                Configure your phone number to receive SMS alerts when new orders are placed.
                Messages will be sent directly to your phone via Twilio SMS service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone-number" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone-number"
                  type="text"
                  placeholder="e.g. 5551234567 (digits only)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                />
                <p className="text-xs text-gray-500">Enter your 10-digit phone number (digits only, no spaces or dashes)</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Twilio SMS service will send messages directly to your phone number regardless of carrier.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                onClick={updateNotificationSettings} 
                disabled={notificationSettingsLoading || phoneNumber.length !== 10}
                className="bg-[#3a5a40] hover:bg-[#588157] w-full"
              >
                {notificationSettingsLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  'Update Notification Settings'
                )}
              </Button>
              
              <Button 
                onClick={testSmsNotification} 
                disabled={testingSms || phoneNumber.length !== 10}
                variant="outline"
                className="border-[#3a5a40] text-[#3a5a40] hover:bg-[#3a5a40] hover:text-white w-full"
              >
                {testingSms ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#3a5a40] border-t-transparent"></div>
                    Sending Test SMS...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Test SMS
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-2">How This Works</h3>
            <p className="text-sm text-gray-600 mb-4">
              This notification system uses Twilio's reliable SMS messaging service to deliver alerts.
              When someone places an order, you'll receive a text message on your phone with order details.
            </p>
            <div className="text-sm text-gray-600">
              <strong>Note:</strong> For this to work effectively:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Enter a valid phone number (just the digits)</li>
                <li>Make sure your entered phone number can receive SMS messages</li>
                <li>Ensure the Twilio account has sufficient credit for sending messages</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}