
import { useState, useEffect } from 'react';
import { Animal, DbAnimal } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useAnimalData = (filters: {
  type: 'all' | 'dogs' | 'cats';
  emergencyOnly: boolean;
  sortBy: 'newest' | 'oldest';
}) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('animals')
          .select('*')
          .eq('deleted', false) // Only get non-deleted animals
          .eq('is_adopted', false); // Only get animals that aren't adopted

        // Apply type filter if not 'all'
        if (filters.type === 'dogs') {
          query = query.eq('type', 'dog');
        } else if (filters.type === 'cats') {
          query = query.eq('type', 'cat');
        }

        // Apply emergency filter
        if (filters.emergencyOnly) {
          query = query.eq('is_emergency', true);
        }

        // Apply sorting
        query = query.order('created_at', {
          ascending: filters.sortBy === 'oldest',
        });

        const { data: animalsData, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!isMounted) return;

        // Map fetched data to Animal type
        const mappedAnimals = (animalsData as DbAnimal[]).map((animal) => ({
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
        }));

        setAnimals(mappedAnimals);
      } catch (err) {
        console.error('Error fetching animals:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
          // Don't clear previous data on error to maintain UI stability
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnimals();

    // Set up real-time subscription to update when data changes
    const channel = supabase
      .channel('public:animals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'animals' }, (payload) => {
        console.log('Real-time update received:', payload);
        fetchAnimals();
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [filters]);

  return { animals, loading, error };
};

export default useAnimalData;
