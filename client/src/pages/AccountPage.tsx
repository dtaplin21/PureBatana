import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// This is a simplified account page for demo purposes
export default function AccountPage() {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd send a request to the server to authenticate
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate successful login
    setIsLoggedIn(true);
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!registerEmail || !registerPassword || !registerConfirmPassword || !registerFirstName || !registerLastName) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate successful registration
    setIsLoggedIn(true);
    toast({
      title: "Registration successful",
      description: "Your account has been created",
    });
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  // If the user is logged in, show account dashboard
  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display font-bold text-3xl text-[#3a5a40]">My Account</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
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
                <p className="mb-4">Hello {registerFirstName || "User"}!</p>
                <p className="mb-6">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/orders">
                    <Button className="w-full bg-[#3a5a40] hover:bg-[#588157]">View Orders</Button>
                  </Link>
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // If the user is not logged in, show login/register form
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-8 text-center">My Account</h1>
      
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="loginEmail">Email Address *</Label>
                      <Input 
                        id="loginEmail" 
                        type="email" 
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="loginPassword">Password *</Label>
                      <Input 
                        id="loginPassword" 
                        type="password" 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Button type="submit" className="w-full bg-[#3a5a40] hover:bg-[#588157]">
                        Login
                      </Button>
                    </div>
                    <div className="text-center">
                      <a href="#reset-password" className="text-sm text-[#588157] hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="registerFirstName">First Name *</Label>
                        <Input 
                          id="registerFirstName" 
                          value={registerFirstName} 
                          onChange={(e) => setRegisterFirstName(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="registerLastName">Last Name *</Label>
                        <Input 
                          id="registerLastName" 
                          value={registerLastName} 
                          onChange={(e) => setRegisterLastName(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="registerEmail">Email Address *</Label>
                      <Input 
                        id="registerEmail" 
                        type="email" 
                        value={registerEmail} 
                        onChange={(e) => setRegisterEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="registerPassword">Password *</Label>
                      <Input 
                        id="registerPassword" 
                        type="password" 
                        value={registerPassword} 
                        onChange={(e) => setRegisterPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="registerConfirmPassword">Confirm Password *</Label>
                      <Input 
                        id="registerConfirmPassword" 
                        type="password" 
                        value={registerConfirmPassword} 
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Button type="submit" className="w-full bg-[#3a5a40] hover:bg-[#588157]">
                        Register
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
