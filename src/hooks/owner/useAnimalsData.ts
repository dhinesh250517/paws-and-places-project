
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Animal, DbAnimal } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useAnimalsData = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pendingAdoptions, setPendingAdoptions] = useState<Animal[]>([]);
  const [oldEntries, setOldEntries] = useState<Animal[]>([]);
  const [adoptedEntries, setAdoptedEntries] = useState<Animal[]>([]);
  const [emergencyAnimals, setEmergencyAnimals] = useState<Animal[]>([]);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAnimals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a small delay to avoid race conditions with Supabase
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data: dbAnimals, error } = await supabase
        .from('animals')
        .select('*')
        .eq('deleted', false) // Only fetch non-deleted animals
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching animals:', error);
        toast.error('Failed to load animals');
        setError(new Error(error.message));
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
      
      setAnimals(mappedAnimals);
      
      // Split animals into different categories
      const pending = mappedAnimals.filter(
        animal => animal.adopterName && !animal.isAdopted
      );
      setPendingAdoptions(pending);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const old = mappedAnimals.filter(
        animal => !animal.isAdopted && animal.createdAt < thirtyDaysAgo
      );
      setOldEntries(old);
      
      const adopted = mappedAnimals.filter(animal => animal.isAdopted);
      setAdoptedEntries(adopted);
      
      const emergency = mappedAnimals.filter(animal => animal.isEmergency);
      const newEmergencies = emergency.filter(
        em => !emergencyAnimals.some(existing => existing.id === em.id)
      );
      
      setEmergencyAnimals(emergency);
      
      if (newEmergencies.length > 0) {
        setShowEmergencyAlert(true);
        newEmergencies.forEach(animal => {
          toast.error(
            `Emergency: ${animal.count} ${animal.type}(s) at ${animal.location.address}`, 
            { duration: 8000 }
          );
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching animals:', error);
      toast.error('An unexpected error occurred');
      setError(error instanceof Error ? error : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [emergencyAnimals]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchAnimals();
    toast.info('Retrying to fetch animals...');
  };

  const updateAdoptionStatus = async (
    animalId: string, 
    isAdopted: boolean, 
    adopterName: string | null = null, 
    adopterEmail: string | null = null, 
    adopterContact: string | null = null
  ) => {
    try {
      const { error } = await supabase.functions.invoke('update-adoption-status', {
        body: { 
          id: animalId,
          isAdopted,
          adopterName,
          adopterEmail,
          adopterContact
        }
      });
      
      if (error) {
        console.error('Error updating adoption status:', error);
        toast.error('Failed to update adoption status: ' + error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in adoption operation:', error);
      toast.error('Failed to process adoption request');
      return false;
    }
  };

  const deleteAnimal = async (animalId: string) => {
    try {
      // Mark the animal as deleted instead of permanently deleting it
      const { error } = await supabase
        .from('animals')
        .update({ deleted: true })
        .eq('id', animalId);
      
      if (error) {
        console.error('Error marking animal as deleted:', error);
        toast.error('Failed to delete animal: ' + error.message);
        return false;
      }
      
      // Update local state to reflect the deletion
      setAnimals(prev => prev.filter(a => a.id !== animalId));
      setPendingAdoptions(prev => prev.filter(a => a.id !== animalId));
      setOldEntries(prev => prev.filter(a => a.id !== animalId));
      setAdoptedEntries(prev => prev.filter(a => a.id !== animalId));
      setEmergencyAnimals(prev => prev.filter(a => a.id !== animalId));
      
      return true;
    } catch (error) {
      console.error('Error in deletion:', error);
      toast.error('Failed to delete animal');
      return false;
    }
  };

  const dismissEmergencyAlert = () => {
    setShowEmergencyAlert(false);
  };

  return {
    animals,
    loading,
    error,
    pendingAdoptions,
    oldEntries,
    adoptedEntries,
    emergencyAnimals,
    showEmergencyAlert,
    fetchAnimals,
    handleRetry,
    updateAdoptionStatus,
    deleteAnimal,
    dismissEmergencyAlert
  };
};
