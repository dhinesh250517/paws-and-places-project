
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { 
  MenuIcon, 
  XIcon, 
  HeartHandshakeIcon, 
  LogOutIcon, 
  DogIcon,
  TrashIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const ownerLoggedIn = localStorage.getItem('ownerLoggedIn');
    setIsOwner(ownerLoggedIn === 'true');
  }, [location.pathname]);

  const navItems = [
    { path: "/home", label: "Home" },
    { path: "/add", label: "Add Animal" },
    { path: "/adopted", label: "Adopted Animals" },
    { path: "/about", label: "About Us" },
  ];

  // Owner-only navigation items
  const ownerNavItems = [
    { path: "/owner", label: "Admin Dashboard" },
    { path: "/deleted", label: "Deleted Animals" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      if (isOwner) {
        localStorage.removeItem('ownerLoggedIn');
        toast.success('Owner logged out');
        navigate('/');
        return;
      }

      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="paws-container flex justify-between items-center py-3">
        
        {/* 🐶 Logo with DogIcon and text */}
        <Link to="/" className="font-bold text-lg flex items-center text-pawsBlue">
          <DogIcon className="h-6 w-6 mr-2" />
          Paws & Places
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {isOwner ? (
            ownerNavItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={cn(
                    "px-3",
                    isActive(item.path) ? "bg-pawsBlue text-white" : ""
                  )}
                >
                  {item.label === "Deleted Animals" && (
                    <TrashIcon className="h-4 w-4 mr-1" />
                  )}
                  {item.label}
                </Button>
              </Link>
            ))
          ) : (
            navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={cn(
                    "px-3",
                    isActive(item.path) ? "bg-pawsBlue text-white" : ""
                  )}
                >
                  {item.label === "Adopted Animals" && (
                    <HeartHandshakeIcon className="h-4 w-4 mr-1 text-green-500" />
                  )}
                  {item.label}
                </Button>
              </Link>
            ))
          )}
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="px-3 flex items-center"
          >
            <LogOutIcon className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-3 mt-6">
              {isOwner ? (
                ownerNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive(item.path) ? "bg-pawsBlue text-white" : ""
                      )}
                    >
                      {item.label === "Deleted Animals" && (
                        <TrashIcon className="h-4 w-4 mr-2" />
                      )}
                      {item.label}
                    </Button>
                  </Link>
                ))
              ) : (
                navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive(item.path) ? "bg-pawsBlue text-white" : ""
                      )}
                    >
                      {item.label === "Adopted Animals" && (
                        <HeartHandshakeIcon className="h-4 w-4 mr-2 text-green-500" />
                      )}
                      {item.label}
                    </Button>
                  </Link>
                ))
              )}
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;
