
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AnimalCard from '../components/AnimalCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Animal } from '../types';
import { SearchIcon, FilterIcon } from 'lucide-react';

// Mock data for our animals
const mockAnimals: Animal[] = [
  {
    id: '1',
    type: 'dog',
    count: 3,
    healthCondition: 'Good overall condition but hungry. One dog has a slight limp.',
    location: {
      address: 'Near City Park, Main Street',
      mapUrl: 'https://maps.google.com/?q=City+Park',
    },
    qrCodeUrl: 'https://via.placeholder.com/200?text=GPay+QR+Code',
    uploadedBy: 'user1',
    createdAt: new Date('2024-03-12'),
    photo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop',
  },
  {
    id: '2',
    type: 'cat',
    count: 1,
    healthCondition: 'Thin but active. Appears to be a young adult cat.',
    location: {
      address: 'Behind the grocery store on Oak Avenue',
      mapUrl: 'https://maps.google.com/?q=Oak+Avenue+Grocery',
    },
    qrCodeUrl: 'https://via.placeholder.com/200?text=GPay+QR+Code',
    uploadedBy: 'user2',
    createdAt: new Date('2024-03-15'),
    photo: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '3',
    type: 'dog',
    count: 1,
    healthCondition: 'Seems well-fed but has some matted fur. Very friendly.',
    location: {
      address: 'Corner of Pine Street and River Road',
      mapUrl: 'https://maps.google.com/?q=Pine+Street+and+River+Road',
    },
    qrCodeUrl: 'https://via.placeholder.com/200?text=GPay+QR+Code',
    uploadedBy: 'user3',
    createdAt: new Date('2024-03-17'),
    photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '4',
    type: 'cat',
    count: 2,
    healthCondition: 'Mother cat with kitten. Both appear healthy but cautious.',
    location: {
      address: 'Alleyway behind Cedar Restaurant',
      mapUrl: 'https://maps.google.com/?q=Cedar+Restaurant',
    },
    qrCodeUrl: 'https://via.placeholder.com/200?text=GPay+QR+Code',
    uploadedBy: 'user2',
    createdAt: new Date('2024-03-18'),
    photo: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '5',
    type: 'dog',
    count: 2,
    healthCondition: 'Two puppies, approximately 3-4 months old. Playful but thin.',
    location: {
      address: 'Empty lot next to the community center',
      mapUrl: 'https://maps.google.com/?q=Community+Center',
    },
    qrCodeUrl: 'https://via.placeholder.com/200?text=GPay+QR+Code',
    uploadedBy: 'user4',
    createdAt: new Date('2024-03-19'),
    photo: 'https://images.unsplash.com/photo-1602250698774-469b27ce86c6?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '6',
    type: 'cat',
    count: 1,
    healthCondition: 'Adult cat with minor injury on paw. Otherwise alert and healthy.',
    location: {
      address: 'Behind the library on Maple Street',
      mapUrl: 'https://maps.google.com/?q=Library+Maple+Street',
    },
    qrCodeUrl: 'https://via.placeholder.com/200?text=GPay+QR+Code',
    uploadedBy: 'user1',
    createdAt: new Date('2024-03-20'),
    photo: 'https://images.unsplash.com/photo-1598188306155-25e400eb5078?q=80&w=2574&auto=format&fit=crop',
  },
];

const HomePage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [animalType, setAnimalType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data fetching
  useEffect(() => {
    const fetchAnimals = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnimals(mockAnimals);
      setFilteredAnimals(mockAnimals);
      setIsLoading(false);
    };
    
    fetchAnimals();
  }, []);
  
  // Filter animals based on search and type
  useEffect(() => {
    let results = animals;
    
    // Filter by type
    if (animalType !== 'all') {
      results = results.filter(animal => animal.type === animalType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(animal => 
        animal.healthCondition.toLowerCase().includes(lowercasedSearch) ||
        animal.location.address.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    setFilteredAnimals(results);
  }, [searchTerm, animalType, animals]);
  
  return (
    <Layout>
      <div className="paws-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help Strays Near You</h1>
          <p className="text-gray-600">Browse listings of stray animals that need your help with food, care, or adoption.</p>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by location or condition..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select 
              value={animalType} 
              onValueChange={setAnimalType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Animal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Animals</SelectItem>
                <SelectItem value="dog">Dogs Only</SelectItem>
                <SelectItem value="cat">Cats Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Animal cards */}
        {isLoading ? (
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
        ) : filteredAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map(animal => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4 text-gray-400">
              <FilterIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">No matches found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
