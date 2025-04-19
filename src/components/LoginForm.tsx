
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DogIcon, CatIcon, HeartIcon, HomeIcon, HandIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.email === 'owner@gmail.com' && formData.password === '12345') {
      localStorage.setItem('ownerLoggedIn', 'true');
      toast.success("Owner login successful!");
      navigate('/owner');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Login successful!");
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      setActiveTab('login');
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - App details */}
        <div className="space-y-6 text-left p-6">
          <div className="flex items-center gap-2 mb-8">
            <DogIcon className="h-10 w-10 text-pawsOrange" />
            <CatIcon className="h-10 w-10 text-pawsBlue" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Paws & Places</h1>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <HeartIcon className="h-6 w-6 text-pawsOrange mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Help Stray Animals</h3>
                <p className="text-gray-600">Report and locate stray animals in need of care and attention.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HomeIcon className="h-6 w-6 text-pawsBlue mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Find Forever Homes</h3>
                <p className="text-gray-600">Connect rescued animals with loving families looking to adopt.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HandIcon className="h-6 w-6 text-pawsOrange mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Make a Difference</h3>
                <p className="text-gray-600">Join our community of animal lovers working together to make a positive impact.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login/Register form */}
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">
              {activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login' 
                ? "Welcome back! Please sign in to continue."
                : "Join us in helping stray animals find care and homes."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-pawsOrange hover:bg-pawsOrange/90"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-pawsBlue hover:bg-pawsBlue/90"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
