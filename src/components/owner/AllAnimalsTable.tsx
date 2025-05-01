
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon } from 'lucide-react';
import { Animal } from '@/types';

interface AllAnimalsTableProps {
  animals: Animal[];
  onDelete: (animalId: string) => void;
}

export const AllAnimalsTable: React.FC<AllAnimalsTableProps> = ({
  animals,
  onDelete
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {animals.map((animal) => (
          <TableRow key={animal.id} className={animal.isEmergency ? "bg-red-50" : ""}>
            <TableCell>
              {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
            </TableCell>
            <TableCell>{animal.location.address}</TableCell>
            <TableCell>
              {animal.isAdopted ? (
                <Badge className="bg-green-500">Adopted</Badge>
              ) : animal.adopterName ? (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  Pending Verification
                </Badge>
              ) : animal.isEmergency ? (
                <Badge variant="destructive">Emergency</Badge>
              ) : (
                <Badge variant="outline">Available</Badge>
              )}
            </TableCell>
            <TableCell>{animal.createdAt.toLocaleDateString()}</TableCell>
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
