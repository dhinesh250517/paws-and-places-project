
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon } from 'lucide-react';

interface HomeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  animalType: string;
  setAnimalType: (type: string) => void;
  adoptionStatus: string;
  setAdoptionStatus: (status: string) => void;
}

const HomeFilters: React.FC<HomeFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  animalType,
  setAnimalType,
  adoptionStatus,
  setAdoptionStatus
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search by location or condition..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select 
          value={animalType} 
          onValueChange={setAnimalType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Animal Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Animals</SelectItem>
            <SelectItem value="dog">Dogs Only</SelectItem>
            <SelectItem value="cat">Cats Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-48">
        <Select 
          value={adoptionStatus} 
          onValueChange={setAdoptionStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Adoption Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="adopted">Adopted</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HomeFilters;
