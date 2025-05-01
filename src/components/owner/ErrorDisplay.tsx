
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

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

  // Check if it's an offline error
  const isOfflineError = error.message.includes('offline') || 
                         error.message.includes('Failed to fetch') ||
                         error.message.includes('Network') ||
                         error.message.includes('internet');

  return (
    <Alert variant="destructive" className="mb-6">
      {isOfflineError ? (
        <WifiOff className="h-5 w-5" />
      ) : (
        <AlertTriangle className="h-5 w-5" />
      )}
      <AlertTitle>{isOfflineError ? 'Network Error' : 'Error Loading Animals'}</AlertTitle>
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
