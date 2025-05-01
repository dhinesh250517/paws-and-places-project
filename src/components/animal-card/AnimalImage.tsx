
import React from 'react';
import { CheckCircleIcon } from 'lucide-react';

interface AnimalImageProps {
  type: string;
  isAdopted: boolean;
  isPendingAdoption: boolean;
  adoptedAt?: Date;
  formatDate: (date: Date) => string;
}

const AnimalImage: React.FC<AnimalImageProps> = ({ type, isAdopted, isPendingAdoption, adoptedAt, formatDate }) => {
  // Use these actual image URLs instead of the placeholder paths
  const animalImages = {
    dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9nfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
  };

  return (
    <div className="mb-4 flex justify-center cursor-pointer">
      <div className="relative w-full max-w-xs aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={type === 'dog' ? animalImages.dog : animalImages.cat}
          alt={`${type} in need`}
          className="object-cover w-full h-full"
        />
        {isAdopted ? (
          <div className="absolute bottom-0 left-0 right-0 bg-green-500 bg-opacity-80 text-white text-center py-2">
            <CheckCircleIcon className="inline-block h-4 w-4 mr-1" />
            Adopted on {formatDate(adoptedAt || new Date())}
          </div>
        ) : isPendingAdoption ? (
          <div className="absolute bottom-0 left-0 right-0 bg-amber-500 bg-opacity-80 text-white text-center py-2">
            Pending Approval
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2">
            Click to learn how to help
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalImage;
