
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MapPinIcon, DogIcon, CatIcon, HeartIcon, CalendarIcon, ClockIcon, DollarSignIcon, FolderHeartIcon } from 'lucide-react';
import { Animal } from '../types';

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const { type, count, healthCondition, location, qrCodeUrl, photo, createdAt } = animal;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleAdopt = () => {
    toast.success(`Thank you for your interest in adopting! You can visit this location to help.`);
    // In a real app, we would show contact details or next steps
    window.open(location.mapUrl, '_blank');
  };

  const handleViewMap = () => {
    window.open(location.mapUrl, '_blank');
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={type === 'dog' ? 'default' : 'secondary'} className={type === 'dog' ? 'bg-pawsOrange' : 'bg-pawsBlue'}>
            {type === 'dog' ? <DogIcon className="h-3 w-3 mr-1" /> : <CatIcon className="h-3 w-3 mr-1" />}
            {count > 1 ? `${count} ${type}s` : type}
          </Badge>
          <div className="text-xs text-gray-500 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            {formatDate(createdAt)}
          </div>
        </div>
        <CardTitle className="text-lg font-medium mt-2">
          {count > 1 ? `Group of ${count} stray ${type}s` : `Stray ${type}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
          {photo ? (
            <img 
              src={photo} 
              alt={`Stray ${type}`} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              {type === 'dog' ? (
                <DogIcon className="h-16 w-16 text-muted-foreground opacity-50" />
              ) : (
                <CatIcon className="h-16 w-16 text-muted-foreground opacity-50" />
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium mb-1">Health Condition:</div>
            <p className="text-sm text-gray-600">{healthCondition}</p>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1 flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1 text-pawsOrange" />
              Location:
            </div>
            <p className="text-sm text-gray-600 truncate">{location.address}</p>
            <Button 
              variant="link" 
              size="sm" 
              className="px-0 h-auto text-pawsBlue"
              onClick={handleViewMap}
            >
              View on map
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-pawsOrange text-pawsOrange hover:bg-pawsOrange-100"
            >
              <DollarSignIcon className="h-4 w-4 mr-2" />
              Donate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan to Donate</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="bg-white p-4 rounded-md shadow-sm border">
                {/* Placeholder for QR code */}
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={qrCodeUrl || "https://via.placeholder.com/200?text=GPay+QR+Code"} 
                    alt="GPay QR Code"
                    className="max-w-full max-h-full"
                  />
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-gray-600">
                Scan this QR code with your GPay app to donate to the caretaker of this animal.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          className="w-full bg-pawsBlue hover:bg-pawsBlue-600"
          onClick={handleAdopt}
        >
          <HeartIcon className="h-4 w-4 mr-2" />
          Adopt / Help
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnimalCard;
