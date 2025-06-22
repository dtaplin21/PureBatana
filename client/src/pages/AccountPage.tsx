import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This is a simplified account page for demo purposes
export default function AccountPage() {
  // Show account dashboard directly without login
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40]">My Account</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Account Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="#dashboard" className="text-[#588157] hover:text-[#3a5a40] font-medium">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="text-[#588157] hover:text-[#3a5a40] font-medium">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href="#addresses" className="text-[#588157] hover:text-[#3a5a40] font-medium">
                    Addresses
                  </Link>
                </li>
                <li>
                  <Link href="#profile" className="text-[#588157] hover:text-[#3a5a40] font-medium">
                    Account Details
                  </Link>
                </li>
                <li>
                  <Link href="#wishlist" className="text-[#588157] hover:text-[#3a5a40] font-medium">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Hello Jessica!</p>
              <p className="mb-6">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your account details.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/orders">
                  <Button className="w-full bg-[#3a5a40] hover:bg-[#588157]">View Orders</Button>
                </Link>
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src="/images/batana-new.jpeg" 
                          alt="Pure Batana Oil" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Pure Batana Oil</h4>
                        <div className="text-sm text-gray-500 mt-1">Order #1001 • April 20, 2025</div>
                        <div className="text-sm font-medium text-green-600 mt-1">Delivered</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link href="/orders/1">
                        <Button variant="outline" size="sm" className="w-full">View Order Details</Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src="/images/batana-new.jpeg" 
                          alt="Pure Batana Oil" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Pure Batana Oil</h4>
                        <div className="text-sm text-gray-500 mt-1">Order #1000 • April 10, 2025</div>
                        <div className="text-sm font-medium text-green-600 mt-1">Delivered</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link href="/orders/2">
                        <Button variant="outline" size="sm" className="w-full">View Order Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
