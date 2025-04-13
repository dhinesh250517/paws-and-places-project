
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AnimalCard from '../components/AnimalCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Animal, DbAnimal } from '../types';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const HomePage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [animalType, setAnimalType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch animals from Supabase
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setIsLoading(true);
        const { data: dbAnimals, error } = await supabase
          .from('animals')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching animals:', error);
          toast.error('Failed to load animals');
          return;
        }
        
        // Map DB animals to our frontend Animal type
        const mappedAnimals = (dbAnimals as DbAnimal[]).map(animal => ({
          id: animal.id,
          type: animal.type as 'dog' | 'cat',
          count: animal.count,
          healthCondition: animal.health_condition,
          location: {
            address: animal.address,
            mapUrl: animal.map_url,
          },
          qrCodeUrl: animal.qr_code_url,
          photo: animal.photo_url || undefined,
          uploaderName: animal.uploader_name,
          uploaderEmail: animal.uploader_email,
          uploaderContact: animal.uploader_contact || undefined,
          createdAt: new Date(animal.created_at),
        }));
        
        setAnimals(mappedAnimals);
        setFilteredAnimals(mappedAnimals);
      } catch (error) {
        console.error('Unexpected error fetching animals:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
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
