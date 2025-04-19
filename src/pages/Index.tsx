
import React from 'react';
import LoginForm from '../components/LoginForm';
import { DogIcon, CatIcon, HeartIcon } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration/Info */}
      <div className="bg-gradient-to-br from-pawsOrange-100 to-pawsBlue-50 p-8 flex-1 hidden md:flex flex-col justify-center items-center text-center">
        <div className="max-w-md">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <DogIcon className="h-16 w-16 text-pawsOrange" />
              <HeartIcon className="h-8 w-8 text-pawsOrange-600 absolute -top-2 -right-2" />
            </div>
            <CatIcon className="h-16 w-16 text-pawsBlue ml-2" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Paws & Places</h1>
          <p className="text-lg text-gray-600 mb-6">
            Join our community helping stray dogs and cats find care, food, and loving homes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-bold mb-2 text-pawsOrange">Report</div>
              <p className="text-sm text-gray-600">Help by reporting stray animals in your area</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-bold mb-2 text-pawsBlue">Donate</div>
              <p className="text-sm text-gray-600">Support caretakers with food and medical expenses</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-bold mb-2 text-pawsOrange">Locate</div>
              <p className="text-sm text-gray-600">Find animals near you that need assistance</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-bold mb-2 text-pawsBlue">Adopt</div>
              <p className="text-sm text-gray-600">Give a loving forever home to a stray</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
