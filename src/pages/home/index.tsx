
import React from 'react';
import Layout from '../../components/Layout';
import HomeHeader from './HomeHeader';
import HomeFilters from './HomeFilters';
import AnimalsGrid from './AnimalsGrid';
import { useAnimalData } from './useAnimalData';
import { useAnimalFilters } from './useAnimalFilters';
import { Animal } from '@/types';

const HomePage = () => {
  const [filters, setFilters] = React.useState({
    type: 'all' as 'all' | 'dogs' | 'cats',
    emergencyOnly: false,
    sortBy: 'newest' as 'newest' | 'oldest'
  });
  
  const { animals, loading, error } = useAnimalData(filters);
  const { 
    searchTerm, 
    setSearchTerm, 
    animalType, 
    setAnimalType, 
    adoptionStatus, 
    setAdoptionStatus,
    filteredAnimals 
  } = useAnimalFilters(animals);
  
  return (
    <Layout>
      <div className="paws-container py-8">
        <HomeHeader />
        
        <HomeFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          animalType={animalType}
          setAnimalType={setAnimalType}
          adoptionStatus={adoptionStatus}
          setAdoptionStatus={setAdoptionStatus}
        />
        
        <AnimalsGrid animals={filteredAnimals} isLoading={loading} />
      </div>
    </Layout>
  );
};

export default HomePage;
