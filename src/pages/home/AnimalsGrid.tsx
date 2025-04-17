
import React from 'react';
import AnimalCard from '../../components/AnimalCard';
import { Animal } from '../../types';
import AnimalsEmptyState from './AnimalsEmptyState';
import AnimalsLoadingSkeleton from './AnimalsLoadingSkeleton';

interface AnimalsGridProps {
  animals: Animal[];
  isLoading: boolean;
}

const AnimalsGrid: React.FC<AnimalsGridProps> = ({ animals, isLoading }) => {
  if (isLoading) {
    return <AnimalsLoadingSkeleton />;
  }

  if (animals.length === 0) {
    return <AnimalsEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {animals.map(animal => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
};

export default AnimalsGrid;
