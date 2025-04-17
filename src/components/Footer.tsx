
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, PlusCircleIcon, InfoIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="paws-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Paws & Places</h3>
            <p className="text-gray-300">
              Helping stray animals find care and homes through community support.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-gray-300 hover:text-white flex items-center">
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/add" className="text-gray-300 hover:text-white flex items-center">
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Report Animal
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white flex items-center">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-300">
              Have questions or suggestions? <br />
              Email us at: <a href="mailto:contact@pawsandplaces.com" className="hover:underline">contact@pawsandplaces.com</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Paws & Places. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
