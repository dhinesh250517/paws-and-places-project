
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSignIcon } from 'lucide-react';

interface DonateDialogProps {
  qrCodeUrl: string;
  uploaderName: string;
  uploaderEmail: string;
  uploaderContact?: string;
}

const DonateDialog: React.FC<DonateDialogProps> = ({ qrCodeUrl, uploaderName, uploaderEmail, uploaderContact }) => {
  return (
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
  );
};

export default DonateDialog;
