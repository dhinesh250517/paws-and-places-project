
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  DogIcon, 
  CatIcon, 
  MapPinIcon, 
  ImageIcon, 
  QrCodeIcon, 
  AlertCircleIcon, 
  UserIcon, 
  MailIcon, 
  PhoneIcon,
  AlertTriangleIcon 
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const AddAnimalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'dog',
    count: 1,
    healthCondition: '',
    address: '',
    mapLink: '',
    photo: null as File | null,
    qrCode: null as File | null,
    uploaderName: '',
    uploaderEmail: '',
    uploaderContact: '',
    isEmergency: false,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleEmergencyChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isEmergency: checked
    }));
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFormData(prev => ({
      ...prev,
      qrCode: file
    }));
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrCodePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('animals')
      .upload(filePath, file);
      
    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('animals')
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  const sendEmergencyNotification = async (animalInfo: {
    type: string;
    count: number;
    address: string;
    healthCondition: string;
    uploaderName: string;
    uploaderContact?: string;
  }) => {
    try {
      // In a real application, this would call an SMS API service
      // For demonstration, we'll just log the notification message
      console.log(`EMERGENCY NOTIFICATION to +91 9150231058: 
        ${animalInfo.count} ${animalInfo.type}(s) needs urgent help at ${animalInfo.address}. 
        Condition: ${animalInfo.healthCondition}. 
        Contact: ${animalInfo.uploaderName} ${animalInfo.uploaderContact || 'no phone provided'}`);
      
      // Simulate successful notification
      toast.success("Emergency notification sent to responder");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send emergency notification");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.healthCondition.trim()) {
      toast.error("Please describe the health condition");
      return;
    }
    
    if (!formData.address.trim() || !formData.mapLink.trim()) {
      toast.error("Please provide location information");
      return;
    }
    
    if (!formData.qrCode) {
      toast.error("Please upload a GPay QR code for donations");
      return;
    }
    
    if (!formData.uploaderName.trim()) {
      toast.error("Please provide your name");
      return;
    }
    
    if (!formData.uploaderEmail.trim()) {
      toast.error("Please provide your email");
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload QR code
      const qrCodeUrl = await uploadFile(formData.qrCode, 'qr-codes');
      
      // Upload photo if provided
      let photoUrl = null;
      if (formData.photo) {
        photoUrl = await uploadFile(formData.photo, 'photos');
      }
      
      // Save animal data to Supabase
      const { data, error } = await supabase
        .from('animals')
        .insert({
          type: formData.type,
          count: formData.count,
          health_condition: formData.healthCondition,
          address: formData.address,
          map_url: formData.mapLink,
          photo_url: photoUrl,
          qr_code_url: qrCodeUrl,
          uploader_name: formData.uploaderName,
          uploader_email: formData.uploaderEmail,
          uploader_contact: formData.uploaderContact || null,
          is_emergency: formData.isEmergency,
        });
      
      if (error) {
        throw new Error(`Error saving animal data: ${error.message}`);
      }

      // Send emergency notification if needed
      if (formData.isEmergency) {
        await sendEmergencyNotification({
          type: formData.type,
          count: formData.count,
          address: formData.address,
          healthCondition: formData.healthCondition,
          uploaderName: formData.uploaderName,
          uploaderContact: formData.uploaderContact,
        });
      }
      
      toast.success("Animal information submitted successfully!");
      navigate('/home');
    } catch (error) {
      console.error('Error submitting animal data:', error);
      toast.error(`Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="paws-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Report a Stray Animal</h1>
          <p className="text-gray-600">Help a stray by sharing its location and condition. This allows others to provide food, care, or adoption.</p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Animal Information</CardTitle>
              <CardDescription>
                Provide details about the stray animal you've spotted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Animal Type */}
              <div className="space-y-2">
                <Label>Animal Type</Label>
                <RadioGroup 
                  value={formData.type} 
                  onValueChange={handleTypeChange} 
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dog" id="dog" />
                    <Label htmlFor="dog" className="flex items-center">
                      <DogIcon className="h-5 w-5 mr-2 text-pawsOrange" />
                      Dog
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cat" id="cat" />
                    <Label htmlFor="cat" className="flex items-center">
                      <CatIcon className="h-5 w-5 mr-2 text-pawsBlue" />
                      Cat
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Animal Count */}
              <div className="space-y-2">
                <Label htmlFor="count">How many?</Label>
                <Input
                  id="count"
                  name="count"
                  type="number"
                  min="1"
                  value={formData.count}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Emergency Option */}
              <div className="border border-red-200 bg-red-50 rounded-md p-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isEmergency" 
                    checked={formData.isEmergency}
                    onCheckedChange={handleEmergencyChange}
                  />
                  <div className="flex items-center gap-2">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                    <Label htmlFor="isEmergency" className="font-medium text-red-700">
                      This is an emergency - animal needs immediate help
                    </Label>
                  </div>
                </div>
                {formData.isEmergency && (
                  <p className="text-xs text-red-600 mt-2">
                    An SMS notification will be sent to emergency responders when you submit this report.
                  </p>
                )}
              </div>
              
              {/* Health Condition */}
              <div className="space-y-2">
                <Label htmlFor="healthCondition">
                  <div className="flex items-center">
                    Health Condition
                    <AlertCircleIcon className="ml-1 h-4 w-4 text-muted-foreground" />
                  </div>
                </Label>
                <Textarea
                  id="healthCondition"
                  name="healthCondition"
                  placeholder="Describe the animal's health, age, behavior, and any injuries or special needs..."
                  rows={3}
                  value={formData.healthCondition}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPinIcon className="mr-2 h-5 w-5 text-pawsOrange" />
                  <Label className="text-lg font-medium">Location Information</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address or Description</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="e.g., Behind City Park, near the playground"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapLink">Google Maps Link</Label>
                  <Input
                    id="mapLink"
                    name="mapLink"
                    placeholder="Paste a Google Maps link to the exact location"
                    value={formData.mapLink}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tip: Open Google Maps, drop a pin at the location, tap "Share", and copy the link.
                  </p>
                </div>
              </div>

              {/* Uploader Information */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-pawsBlue" />
                  <Label className="text-lg font-medium">Your Information</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploaderName">Your Name</Label>
                  <Input
                    id="uploaderName"
                    name="uploaderName"
                    placeholder="Your full name"
                    value={formData.uploaderName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploaderEmail">Your Email</Label>
                  <Input
                    id="uploaderEmail"
                    name="uploaderEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.uploaderEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploaderContact">Your Contact Number (Optional)</Label>
                  <Input
                    id="uploaderContact"
                    name="uploaderContact"
                    placeholder="Your phone number"
                    value={formData.uploaderContact}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {/* No need for photo upload since we're using AI-generated images */}
              
              {/* Upload GPay QR */}
              <div className="space-y-2">
                <Label htmlFor="qrCode" className="flex items-center">
                  <QrCodeIcon className="mr-2 h-5 w-5" />
                  Upload GPay QR Code
                </Label>
                <Input
                  id="qrCode"
                  type="file"
                  accept="image/*"
                  onChange={handleQrCodeChange}
                  className="cursor-pointer"
                  required
                />
                {qrCodePreview && (
                  <div className="mt-2 relative w-40 h-40">
                    <img
                      src={qrCodePreview}
                      alt="QR code preview"
                      className="object-contain w-full h-full rounded-md border"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Your GPay QR code will be used so others can donate to help with food and care costs.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/home')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-pawsOrange hover:bg-pawsOrange-600"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddAnimalPage;
