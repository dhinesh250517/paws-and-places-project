
import React from 'react';
import Layout from '../components/Layout';
import { Animal } from '../types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import AnimalCard from '../components/animal-card';
import { Skeleton } from "@/components/ui/skeleton";

const AdoptedAnimalsPage = () => {
  const { data: adoptedAnimals, isLoading } = useQuery({
    queryKey: ['adopted-animals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('is_adopted', true)
        .order('adopted_at', { ascending: false });

      if (error) throw error;
      
      return data.map(animal => ({
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
      })) as Animal[];
    }
  });

  return (
    <Layout>
      <div className="paws-container py-8">
        <h1 className="text-3xl font-bold mb-8">Adopted Animals</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 p-4 border rounded-lg">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : adoptedAnimals && adoptedAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adoptedAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No animals have been adopted yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdoptedAnimalsPage;
