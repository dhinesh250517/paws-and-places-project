
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon, DogIcon, HomeIcon, PlusIcon, InfoIcon, LogOutIcon } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // For now, we'll just redirect to the login page
    // In the future, we would add actual logout logic here
    window.location.href = '/';
  };

  const navLinks = [
    {
      name: 'Home',
      path: '/home',
      icon: <HomeIcon className="w-5 h-5 mr-2" />,
    },
    {
      name: 'Add Animal',
      path: '/add',
      icon: <PlusIcon className="w-5 h-5 mr-2" />,
    },
    {
      name: 'About Us',
      path: '/about',
      icon: <InfoIcon className="w-5 h-5 mr-2" />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="paws-container py-3">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center">
            <DogIcon className="h-8 w-8 text-pawsOrange animate-paw-wave" />
            <span className="ml-2 text-xl font-bold text-pawsOrange-900">Paws & Places</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button 
                key={link.path}
                variant={isActive(link.path) ? "default" : "ghost"}
                className={`flex items-center ${isActive(link.path) ? 'bg-pawsOrange text-white' : 'text-gray-700 hover:text-pawsOrange'}`}
                asChild
              >
                <Link to={link.path}>
                  {link.icon}
                  {link.name}
                </Link>
              </Button>
            ))}
            <Button 
              variant="outline" 
              className="ml-2 flex items-center text-gray-700 hover:text-pawsOrange-600"
              onClick={handleLogout}
            >
              <LogOutIcon className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Button 
                key={link.path}
                variant={isActive(link.path) ? "default" : "ghost"}
                className={`w-full justify-start ${isActive(link.path) ? 'bg-pawsOrange text-white' : 'text-gray-700'}`}
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to={link.path}>
                  {link.icon}
                  {link.name}
                </Link>
              </Button>
            ))}
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-700"
              onClick={handleLogout}
            >
              <LogOutIcon className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navigation;
