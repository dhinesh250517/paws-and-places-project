
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error | null;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry
}) => {
  if (!error) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangleIcon className="h-5 w-5" />
      <AlertTitle>Error loading animals</AlertTitle>
      <AlertDescription>
        <p>{error.message}</p>
        <div className="mt-3">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRetry}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
