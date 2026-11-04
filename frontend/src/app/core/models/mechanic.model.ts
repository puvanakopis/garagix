export interface Mechanic {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  bio: string;
  imageUrl: string;
  status: 'available' | 'busy' | 'on_leave';
  phone?: string;
  email?: string;
  assignedBookingsCount: number;
  certifications: string[];
  workingHours: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

