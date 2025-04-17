
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HeartIcon } from 'lucide-react';
import AnimalImage from './AnimalImage';

interface HelpPopoverProps {
  children: React.ReactNode;
  type: string;
  isAdopted: boolean;
  isPendingAdoption: boolean;
  adoptedAt?: Date;
  handleAdopt: () => void;
  formatDate: (date: Date) => string;
}

const HelpPopover: React.FC<HelpPopoverProps> = ({ 
  children, type, isAdopted, isPendingAdoption, adoptedAt, handleAdopt, formatDate 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
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
          <Button onClick={handleAdopt} className="w-full mt-2 bg-pawsBlue hover:bg-pawsBlue-600" disabled={isAdopted || isPendingAdoption}>
            <HeartIcon className="h-4 w-4 mr-2" />
            {isAdopted ? 'Already Adopted' : isPendingAdoption ? 'Pending Approval' : 'I want to help'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HelpPopover;
