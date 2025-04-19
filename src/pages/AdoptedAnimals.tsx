
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

      return data || [];
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
