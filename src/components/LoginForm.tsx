import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DogIcon, CatIcon } from 'lucide-react';

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if this is the owner/admin login
    if (loginData.email === 'owner@gmail.com' && loginData.password === '12345') {
      // Handle owner login
      setTimeout(() => {
        setLoading(false);
        toast.success("Owner login successful!");
        navigate('/owner');
      }, 1000);
      return;
    }
    
    // Regular user login
    setTimeout(() => {
      setLoading(false);
      
      // In a real app, we would verify credentials with the backend
      // For now, we'll just allow any login
      toast.success("Login successful!");
      navigate('/home');
    }, 1000);
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setLoading(false);
      toast.error("Passwords do not match!");
      return;
    }
    
    // Simulate register API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Registration successful! Please log in.");
      // Switch to login tab
      document.getElementById('login-tab')?.click();
    }, 1000);
  };
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Left side - Website Information (now more compact) */}
      <div className="hidden md:flex flex-col justify-center items-center bg-pawsBlue text-white w-1/3 p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <DogIcon className="h-8 w-8" />
            <CatIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Paws & Places</h1>
          <p className="text-sm mb-4">Helping stray animals find care and loving homes.</p>
          
          <div className="space-y-3">
            <div className="bg-white/10 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1">Our Mission</h3>
              <p className="text-xs">Connecting animal lovers with strays that need help.</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1">How It Works</h3>
              <p className="text-xs">Report strays, volunteer to help, or adopt - make a difference today.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login/Register Form */}
      <div className="w-full md:w-2/3 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DogIcon className="h-8 w-8 text-pawsOrange" />
              <CatIcon className="h-8 w-8 text-pawsBlue" />
            </div>
            <CardTitle className="text-2xl text-center">Paws & Places</CardTitle>
            <CardDescription className="text-center">
              Help stray animals find care and homes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger id="login-tab" value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="your@email.com" 
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a 
                        href="#" 
                        className="text-xs text-pawsBlue hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info("Password reset functionality would be implemented in the full version");
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-pawsOrange hover:bg-pawsOrange-600"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username"
                      placeholder="johndoe" 
                      required
                      value={registerData.username}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      name="email"
                      type="email" 
                      placeholder="your@email.com" 
                      required
                      value={registerData.email}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      required
                      value={registerData.password}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      name="confirmPassword"
                      type="password" 
                      placeholder="••••••••" 
                      required
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-pawsOrange hover:bg-pawsOrange-600"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
