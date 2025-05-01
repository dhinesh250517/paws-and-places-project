
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const AdoptionFormSchema = z.object({
  adopterName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  adopterEmail: z.string().email({
    message: "Please enter a valid email.",
  }),
  adopterContact: z.string().optional(),
});

interface AdoptionFormProps {
  animalId: string;
  type: string;
  onSuccess: () => void;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ animalId, type, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof AdoptionFormSchema>>({
    resolver: zodResolver(AdoptionFormSchema),
    defaultValues: {
      adopterName: "",
      adopterEmail: "",
      adopterContact: "",
    },
  });
  
  const onSubmitAdoption = async (values: z.infer<typeof AdoptionFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Set isAdopted to FALSE - this creates a pending request
      const { data, error } = await supabase.functions.invoke("update-adoption-status", {
        body: {
          id: animalId,
          isAdopted: false, // Creates a pending request that requires owner approval
          adopterName: values.adopterName,
          adopterEmail: values.adopterEmail,
          adopterContact: values.adopterContact,
        },
      });
      
      if (error) throw error;
      
      toast.success("Adoption request submitted! Waiting for owner approval.");
      onSuccess();
      
      // Refresh the page to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      toast.error("Failed to submit adoption request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAdoption)} className="space-y-4">
        <FormField
          control={form.control}
          name="adopterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="adopterEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="adopterContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AdoptionForm;
