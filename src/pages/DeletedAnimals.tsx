
import React from 'react';
import Layout from '../components/Layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const DeletedAnimals = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isOwner = localStorage.getItem('ownerLoggedIn');
    if (!isOwner) {
      toast.error('Unauthorized access');
      navigate('/');
    }
  }, [navigate]);

  const { data: deletedAnimals, isLoading } = useQuery({
    queryKey: ['deletedAnimals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deleted_animals')
        .select('*')
        .order('deleted_at', { ascending: false });

      if (error) {
        toast.error('Failed to load deleted animals');
        throw error;
      }

      return data || [];
    },
  });

  return (
    <Layout>
      <div className="paws-container py-8">
        <h1 className="text-3xl font-bold mb-8">Deleted Animals</h1>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : deletedAnimals?.length === 0 ? (
          <div className="text-center text-gray-500">No deleted animals</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Deleted Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deletedAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>
                    {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                  </TableCell>
                  <TableCell>{animal.address}</TableCell>
                  <TableCell>{new Date(animal.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(animal.deleted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {animal.is_adopted ? 'Adopted' : 'Not Adopted'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default DeletedAnimals;
