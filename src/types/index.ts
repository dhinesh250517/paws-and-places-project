// User type for authentication
export interface User {
  id: string;
  username: string;
  email: string;
}

// Animal Type representing a stray dog or cat
export interface Animal {
  id: string;
  type: 'dog' | 'cat';
  count: number;
  healthCondition: string;
  location: {
    address: string;
    mapUrl: string;
  };
  qrCodeUrl: string;
  photo?: string;
  uploaderName: string;
  uploaderEmail: string;
  uploaderContact?: string;
  createdAt: Date;
  isEmergency?: boolean;
  isAdopted?: boolean;
  adopterName?: string;
  adopterEmail?: string;
  adopterContact?: string;
  adoptedAt?: Date;
}

// Team Member type for About page
export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
}

// Database Animal type mapping to our Supabase schema
export interface DbAnimal {
  id: string;
  type: string;
  count: number;
  health_condition: string;
  address: string;
  map_url: string;
  photo_url: string | null;
  qr_code_url: string;
  uploader_name: string;
  uploader_email: string;
  uploader_contact: string | null;
  created_at: string;
  is_emergency: boolean;
  is_adopted: boolean;
  adopter_name: string | null;
  adopter_email: string | null;
  adopter_contact: string | null;
  adopted_at: string | null;
}
