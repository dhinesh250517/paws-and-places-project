
import { useState, useEffect } from 'react';
import { Animal } from '../../types';

export const useAnimalFilters = (animals: Animal[], setFilteredAnimals: React.Dispatch<React.SetStateAction<Animal[]>>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animalType, setAnimalType] = useState('all');
  const [adoptionStatus, setAdoptionStatus] = useState('all');

  useEffect(() => {
    let results = animals;
    
    if (animalType !== 'all') {
      results = results.filter(animal => animal.type === animalType);
    }
    
    if (adoptionStatus !== 'all') {
      if (adoptionStatus === 'adopted') {
        results = results.filter(animal => animal.isAdopted === true);
      } else if (adoptionStatus === 'available') {
        results = results.filter(animal => !animal.isAdopted && !animal.adopterName);
      } else if (adoptionStatus === 'pending') {
        results = results.filter(animal => animal.adopterName && !animal.isAdopted);
      }
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
