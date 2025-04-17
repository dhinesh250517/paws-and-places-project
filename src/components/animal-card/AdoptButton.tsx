
import React from 'react';
import { Button } from "@/components/ui/button";
import { HeartIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';

interface AdoptButtonProps {
  isAdopted: boolean;
  isPendingAdoption: boolean;
  onClick: () => void;
}

const AdoptButton: React.FC<AdoptButtonProps> = ({ isAdopted, isPendingAdoption, onClick }) => {
  return (
    <Button 
      className={`w-full ${isAdopted ? 'bg-green-500 hover:bg-green-600' : isPendingAdoption ? 'bg-amber-500 hover:bg-amber-600' : 'bg-pawsBlue hover:bg-pawsBlue-600'}`}
      onClick={onClick}
      disabled={isAdopted || isPendingAdoption}
    >
      {isAdopted ? (
        <>
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Already Adopted
        </>
      ) : isPendingAdoption ? (
        <>
          <ClockIcon className="h-4 w-4 mr-2" />
          Pending Approval
        </>
      ) : (
        <>
          <HeartIcon className="h-4 w-4 mr-2" />
          Adopt / Help
        </>
      )}
    </Button>
  );
};

export default AdoptButton;
