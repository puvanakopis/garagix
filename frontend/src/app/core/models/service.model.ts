export type ServiceCategory =
  | 'Maintenance'
  | 'Diagnostics'
  | 'Engine & Transmission'
  | 'Brakes & Tires'
  | 'Electrical & Battery'
  | 'AC & Climate'
  | 'Body & Detailing';

export interface CarService {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  startingPriceLkr: number;
  durationMinutes: number;
  featured?: boolean;
  isActive: boolean;
  includedItems: string[];
  commonSymptoms: string[];
  recommendedMechanicIds?: string[];
}

