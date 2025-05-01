
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, BellIcon } from 'lucide-react';
import { Animal } from '@/types';

interface EmergencyAlertProps {
  show: boolean;
  emergencyAnimals: Animal[];
  onDismiss: () => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({
  show,
  emergencyAnimals,
  onDismiss
}) => {
  if (!show || emergencyAnimals.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangleIcon className="h-5 w-5" />
      <AlertTitle className="flex items-center gap-2">
        <BellIcon className="h-4 w-4" /> Emergency Animals Reported!
      </AlertTitle>
      <AlertDescription>
        <p>There are {emergencyAnimals.length} emergency cases that need attention:</p>
        <ul className="mt-2 list-disc pl-5">
          {emergencyAnimals.slice(0, 3).map(animal => (
            <li key={animal.id} className="mt-1">
              {animal.count} {animal.type}(s) at {animal.location.address} - 
              <span className="font-medium"> {animal.healthCondition}</span>
            </li>
          ))}
          {emergencyAnimals.length > 3 && (
            <li className="mt-1">...and {emergencyAnimals.length - 3} more</li>
          )}
        </ul>
        <div className="mt-3">
          <Button size="sm" onClick={onDismiss} variant="outline">
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
