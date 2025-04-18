
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Animal, DbAnimal } from '../types';
import { supabase } from '../integrations/supabase/client';

const DeletedAnimals = () => {
  const navigate = useNavigate();
  const [deletedAnimals, setDeletedAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isOwner = localStorage.getItem('ownerLoggedIn');
    if (!isOwner) {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }
    fetchDeletedAnimals();
  }, [navigate]);

  const fetchDeletedAnimals = async () => {
    try {
      const { data: deletedDbAnimals, error } = await supabase
        .from('deleted_animals')
        .select('*')
        .order('deleted_at', { ascending: false });

      if (error) {
        console.error('Error fetching deleted animals:', error);
        toast.error('Failed to load deleted animals');
        return;
      }

      const mappedAnimals = (deletedDbAnimals as DbAnimal[]).map(animal => ({
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

      setDeletedAnimals(mappedAnimals);
    } catch (error) {
      console.error('Unexpected error fetching deleted animals:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="paws-container py-8">
        <h1 className="text-3xl font-bold mb-8">Deleted Animals</h1>
        {loading ? (
          <div className="text-center py-16">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Uploader</TableHead>
                <TableHead>Deleted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deletedAnimals.length > 0 ? (
                deletedAnimals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell>
                      {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                    </TableCell>
                    <TableCell>{animal.location.address}</TableCell>
                    <TableCell>
                      {animal.uploaderName}<br/>
                      <span className="text-sm text-gray-500">{animal.uploaderEmail}</span>
                    </TableCell>
                    <TableCell>{animal.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No deleted animals found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default DeletedAnimals;
