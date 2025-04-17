
import React from 'react';
import { FilterIcon } from 'lucide-react';

const AnimalsEmptyState: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="mb-4 text-gray-400">
        <FilterIcon className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-xl font-medium mb-2">No matches found</h3>
      <p className="text-gray-600">
        Try adjusting your search or filter criteria.
      </p>
    </div>
  );
};

export default AnimalsEmptyState;
