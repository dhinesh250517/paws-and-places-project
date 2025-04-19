
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDistance } from 'date-fns';

const DeletedAnimalsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isOwner = localStorage.getItem('ownerLoggedIn');
    if (!isOwner) {
      navigate('/');
    }
  }, [navigate]);

  const { data: deletedAnimals, isLoading } = useQuery({
    queryKey: ['deleted-animals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deleted_animals')
        .select('*')
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="paws-container py-8">
        <h1 className="text-3xl font-bold mb-8">Deleted Animals</h1>
        
        {isLoading ? (
          <div>Loading...</div>
        ) : deletedAnimals && deletedAnimals.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Deleted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deletedAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>
                    {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                  </TableCell>
                  <TableCell>{animal.address}</TableCell>
                  <TableCell>
                    {animal.uploader_name}<br/>
                    <span className="text-sm text-gray-500">{animal.uploader_email}</span>
                  </TableCell>
                  <TableCell>
                    {formatDistance(new Date(animal.deleted_at), new Date(), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No deleted animals found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DeletedAnimalsPage;
