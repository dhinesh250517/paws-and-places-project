
import React from 'react';

const AnimalsLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 h-96">
          <div className="animate-pulse h-full">
            <div className="h-4 bg-gray-200 rounded w-2/6 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-4/6 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/6 mb-6"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimalsLoadingSkeleton;
