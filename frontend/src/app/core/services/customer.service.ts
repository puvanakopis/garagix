import { Injectable, signal } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private initialVehicles: Vehicle[] = [
    {
      id: 'veh-1',
      customerId: 'cust-101',
      plateNumber: 'WP CAD-4821',
      brand: 'Toyota',
      model: 'Prius Hybrid (ZVW50)',
      year: 2018,
      type: 'Hybrid',
      mileageKm: 64200,
      vin: 'JTDKN36U901847123',
      color: 'Pearl White'
    },
    {
      id: 'veh-2',
      customerId: 'cust-101',
      plateNumber: 'WP CAJ-9102',
      brand: 'Honda',
      model: 'Vezel RS Turbo',
      year: 2019,
      type: 'SUV',
      mileageKm: 48900,
      vin: 'RU1-1309841',
      color: 'Cosmic Blue'
    }
  ];

  private _vehicles = signal<Vehicle[]>(this.initialVehicles);
  vehicles = this._vehicles.asReadonly();

  // All registered customers list for admin
  private initialCustomers: User[] = [
    {
      id: 'cust-101',
      name: 'Kasun Mendis',
      email: 'kasun.mendis@example.lk',
      phone: '+94 77 123 4567',
      address: 'No. 42/B, Flower Road, Colombo 07',
      role: 'customer',
      createdAt: '2024-03-01T00:00:00Z',
      totalBookings: 3,
      status: 'active'
    },
    {
      id: 'cust-102',
      name: 'Malini De Silva',
      email: 'malini.desilva@gmail.com',
      phone: '+94 71 456 7890',
      address: 'No. 18, Queen\'s Road, Colombo 03',
      role: 'customer',
      createdAt: '2023-07-15T00:00:00Z',
      totalBookings: 5,
      status: 'active'
    },
    {
      id: 'cust-103',
      name: 'Dhanushka Wickrama',
      email: 'dhanushka.w@yahoo.com',
      phone: '+94 76 778 8990',
      address: 'No. 102/3, Havelock Road, Colombo 05',
      role: 'customer',
      createdAt: '2024-01-10T00:00:00Z',
      totalBookings: 2,
      status: 'active'
    },
    {
      id: 'cust-104',
      name: 'Ajantha Fernando',
      email: 'ajantha.f@gmail.com',
      phone: '+94 77 334 4556',
      address: 'No. 55, Galle Road, Mount Lavinia',
      role: 'customer',
      createdAt: '2024-05-20T00:00:00Z',
      totalBookings: 1,
      status: 'active'
    },
    {
      id: 'cust-105',
      name: 'Ruvini Jayasekara',
      email: 'ruvini.j@outlook.com',
      phone: '+94 71 223 3445',
      address: 'No. 89, Kandy Road, Kadawatha',
      role: 'customer',
      createdAt: '2023-08-05T00:00:00Z',
      totalBookings: 4,
      status: 'active'
    }
  ];

  private _customers = signal<User[]>(this.initialCustomers);
  customers = this._customers.asReadonly();

  getCustomerVehicles(customerId: string): Vehicle[] {
    return this._vehicles().filter(v => v.customerId === customerId);
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const newVeh: Vehicle = {
      ...vehicle,
      id: 'veh-' + (this._vehicles().length + 1)
    };
    this._vehicles.update(curr => [...curr, newVeh]);
    return newVeh;
  }

  removeVehicle(id: string): void {
    this._vehicles.update(curr => curr.filter(v => v.id !== id));
  }

  toggleCustomerStatus(id: string): void {
    this._customers.update(curr =>
      curr.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c)
    );
  }

  updateCustomer(id: string, updated: Partial<User>): void {
    this._customers.update(curr =>
      curr.map(c => c.id === id ? { ...c, ...updated } : c)
    );
  }
}

