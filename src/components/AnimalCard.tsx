
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MapPinIcon, DogIcon, CatIcon, HeartIcon, CalendarIcon, ClockIcon, DollarSignIcon, UserIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Animal } from '../types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const { type, count, healthCondition, location, qrCodeUrl, createdAt, uploaderName, uploaderEmail, uploaderContact, isEmergency } = animal;
  
  // Use these actual image URLs instead of the placeholder paths
  const animalImages = {
    dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9nfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
  };
  
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
          <div className="flex space-x-2">
            <Badge variant={type === 'dog' ? 'default' : 'secondary'} className={type === 'dog' ? 'bg-pawsOrange' : 'bg-pawsBlue'}>
              {type === 'dog' ? <DogIcon className="h-3 w-3 mr-1" /> : <CatIcon className="h-3 w-3 mr-1" />}
              {count > 1 ? `${count} ${type}s` : type}
            </Badge>
            {isEmergency && (
              <Badge variant="destructive">EMERGENCY</Badge>
            )}
          </div>
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
        <Popover>
          <PopoverTrigger asChild>
            <div className="mb-4 flex justify-center cursor-pointer">
              <div className="relative w-full max-w-xs aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={type === 'dog' ? animalImages.dog : animalImages.cat}
                  alt={`${type} in need`}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2">
                  Click to learn how to help
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">How You Can Help</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-medium">Feed</h4>
                <p className="text-sm text-gray-600">You can visit the location to provide food and water for the {type}.</p>
              </div>
              <div>
                <h4 className="font-medium">Adopt</h4>
                <p className="text-sm text-gray-600">Consider adopting the {type} to give it a forever home.</p>
              </div>
              <div>
                <h4 className="font-medium">Report</h4>
                <p className="text-sm text-gray-600">Contact local animal welfare organizations if the {type} needs urgent care.</p>
              </div>
              <Button onClick={handleAdopt} className="w-full mt-2 bg-pawsBlue hover:bg-pawsBlue-600">
                <HeartIcon className="h-4 w-4 mr-2" />
                I want to help
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
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
