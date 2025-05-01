
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon } from 'lucide-react';
import { Animal } from '@/types';

interface OldEntriesTableProps {
  oldEntries: Animal[];
  onDelete: (animalId: string) => void;
}

export const OldEntriesTable: React.FC<OldEntriesTableProps> = ({
  oldEntries,
  onDelete
}) => {
  if (oldEntries.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No entries older than 30 days</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead>Uploader</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {oldEntries.map((animal) => (
          <TableRow key={animal.id}>
            <TableCell>
              {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
            </TableCell>
            <TableCell>{animal.location.address}</TableCell>
            <TableCell>
              {animal.createdAt.toLocaleDateString()}
              <br />
              <Badge variant="outline">
                {Math.floor((new Date().getTime() - animal.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days ago
              </Badge>
            </TableCell>
            <TableCell>
              {animal.uploaderName}<br/>
              <span className="text-sm text-gray-500">{animal.uploaderEmail}</span>
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
