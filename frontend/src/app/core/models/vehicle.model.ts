export interface Vehicle {
  id: string;
  customerId: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: 'Sedan' | 'SUV' | 'Hatchback' | 'Van' | 'Coupe' | 'Truck' | 'Hybrid';
  mileageKm?: number;
  vin?: string;
  color?: string;
}

