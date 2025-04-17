
import React from 'react';
import Navigation from './Navigation';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isLoginPage && <Navigation />}
      <main className="flex-grow">
        {children}
      </main>
      {!isLoginPage && (
        <footer className="bg-pawsBlue-800 text-white py-6">
          <div className="paws-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-2">Paws & Places</h3>
                <p className="text-sm">Helping stray animals find care and forever homes.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Quick Links</h3>
                <ul className="space-y-1 text-sm">
                  <li><a href="/home" className="hover:underline">Home</a></li>
                  <li><a href="/add" className="hover:underline">Report Animal</a></li>
                  <li><a href="/about" className="hover:underline">About Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Contact</h3>
                <p className="text-sm">Have questions? Reach out to our team!</p>
                <p className="text-sm mt-2">Email: help@pawsandplaces.com</p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-pawsBlue-700 text-sm text-center">
              © {new Date().getFullYear()} Paws & Places. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
