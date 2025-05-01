
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { ArchiveIcon } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Animal } from '../types';
import { useAnimalsData } from '@/hooks/owner/useAnimalsData';
import { PendingAdoptionsTable } from '@/components/owner/PendingAdoptionsTable';
import { OldEntriesTable } from '@/components/owner/OldEntriesTable';
import { AdoptedAnimalsTable } from '@/components/owner/AdoptedAnimalsTable';
import { EmergencyAnimalsTable } from '@/components/owner/EmergencyAnimalsTable';
import { AllAnimalsTable } from '@/components/owner/AllAnimalsTable';
import { EmergencyAlert } from '@/components/owner/EmergencyAlert';
import { ErrorDisplay } from '@/components/owner/ErrorDisplay';
import { LoadingSpinner } from '@/components/owner/LoadingSpinner';
import { VerifyAdoptionDialog } from '@/components/owner/VerifyAdoptionDialog';
import { DeleteConfirmDialog } from '@/components/owner/DeleteConfirmDialog';

const OwnerPage = () => {
  const navigate = useNavigate();
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<string | null>(null);
  
  const {
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
  } = useAnimalsData();

  // Check authentication
  useEffect(() => {
    const isOwner = localStorage.getItem('ownerLoggedIn');
    if (!isOwner) {
      toast.error('Unauthorized access');
      navigate('/');
    }
  }, [navigate]);

  // Set up persistent login
  useEffect(() => {
    localStorage.setItem('ownerLoggedIn', 'true');
    return () => {
      // We would handle logout cleanup here
    };
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    fetchAnimals();
    
    const channel = supabase
      .channel('animal-changes')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'animals' }, 
        () => {
          fetchAnimals();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAnimals]);

  // Handler functions
  const handleVerifyAdoption = (animal: Animal) => {
    setCurrentAnimal(animal);
    setVerifyDialogOpen(true);
  };
  
  const confirmAdoption = async (name: string, email: string, contact: string) => {
    if (!currentAnimal) return;
    
    const success = await updateAdoptionStatus(
      currentAnimal.id, 
      true, 
      name,
      email,
      contact
    );
    
    if (success) {
      toast.success('Adoption verified successfully!');
      fetchAnimals(); // Refresh data
      setVerifyDialogOpen(false);
    }
  };
  
  const handleDeleteAnimal = (animalId: string) => {
    setAnimalToDelete(animalId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteAnimal = async () => {
    if (!animalToDelete) return;
    
    const success = await deleteAnimal(animalToDelete);
    
    if (success) {
      toast.success('Animal moved to deleted animals!');
      setDeleteDialogOpen(false);
      setAnimalToDelete(null);
    }
  };
  
  const rejectAdoption = async (animalId: string) => {
    const success = await updateAdoptionStatus(
      animalId, 
      false, 
      null,
      null,
      null
    );
    
    if (success) {
      toast.success('Adoption rejected successfully!');
      fetchAnimals(); // Refresh data
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('ownerLoggedIn');
    toast.info('Owner logged out');
    navigate('/');
  };

  return (
    <Layout>
      <div className="paws-container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Owner Admin Panel</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/deleted')}
              className="flex items-center"
            >
              <ArchiveIcon className="h-4 w-4 mr-2" />
              View Deleted Animals
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        
        <EmergencyAlert 
          show={showEmergencyAlert} 
          emergencyAnimals={emergencyAnimals} 
          onDismiss={dismissEmergencyAlert} 
        />
        
        <ErrorDisplay error={error} onRetry={handleRetry} />
        
        <LoadingSpinner loading={loading && !error} />
        
        {!loading && !error && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Pending Adoptions</h2>
              <PendingAdoptionsTable 
                pendingAdoptions={pendingAdoptions}
                onVerify={handleVerifyAdoption}
                onReject={rejectAdoption}
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Entries Older Than 30 Days</h2>
              <OldEntriesTable 
                oldEntries={oldEntries} 
                onDelete={handleDeleteAnimal} 
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Adopted Animals</h2>
              <AdoptedAnimalsTable 
                adoptedEntries={adoptedEntries} 
                onDelete={handleDeleteAnimal} 
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                Emergency Animals
              </h2>
              <EmergencyAnimalsTable 
                emergencyAnimals={emergencyAnimals} 
                onDelete={handleDeleteAnimal} 
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">All Animals</h2>
              <AllAnimalsTable 
                animals={animals} 
                onDelete={handleDeleteAnimal} 
              />
            </div>
          </div>
        )}
        
        <VerifyAdoptionDialog 
          isOpen={verifyDialogOpen}
          animal={currentAnimal}
          onClose={() => setVerifyDialogOpen(false)}
          onConfirm={confirmAdoption}
        />
        
        <DeleteConfirmDialog 
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDeleteAnimal}
        />
      </div>
    </Layout>
  );
};

export default OwnerPage;
