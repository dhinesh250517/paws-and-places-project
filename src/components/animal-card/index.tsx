
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPinIcon } from 'lucide-react';
import { Animal } from '../../types';
import { Button } from "@/components/ui/button";
import AnimalStatusBadges from './AnimalStatusBadges';
import ContactInfo from './ContactInfo';
import AnimalImage from './AnimalImage';
import HelpPopover from './HelpPopover';
import DonateDialog from './DonateDialog';
import AdoptButton from './AdoptButton';
import AdoptionForm from './AdoptionForm';

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const { 
    id, type, count, healthCondition, location, qrCodeUrl, createdAt, 
    uploaderName, uploaderEmail, uploaderContact, isEmergency, isAdopted, 
    adopterName, adopterEmail, adopterContact, adoptedAt 
  } = animal;
  
  const [isAdoptionDialogOpen, setIsAdoptionDialogOpen] = useState(false);
  const isPendingAdoption = adopterName && !isAdopted;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewMap = () => {
    window.open(location.mapUrl, '_blank');
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <AnimalStatusBadges 
          type={type}
          count={count}
          isEmergency={!!isEmergency}
          isAdopted={!!isAdopted}
          isPendingAdoption={!!isPendingAdoption}
          createdAt={createdAt}
          formatDate={formatDate}
        />
        <CardTitle className="text-lg font-medium mt-2">
          {count > 1 ? `Group of ${count} stray ${type}s` : `Stray ${type}`}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <HelpPopover 
          type={type} 
          isAdopted={!!isAdopted} 
          isPendingAdoption={!!isPendingAdoption}
          adoptedAt={adoptedAt}
          handleAdopt={() => setIsAdoptionDialogOpen(true)}
          formatDate={formatDate}
        >
          <AnimalImage 
            type={type}
            isAdopted={!!isAdopted}
            isPendingAdoption={!!isPendingAdoption}
            adoptedAt={adoptedAt}
            formatDate={formatDate}
          />
        </HelpPopover>
        
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

          <ContactInfo
            isAdopted={!!isAdopted}
            isPendingAdoption={!!isPendingAdoption}
            uploaderName={uploaderName}
            uploaderEmail={uploaderEmail}
            uploaderContact={uploaderContact}
            adopterName={adopterName}
            adopterEmail={adopterEmail}
            adopterContact={adopterContact}
            adoptedAt={adoptedAt}
            formatDate={formatDate}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-0">
        <DonateDialog 
          qrCodeUrl={qrCodeUrl}
          uploaderName={uploaderName}
          uploaderEmail={uploaderEmail}
          uploaderContact={uploaderContact}
        />
        
        <AdoptButton 
          isAdopted={!!isAdopted}
          isPendingAdoption={!!isPendingAdoption}
          onClick={() => setIsAdoptionDialogOpen(true)}
        />
        
        <Dialog open={isAdoptionDialogOpen} onOpenChange={setIsAdoptionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adopt this {type}</DialogTitle>
            </DialogHeader>
            <AdoptionForm 
              animalId={id}
              type={type}
              onSuccess={() => setIsAdoptionDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        <div className="text-center text-sm text-gray-600 italic mt-2">
          {isAdopted ? 
            "This animal has been adopted." : 
            isPendingAdoption ? 
            "This animal has a pending adoption request awaiting approval." :
            "For adoption and accurate location details, please contact the uploader directly."
          }
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnimalCard;
