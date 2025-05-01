
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Animal } from '@/types';

interface VerifyAdoptionDialogProps {
  isOpen: boolean;
  animal: Animal | null;
  onClose: () => void;
  onConfirm: (name: string, email: string, contact: string) => void;
}

export const VerifyAdoptionDialog: React.FC<VerifyAdoptionDialogProps> = ({
  isOpen,
  animal,
  onClose,
  onConfirm
}) => {
  const [adopterInfo, setAdopterInfo] = useState({
    name: '',
    email: '',
    contact: '',
  });

  useEffect(() => {
    if (animal) {
      setAdopterInfo({
        name: animal.adopterName || '',
        email: animal.adopterEmail || '',
        contact: animal.adopterContact || '',
      });
    }
  }, [animal]);

  const handleConfirm = () => {
    onConfirm(adopterInfo.name, adopterInfo.email, adopterInfo.contact);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Adoption</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="adopterName">Adopter Name</Label>
            <Input 
              id="adopterName" 
              value={adopterInfo.name} 
              onChange={(e) => setAdopterInfo({...adopterInfo, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adopterEmail">Adopter Email</Label>
            <Input 
              id="adopterEmail" 
              type="email" 
              value={adopterInfo.email} 
              onChange={(e) => setAdopterInfo({...adopterInfo, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adopterContact">Adopter Contact</Label>
            <Input 
              id="adopterContact" 
              value={adopterInfo.contact} 
              onChange={(e) => setAdopterInfo({...adopterInfo, contact: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-green-500 hover:bg-green-600">
            Confirm Adoption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
