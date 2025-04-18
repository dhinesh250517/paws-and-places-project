import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Animal, DbAnimal } from '../types';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon, TrashIcon, AlertTriangleIcon, BellIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const OwnerPage = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAdoptions, setPendingAdoptions] = useState<Animal[]>([]);
  const [oldEntries, setOldEntries] = useState<Animal[]>([]);
  const [adoptedEntries, setAdoptedEntries] = useState<Animal[]>([]);
  const [emergencyAnimals, setEmergencyAnimals] = useState<Animal[]>([]);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<string | null>(null);
  const [adopterInfo, setAdopterInfo] = useState({
    name: '',
    email: '',
    contact: '',
  });

  useEffect(() => {
    const isOwner = localStorage.getItem('ownerLoggedIn');
    if (!isOwner) {
      toast.error('Unauthorized access');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('ownerLoggedIn', 'true');
    return () => {
      // We would handle logout cleanup here
    };
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const { data: dbAnimals, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching animals:', error);
        toast.error('Failed to load animals');
        return;
      }
      
      const mappedAnimals = (dbAnimals as DbAnimal[]).map(animal => ({
        id: animal.id,
        type: animal.type as 'dog' | 'cat',
        count: animal.count,
        healthCondition: animal.health_condition,
        location: {
          address: animal.address,
          mapUrl: animal.map_url,
        },
        qrCodeUrl: animal.qr_code_url,
        photo: animal.photo_url || undefined,
        uploaderName: animal.uploader_name,
        uploaderEmail: animal.uploader_email,
        uploaderContact: animal.uploader_contact || undefined,
        createdAt: new Date(animal.created_at),
        isEmergency: animal.is_emergency,
        isAdopted: animal.is_adopted || false,
        adopterName: animal.adopter_name || undefined,
        adopterEmail: animal.adopter_email || undefined,
        adopterContact: animal.adopter_contact || undefined,
        adoptedAt: animal.adopted_at ? new Date(animal.adopted_at) : undefined,
      }));
      
      setAnimals(mappedAnimals);
      
      const pending = mappedAnimals.filter(
        animal => animal.adopterName && !animal.isAdopted
      );
      setPendingAdoptions(pending);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const old = mappedAnimals.filter(
        animal => !animal.isAdopted && animal.createdAt < thirtyDaysAgo
      );
      setOldEntries(old);
      
      const adopted = mappedAnimals.filter(animal => animal.isAdopted);
      setAdoptedEntries(adopted);
      
      const emergency = mappedAnimals.filter(animal => animal.isEmergency);
      const newEmergencies = emergency.filter(
        em => !emergencyAnimals.some(existing => existing.id === em.id)
      );
      
      setEmergencyAnimals(emergency);
      
      if (newEmergencies.length > 0) {
        setShowEmergencyAlert(true);
        newEmergencies.forEach(animal => {
          toast.error(
            `Emergency: ${animal.count} ${animal.type}(s) at ${animal.location.address}`, 
            { duration: 8000 }
          );
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching animals:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnimals();
    
    const channel = supabase
      .channel('animal-changes')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'animals' }, 
        () => {
          fetchAnimals();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleVerifyAdoption = (animal: Animal) => {
    setCurrentAnimal(animal);
    setAdopterInfo({
      name: animal.adopterName || '',
      email: animal.adopterEmail || '',
      contact: animal.adopterContact || '',
    });
    setVerifyDialogOpen(true);
  };
  
  const confirmAdoption = async () => {
    if (!currentAnimal) return;
    
    try {
      const { error } = await supabase.functions.invoke('update-adoption-status', {
        body: { 
          id: currentAnimal.id,
          isAdopted: true,
          adopterName: adopterInfo.name,
          adopterEmail: adopterInfo.email,
          adopterContact: adopterInfo.contact
        }
      });
      
      if (error) {
        console.error('Error updating adoption status:', error);
        toast.error('Failed to update adoption status');
        return;
      }
      
      toast.success('Adoption verified successfully!');
      
      setAnimals(prev => prev.map(animal => {
        if (animal.id === currentAnimal.id) {
          return {
            ...animal,
            isAdopted: true,
            adopterName: adopterInfo.name,
            adopterEmail: adopterInfo.email,
            adopterContact: adopterInfo.contact,
            adoptedAt: new Date()
          };
        }
        return animal;
      }));
      
      setPendingAdoptions(prev => prev.filter(a => a.id !== currentAnimal.id));
      setAdoptedEntries(prev => [...prev, {
        ...currentAnimal,
        isAdopted: true,
        adopterName: adopterInfo.name,
        adopterEmail: adopterInfo.email,
        adopterContact: adopterInfo.contact,
        adoptedAt: new Date()
      }]);
      
      setVerifyDialogOpen(false);
    } catch (error) {
      console.error('Error in adoption verification:', error);
      toast.error('Failed to verify adoption');
    }
  };
  
  const handleDeleteAnimal = (animalId: string) => {
    setAnimalToDelete(animalId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteAnimal = async () => {
    if (!animalToDelete) return;
    try {
      // Permanently delete the animal from the database
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', animalToDelete);
      
      if (error) {
        console.error('Error deleting animal:', error);
        toast.error('Failed to delete animal: ' + error.message);
        return;
      }
      
      toast.success('Animal deleted successfully!');
      
      // Close the dialog and reset the state
      setDeleteDialogOpen(false);
      setAnimalToDelete(null);
      
      // Update local state to reflect the deletion
      setAnimals(prev => prev.filter(a => a.id !== animalToDelete));
      setPendingAdoptions(prev => prev.filter(a => a.id !== animalToDelete));
      setOldEntries(prev => prev.filter(a => a.id !== animalToDelete));
      setAdoptedEntries(prev => prev.filter(a => a.id !== animalToDelete));
      setEmergencyAnimals(prev => prev.filter(a => a.id !== animalToDelete));
    } catch (error) {
      console.error('Error in deletion:', error);
      toast.error('Failed to delete animal');
    }
  };
  
  const rejectAdoption = async (animalId: string) => {
    try {
      const { error } = await supabase.functions.invoke('update-adoption-status', {
        body: { 
          animalId: animalId,
          isAdopted: false,
          adopterName: null,
          adopterEmail: null,
          adopterContact: null,
          adoptedAt: null
        }
      });
      
      if (error) {
        console.error('Error updating adoption status:', error);
        toast.error('Failed to reject adoption');
        return;
      }
      
      toast.success('Adoption rejected successfully!');
      
      setAnimals(prev => prev.map(animal => {
        if (animal.id === animalId) {
          return {
            ...animal,
            isAdopted: false,
            adopterName: undefined,
            adopterEmail: undefined,
            adopterContact: undefined,
            adoptedAt: undefined
          };
        }
        return animal;
      }));
      
      setPendingAdoptions(prev => prev.filter(a => a.id !== animalId));
    } catch (error) {
      console.error('Error in adoption rejection:', error);
      toast.error('Failed to reject adoption');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('ownerLoggedIn');
    toast.info('Owner logged out');
    navigate('/');
  };
  
  const dismissEmergencyAlert = () => {
    setShowEmergencyAlert(false);
  };
  
  return (
    <Layout>
      <div className="paws-container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Owner Admin Panel</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        {showEmergencyAlert && emergencyAnimals.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangleIcon className="h-5 w-5" />
            <AlertTitle className="flex items-center gap-2">
              <BellIcon className="h-4 w-4" /> Emergency Animals Reported!
            </AlertTitle>
            <AlertDescription>
              <p>There are {emergencyAnimals.length} emergency cases that need attention:</p>
              <ul className="mt-2 list-disc pl-5">
                {emergencyAnimals.slice(0, 3).map(animal => (
                  <li key={animal.id} className="mt-1">
                    {animal.count} {animal.type}(s) at {animal.location.address} - 
                    <span className="font-medium"> {animal.healthCondition}</span>
                  </li>
                ))}
                {emergencyAnimals.length > 3 && (
                  <li className="mt-1">...and {emergencyAnimals.length - 3} more</li>
                )}
              </ul>
              <div className="mt-3">
                <Button size="sm" onClick={dismissEmergencyAlert} variant="outline">
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-16">Loading...</div>
        ) : (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Pending Adoptions</h2>
              {pendingAdoptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Adopter</TableHead>
                      <TableHead>Uploader</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAdoptions.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell>
                          {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                        </TableCell>
                        <TableCell>{animal.location.address}</TableCell>
                        <TableCell>
                          {animal.adopterName}<br/>
                          <span className="text-sm text-gray-500">{animal.adopterEmail}</span>
                        </TableCell>
                        <TableCell>
                          {animal.uploaderName}<br/>
                          <span className="text-sm text-gray-500">{animal.uploaderEmail}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleVerifyAdoption(animal)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" /> Verify
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => rejectAdoption(animal.id)}
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No pending adoptions</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Entries Older Than 30 Days</h2>
              {oldEntries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Uploader</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {oldEntries.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell>
                          {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                        </TableCell>
                        <TableCell>{animal.location.address}</TableCell>
                        <TableCell>
                          {animal.createdAt.toLocaleDateString()}
                          <br />
                          <Badge variant="outline">
                            {Math.floor((new Date().getTime() - animal.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days ago
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {animal.uploaderName}<br/>
                          <span className="text-sm text-gray-500">{animal.uploaderEmail}</span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteAnimal(animal.id)}
                          >
                            <TrashIcon className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No entries older than 30 days</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Adopted Animals</h2>
              {adoptedEntries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Adopter</TableHead>
                      <TableHead>Adopted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adoptedEntries.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell>
                          {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                        </TableCell>
                        <TableCell>{animal.location.address}</TableCell>
                        <TableCell>
                          {animal.adopterName}<br/>
                          <span className="text-sm text-gray-500">{animal.adopterEmail}</span>
                        </TableCell>
                        <TableCell>
                          {animal.adoptedAt?.toLocaleDateString() || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteAnimal(animal.id)}
                          >
                            <TrashIcon className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No adopted animals</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                Emergency Animals
              </h2>
              {emergencyAnimals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Health Condition</TableHead>
                      <TableHead>Uploader</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emergencyAnimals.map((animal) => (
                      <TableRow key={animal.id} className="bg-red-50">
                        <TableCell>
                          {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                        </TableCell>
                        <TableCell>{animal.location.address}</TableCell>
                        <TableCell className="font-medium text-red-600">
                          {animal.healthCondition}
                        </TableCell>
                        <TableCell>
                          {animal.uploaderName}<br/>
                          <span className="text-sm text-gray-500">{animal.uploaderContact || animal.uploaderEmail}</span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteAnimal(animal.id)}
                          >
                            <TrashIcon className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No emergency animals</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">All Animals</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {animals.map((animal) => (
                    <TableRow key={animal.id} className={animal.isEmergency ? "bg-red-50" : ""}>
                      <TableCell>
                        {animal.type === 'dog' ? '🐶 Dog' : '🐱 Cat'} ({animal.count})
                      </TableCell>
                      <TableCell>{animal.location.address}</TableCell>
                      <TableCell>
                        {animal.isAdopted ? (
                          <Badge className="bg-green-500">Adopted</Badge>
                        ) : animal.adopterName ? (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            Pending Verification
                          </Badge>
                        ) : animal.isEmergency ? (
                          <Badge variant="destructive">Emergency</Badge>
                        ) : (
                          <Badge variant="outline">Available</Badge>
                        )}
                      </TableCell>
                      <TableCell>{animal.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteAnimal(animal.id)}
                        >
                          <TrashIcon className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
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
              <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAdoption} className="bg-green-500 hover:bg-green-600">
                Confirm Adoption
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this animal entry? This action cannot be undone and the entry will be permanently removed from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteAnimal} 
                className="bg-red-500 hover:bg-red-600"
              >
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default OwnerPage;
