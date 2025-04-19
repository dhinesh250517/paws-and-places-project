
import { useState, useEffect } from 'react';
import { Animal } from '../../types';

export const useAnimalFilters = (animals: Animal[], setFilteredAnimals: React.Dispatch<React.SetStateAction<Animal[]>>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animalType, setAnimalType] = useState('all');
  const [adoptionStatus, setAdoptionStatus] = useState('available');

  useEffect(() => {
    let results = animals.filter(animal => !animal.isAdopted); // Filter out adopted animals
    
    if (animalType !== 'all') {
      results = results.filter(animal => animal.type === animalType);
    }
    
    if (adoptionStatus === 'pending') {
      results = results.filter(animal => animal.adopterName && !animal.isAdopted);
    } else if (adoptionStatus === 'available') {
      results = results.filter(animal => !animal.adopterName && !animal.isAdopted);
    }
    
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(animal => 
        animal.healthCondition.toLowerCase().includes(lowercasedSearch) ||
        animal.location.address.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    console.log('Filtered to', results.length, 'animals');
    setFilteredAnimals(results);
  }, [searchTerm, animalType, adoptionStatus, animals, setFilteredAnimals]);

  return {
    searchTerm,
    setSearchTerm,
    animalType,
    setAnimalType,
    adoptionStatus,
    setAdoptionStatus,
  };
};
