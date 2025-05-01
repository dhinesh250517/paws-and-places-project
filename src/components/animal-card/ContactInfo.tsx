
import React from 'react';
import { UserIcon, MailIcon, PhoneIcon, CalendarIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-react';

interface ContactInfoProps {
  isAdopted: boolean;
  isPendingAdoption: boolean;
  uploaderName: string;
  uploaderEmail: string;
  uploaderContact?: string;
  adopterName?: string;
  adopterEmail?: string;
  adopterContact?: string;
  adoptedAt?: Date;
  formatDate: (date: Date) => string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  isAdopted,
  isPendingAdoption,
  uploaderName,
  uploaderEmail,
  uploaderContact,
  adopterName,
  adopterEmail,
  adopterContact,
  adoptedAt,
  formatDate
}) => {
  if (isAdopted) {
    return (
      <div className="bg-green-50 p-3 rounded-md border border-green-100">
        <div className="text-sm font-medium mb-2 flex items-center text-green-600">
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          Adoption Information:
        </div>
        <div className="text-sm text-gray-600">
          <p className="flex items-center mb-1">
            <UserIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {adopterName}
          </p>
          <p className="flex items-center mb-1">
            <MailIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {adopterEmail}
          </p>
          {adopterContact && (
            <p className="flex items-center">
              <PhoneIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              {adopterContact}
            </p>
          )}
          <p className="flex items-center mt-1 text-green-600 font-medium">
            <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
            Adopted on {formatDate(adoptedAt || new Date())}
          </p>
        </div>
      </div>
    );
  } 
  
  if (isPendingAdoption) {
    return (
      <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
        <div className="text-sm font-medium mb-2 flex items-center text-amber-700">
          <AlertTriangleIcon className="h-4 w-4 mr-1" />
          Pending Approval:
        </div>
        <div className="text-sm text-gray-600">
          <p className="flex items-center mb-1">
            <UserIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {adopterName}
          </p>
          <p className="flex items-center mb-1">
            <MailIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {adopterEmail}
          </p>
          {adopterContact && (
            <p className="flex items-center">
              <PhoneIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              {adopterContact}
            </p>
          )}
          <p className="flex items-center mt-1 text-amber-700 font-medium">
            <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
            Waiting for owner approval
          </p>
        </div>
      </div>
    );
  }
  
  return (
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
  );
};

export default ContactInfo;
