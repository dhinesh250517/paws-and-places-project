
import React from 'react';

interface LoadingSpinnerProps {
  loading: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="text-center py-16">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pawsBlue mb-4"></div>
        <p>Loading animals...</p>
      </div>
    </div>
  );
};
