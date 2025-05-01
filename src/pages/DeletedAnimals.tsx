
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Animal, DbAnimal } from '../types';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { TrashIcon, InfoIcon } from 'lucide-react';

const DeletedAnimals = () => {
  const navigate = useNavigate();
  const [deletedAnimals, setDeletedAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isOwner = localStorage.getItem('ownerLoggedIn');
    if (!isOwner) {
      toast.error('Unauthorized access');
      navigate('/');
    }
  }, [navigate]);

  const fetchDeletedAnimals = async () => {
    try {
      setLoading(true);
      const { data: dbAnimals, error } = await supabase
        .from('animals')
        .select('*')
        .eq('deleted', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching deleted animals:', error);
        toast.error('Failed to load deleted animals');
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
      
      setDeletedAnimals(mappedAnimals);
    } catch (error) {
      console.error('Unexpected error fetching deleted animals:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDeletedAnimals();
    
    const channel = supabase
      .channel('animal-changes')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'animals' }, 
        () => {
          fetchDeletedAnimals();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const permanentlyDeleteAnimal = async (animalId: string) => {
    try {
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', animalId);
      
      if (error) {
        console.error('Error permanently deleting animal:', error);
        toast.error('Failed to permanently delete animal: ' + error.message);
        return;
      }
      
      toast.success('Animal permanently deleted!');
      setDeletedAnimals(prev => prev.filter(a => a.id !== animalId));
    } catch (error) {
      console.error('Error in permanent deletion:', error);
      toast.error('Failed to permanently delete animal');
    }
  };
  
  return (
    <Layout>
      <div className="paws-container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Deleted Animals</h1>
          <Button variant="outline" onClick={() => navigate('/owner')}>
            Back to Admin
          </Button>
        </div>
        
        <Alert className="mb-6">
          <InfoIcon className="h-5 w-5" />
          <AlertTitle>About Deleted Animals</AlertTitle>
          <AlertDescription>
            This page shows animals that have been marked as deleted. These animals are not visible to regular users.
            You can permanently delete them from the database using the delete button.
          </AlertDescription>
        </Alert>
        
        {loading ? (
          <div className="text-center py-16">Loading...</div>
        ) : (
          <div>
            {deletedAnimals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedAnimals.map((animal) => (
                    <TableRow key={animal.id} className="bg-gray-50">
                      <TableCell>
                        {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                      </TableCell>
                      <TableCell>{animal.location.address}</TableCell>
                      <TableCell>
                        {animal.isEmergency ? (
                          <Badge variant="destructive">Emergency: {animal.healthCondition}</Badge>
                        ) : (
                          animal.healthCondition
                        )}
                      </TableCell>
                      <TableCell>
                        {animal.uploaderName}<br/>
                        <span className="text-sm text-gray-500">{animal.uploaderEmail}</span>
                      </TableCell>
                      <TableCell>{animal.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => permanentlyDeleteAnimal(animal.id)}
                        >
                          <TrashIcon className="h-4 w-4 mr-1" /> Delete Permanently
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No deleted animals found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DeletedAnimals;
