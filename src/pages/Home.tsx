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
  const [adoptionStatus, setAdoptionStatus] = useState('available');
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('Home page rendered with', animals.length, 'animals');
  
  const fetchAnimals = async () => {
    try {
      console.log('Fetching animals from database...');
      setIsLoading(true);
      const { data: dbAnimals, error } = await supabase
        .from('animals')
        .select('*')
        .eq('deleted', false)
        .eq('is_adopted', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching animals:', error);
        toast.error('Failed to load animals');
        return;
      }
      
      console.log(`Received ${dbAnimals?.length || 0} animals from the database`);
      
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
        isEmergency: animal.is_emergency,
        isAdopted: false,
        adopterName: undefined,
        adopterEmail: undefined,
        adopterContact: undefined,
        adoptedAt: undefined,
      }));
      
      console.log('Mapped animals:', mappedAnimals.length);
      setAnimals(mappedAnimals);
      setFilteredAnimals(mappedAnimals);
    } catch (error) {
      console.error('Unexpected error fetching animals:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnimals();
    
    const channel = supabase
      .channel('animal-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'animals'
        }, 
        (payload) => {
          console.log('Realtime update received:', payload);
          if (payload.eventType === 'DELETE') {
            console.log(`Animal deleted with ID: ${payload.old?.id}`);
            setAnimals(prev => prev.filter(animal => animal.id !== payload.old.id));
            setFilteredAnimals(prev => prev.filter(animal => animal.id !== payload.old.id));
          } else {
            fetchAnimals();
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, refreshing data...');
        fetchAnimals();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      console.log('Cleaning up subscriptions');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    let results = animals;
    
    if (animalType !== 'all') {
      results = results.filter(animal => animal.type === animalType);
    }
    
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(animal => 
        animal.healthCondition.toLowerCase().includes(lowercasedSearch) ||
        animal.location.address.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    console.log('Filtered to', results.length, 'animals');
    setFilteredAnimals(results);
  }, [searchTerm, animalType, animals]);
  
  return (
    <Layout>
      <div className="paws-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help Strays Near You</h1>
          <p className="text-gray-600">Browse listings of stray animals that need your help with food, care, or adoption.</p>
        </div>
        
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
