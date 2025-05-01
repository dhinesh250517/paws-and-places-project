
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon, AlertTriangleIcon } from 'lucide-react';
import { Animal } from '@/types';

interface EmergencyAnimalsTableProps {
  emergencyAnimals: Animal[];
  onDelete: (animalId: string) => void;
}

export const EmergencyAnimalsTable: React.FC<EmergencyAnimalsTableProps> = ({
  emergencyAnimals,
  onDelete
}) => {
  if (emergencyAnimals.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No emergency animals</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Health Condition</TableHead>
          <TableHead>Uploader</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emergencyAnimals.map((animal) => (
          <TableRow key={animal.id} className="bg-red-50">
            <TableCell>
              {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
            </TableCell>
            <TableCell>{animal.location.address}</TableCell>
            <TableCell className="font-medium text-red-600">
              {animal.healthCondition}
            </TableCell>
            <TableCell>
              {animal.uploaderName}<br/>
              <span className="text-sm text-gray-500">{animal.uploaderContact || animal.uploaderEmail}</span>
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
