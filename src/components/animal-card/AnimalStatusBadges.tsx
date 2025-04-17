
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { DogIcon, CatIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';

interface AnimalStatusBadgesProps {
  type: string;
  count: number;
  isEmergency: boolean;
  isAdopted: boolean;
  isPendingAdoption: boolean;
  createdAt: Date;
  formatDate: (date: Date) => string;
}

const AnimalStatusBadges: React.FC<AnimalStatusBadgesProps> = ({ 
  type, count, isEmergency, isAdopted, isPendingAdoption, createdAt, formatDate 
}) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex space-x-2">
        <Badge variant={type === 'dog' ? 'default' : 'secondary'} className={type === 'dog' ? 'bg-pawsOrange' : 'bg-pawsBlue'}>
          {type === 'dog' ? <DogIcon className="h-3 w-3 mr-1" /> : <CatIcon className="h-3 w-3 mr-1" />}
          {count > 1 ? `${count} ${type}s` : type}
        </Badge>
        {isEmergency && (
          <Badge variant="destructive">EMERGENCY</Badge>
        )}
        {isAdopted && (
          <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Adopted
          </Badge>
        )}
        {isPendingAdoption && (
          <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
            Pending Approval
          </Badge>
        )}
      </div>
      <div className="text-xs text-gray-500 flex items-center">
        <ClockIcon className="h-3 w-3 mr-1" />
        {formatDate(createdAt)}
      </div>
    </div>
  );
};

export default AnimalStatusBadges;
