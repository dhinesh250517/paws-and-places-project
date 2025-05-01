
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../integrations/supabase/client';
import { Animal, DbAnimal } from '../types';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AnimalCard from '../components/animal-card';
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, HeartHandshakeIcon, SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const AdoptedAnimals = () => {
  const [adoptedAnimals, setAdoptedAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdoptedAnimals = async () => {
    try {
      setIsLoading(true);
      
      const { data: dbAnimals, error } = await supabase
        .from('animals')
        .select('*')
        .eq('is_adopted', true)
        .order('adopted_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching adopted animals:', error);
        toast.error('Failed to load adopted animals');
        return;
      }

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
        isAdopted: animal.is_adopted || false,
        adopterName: animal.adopter_name || undefined,
        adopterEmail: animal.adopter_email || undefined,
        adopterContact: animal.adopter_contact || undefined,
        adoptedAt: animal.adopted_at ? new Date(animal.adopted_at) : undefined,
      }));

      setAdoptedAnimals(mappedAnimals);
    } catch (error) {
      console.error('Unexpected error fetching adopted animals:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptedAnimals();
    
    const channel = supabase
      .channel('adopted-animals-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'animals'
        }, 
        (payload) => {
          // Refresh data when changes are detected
          fetchAdoptedAnimals();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter animals based on search term
  const filteredAnimals = searchTerm 
    ? adoptedAnimals.filter(animal => 
        animal.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.adopterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : adoptedAnimals;

  return (
    <Layout>
      <div className="paws-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link to="/home" className="inline-flex items-center text-pawsBlue mb-2">
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold flex items-center">
              <HeartHandshakeIcon className="h-7 w-7 mr-2 text-green-500" />
              Adopted Animals
            </h1>
            <p className="text-gray-600 mt-1">
              Celebrating the animals that found their forever homes
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by location, adopter, or type..."
                className="pl-10 w-full md:w-80"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="h-96">
                <CardHeader className="animate-pulse bg-gray-200 h-20" />
                <CardContent className="animate-pulse bg-gray-100 h-60" />
                <CardFooter className="animate-pulse bg-gray-200 h-16" />
              </Card>
            ))}
          </div>
        ) : filteredAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map(animal => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HeartHandshakeIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No adopted animals found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm ? 
                "No adopted animals match your search criteria. Try adjusting your search." : 
                "There are currently no animals that have been adopted. Check back later!"}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdoptedAnimals;
