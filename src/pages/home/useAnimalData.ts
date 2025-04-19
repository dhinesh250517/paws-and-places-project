
import { useState, useEffect } from 'react';
import { Animal, DbAnimal } from '../../types';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

export const useAnimalData = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAnimals = async () => {
    try {
      console.log('Fetching animals from database...');
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
        isAdopted: animal.is_adopted || false,
        adopterName: animal.adopter_name || undefined,
        adopterEmail: animal.adopter_email || undefined,
        adopterContact: animal.adopter_contact || undefined,
        adoptedAt: animal.adopted_at ? new Date(animal.adopted_at) : undefined,
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
    
    // Listen for real-time updates on the animals table
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
            // Immediately remove the deleted animal from the UI
            setAnimals(prev => prev.filter(animal => animal.id !== payload.old.id));
            setFilteredAnimals(prev => prev.filter(animal => animal.id !== payload.old.id));
          } else {
            // For other changes, just refresh the data
            fetchAnimals();
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
    
    // Refresh data when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, refreshing data...');
        fetchAnimals();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up subscriptions on unmount
    return () => {
      console.log('Cleaning up subscriptions');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Debug the realtime channel
  useEffect(() => {
    const testRealtime = async () => {
      try {
        // Check if realtime is enabled for your Supabase project
        const { data, error } = await supabase.from('animals').select('count').limit(1);
        console.log('Realtime test query result:', data, error);
      } catch (err) {
        console.error('Realtime test error:', err);
      }
    };
    
    testRealtime();
  }, []);

  return {
    animals,
    filteredAnimals,
    setFilteredAnimals,
    isLoading,
    fetchAnimals,
  };
};
