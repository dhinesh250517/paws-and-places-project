
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import { AlertTriangleIcon, MapPinIcon, CalendarIcon, QrCode } from 'lucide-react';
import { Animal } from '../types';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

type AnimalCardProps = {
  animal: Animal;
};

const AnimalCard = ({ animal }: AnimalCardProps) => {
  const navigate = useNavigate();
  const [isAdoptDialogOpen, setIsAdoptDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [adopterName, setAdopterName] = useState('');
  const [adopterEmail, setAdopterEmail] = useState('');
  const [adopterContact, setAdopterContact] = useState('');
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleAdoptRequest = async () => {
    if (!adopterName || !adopterEmail) {
      toast.error('Please provide your name and email');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('animals')
        .update({
          adopter_name: adopterName,
          adopter_email: adopterEmail,
          adopter_contact: adopterContact || null,
          // Note: is_adopted is NOT set to true here, as it requires owner verification
        })
        .eq('id', animal.id);
        
      if (error) throw error;
      
      toast.success('Your adoption request has been submitted and is pending approval');
      setIsAdoptDialogOpen(false);
      navigate('/home');
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      toast.error('Failed to submit adoption request');
    }
  };
  
  return (
    <Card className="overflow-hidden">
      {animal.photo ? (
        <div className="relative h-48 bg-gray-100">
          <img 
            src={animal.photo} 
            alt={`${animal.type === 'dog' ? 'Dog' : 'Cat'} in need of help`}
            className="w-full h-full object-cover"
          />
          {animal.isEmergency && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangleIcon className="h-3 w-3" /> Emergency
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <img 
            src={animal.type === 'dog' ? '/ai-dog-image.jpg' : '/ai-cat-image.jpg'} 
            alt={`${animal.type === 'dog' ? 'Dog' : 'Cat'} placeholder`}
            className="w-full h-full object-cover"
          />
          {animal.isEmergency && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangleIcon className="h-3 w-3" /> Emergency
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{animal.count} {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'}{animal.count > 1 ? 's' : ''}</h3>
            
            {animal.isAdopted ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Adopted
              </Badge>
            ) : animal.adopterName ? (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Pending Approval
              </Badge>
            ) : null}
          </div>

          <p className="text-sm text-gray-500 mt-1">
            <CalendarIcon className="inline-block h-3 w-3 mr-1" />
            {formatDate(animal.createdAt)}
          </p>
        </div>
        
        <p className="text-sm mb-3">{animal.healthCondition}</p>
        
        <div className="flex items-start space-x-1 text-sm text-gray-500">
          <MapPinIcon className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{animal.location.address}</span>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => window.open(animal.location.mapUrl, '_blank')}
        >
          View Map
        </Button>
        
        <Button
          className="flex-1"
          variant={animal.isAdopted || animal.adopterName ? "outline" : "default"}
          onClick={() => setIsQrDialogOpen(true)}
        >
          Donate
        </Button>
        
        {!animal.isAdopted && !animal.adopterName && (
          <Button
            className="flex-1 bg-green-500 hover:bg-green-600"
            onClick={() => setIsAdoptDialogOpen(true)}
          >
            Adopt
          </Button>
        )}
      </CardFooter>
      
      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Support with GPay</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center">
            {animal.qrCodeUrl && (
              <div className="w-64 h-64">
                <img 
                  src={animal.qrCodeUrl} 
                  alt="GPay QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <p className="text-sm text-center text-muted-foreground mt-3">
              Scan this QR code with your GPay app to donate
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Adopt Dialog */}
      <Dialog open={isAdoptDialogOpen} onOpenChange={setIsAdoptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request to Adopt</DialogTitle>
            <DialogDescription>
              Fill in your details to request adoption. The owner will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                value={adopterName} 
                onChange={(e) => setAdopterName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Your Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={adopterEmail} 
                onChange={(e) => setAdopterEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Your Contact Number (Optional)</Label>
              <Input 
                id="contact"
                value={adopterContact} 
                onChange={(e) => setAdopterContact(e.target.value)}
                placeholder="Your phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdoptDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdoptRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AnimalCard;
