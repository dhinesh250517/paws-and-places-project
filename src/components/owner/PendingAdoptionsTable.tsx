
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Animal } from '@/types';

interface PendingAdoptionsTableProps {
  pendingAdoptions: Animal[];
  onVerify: (animal: Animal) => void;
  onReject: (animalId: string) => void;
}

export const PendingAdoptionsTable: React.FC<PendingAdoptionsTableProps> = ({
  pendingAdoptions,
  onVerify,
  onReject
}) => {
  if (pendingAdoptions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No pending adoptions</p>
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
          <TableHead>Uploader</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingAdoptions.map((animal) => (
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
              {animal.uploaderName}<br/>
              <span className="text-sm text-gray-500">{animal.uploaderEmail}</span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onVerify(animal)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" /> Verify
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onReject(animal.id)}
                >
                  <XCircleIcon className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
