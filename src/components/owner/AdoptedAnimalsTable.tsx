
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon } from 'lucide-react';
import { Animal } from '@/types';

interface AdoptedAnimalsTableProps {
  adoptedEntries: Animal[];
  onDelete: (animalId: string) => void;
}

export const AdoptedAnimalsTable: React.FC<AdoptedAnimalsTableProps> = ({
  adoptedEntries,
  onDelete
}) => {
  if (adoptedEntries.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No adopted animals</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Adopter</TableHead>
          <TableHead>Adopted Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adoptedEntries.map((animal) => (
          <TableRow key={animal.id}>
            <TableCell>
              {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
            </TableCell>
            <TableCell>{animal.location.address}</TableCell>
            <TableCell>
              {animal.adopterName}<br/>
              <span className="text-sm text-gray-500">{animal.adopterEmail}</span>
            </TableCell>
            <TableCell>
              {animal.adoptedAt?.toLocaleDateString() || 'Unknown'}
            </TableCell>
            <TableCell>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(animal.id)}
              >
                <TrashIcon className="h-4 w-4 mr-1" /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
