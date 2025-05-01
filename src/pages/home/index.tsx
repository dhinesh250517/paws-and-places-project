
import React from 'react';
import Layout from '../../components/Layout';
import HomeHeader from './HomeHeader';
import HomeFilters from './HomeFilters';
import AnimalsGrid from './AnimalsGrid';
import { useAnimalData } from './useAnimalData';
import { useAnimalFilters } from './useAnimalFilters';

const HomePage = () => {
  const { filteredAnimals, setFilteredAnimals, isLoading, animals } = useAnimalData();
  const { 
    searchTerm, 
    setSearchTerm, 
    animalType, 
    setAnimalType, 
    adoptionStatus, 
    setAdoptionStatus 
  } = useAnimalFilters(animals, setFilteredAnimals);
  
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
        
        <AnimalsGrid animals={filteredAnimals} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default HomePage;
