
import React from 'react';
import Layout from '../components/Layout';
import AnimalCard from '../components/AnimalCard';
import { Animal } from '../types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const AdoptedAnimals = () => {
  const { data: adoptedAnimals, isLoading } = useQuery({
    queryKey: ['adoptedAnimals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('is_adopted', true)
        .eq('deleted', false)
        .order('adopted_at', { ascending: false });

      if (error) {
        toast.error('Failed to load adopted animals');
        throw error;
      }

      // Map the raw database data to our Animal type
      const mappedAnimals = (data || []).map(animal => ({
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

      return mappedAnimals;
    },
  });

  return (
    <Layout>
      <div className="paws-container py-8">
        <h1 className="text-3xl font-bold mb-8">Adopted Animals</h1>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : adoptedAnimals?.length === 0 ? (
          <div className="text-center text-gray-500">No adopted animals yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adoptedAnimals?.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdoptedAnimals;
