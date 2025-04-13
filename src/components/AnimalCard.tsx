
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MapPinIcon, DogIcon, CatIcon, HeartIcon, CalendarIcon, ClockIcon, DollarSignIcon, UserIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Animal } from '../types';

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const { type, count, healthCondition, location, qrCodeUrl, createdAt, uploaderName, uploaderEmail, uploaderContact } = animal;
  
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
        <div className="mb-4 flex justify-center">
          <div className="relative w-full max-w-xs aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {type === 'dog' ? 
                <img 
                  src="/placeholder-dog.jpg" 
                  alt="Dog placeholder" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/300x300?text=Feed/Adopt+Me";
                  }} 
                /> : 
                <img 
                  src="/placeholder-cat.jpg" 
                  alt="Cat placeholder" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/300x300?text=Feed/Adopt+Me";
                  }}  
                />
              }
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2">
                Feed/Adopt Me
              </div>
            </div>
          </div>
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

          <div className="bg-gray-50 p-3 rounded-md border">
            <div className="text-sm font-medium mb-2 flex items-center text-pawsBlue">
              <UserIcon className="h-4 w-4 mr-1" />
              Contact Details:
            </div>
            <div className="text-sm text-gray-600">
              <p className="flex items-center mb-1">
                <UserIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                {uploaderName}
              </p>
              <p className="flex items-center mb-1">
                <MailIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                {uploaderEmail}
              </p>
              {uploaderContact && (
                <p className="flex items-center">
                  <PhoneIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  {uploaderContact}
                </p>
              )}
            </div>
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
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={qrCodeUrl}
                    alt="GPay QR Code"
                    className="max-w-full max-h-full"
                  />
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-gray-600">
                Scan this QR code with your GPay app to donate to the caretaker of this animal.
              </p>
              <div className="mt-4 text-center bg-gray-50 p-3 rounded-md border w-full">
                <div className="text-sm font-medium mb-1 text-pawsBlue">Uploader Details:</div>
                <p className="text-sm text-gray-600">{uploaderName}</p>
                <p className="text-sm text-gray-600">{uploaderEmail}</p>
                {uploaderContact && <p className="text-sm text-gray-600">{uploaderContact}</p>}
              </div>
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
        
        <div className="text-center text-sm text-gray-600 italic mt-2">
          For adoption and accurate location details, please contact the uploader directly.
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnimalCard;
