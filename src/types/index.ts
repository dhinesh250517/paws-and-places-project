
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
  uploadedBy: string;
  createdAt: Date;
}

// Team Member type for About page
export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
}
