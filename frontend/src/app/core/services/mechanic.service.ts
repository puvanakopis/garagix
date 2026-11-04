import { Injectable, signal } from '@angular/core';
import { Mechanic } from '../models/mechanic.model';

@Injectable({
  providedIn: 'root'
})
export class MechanicService {
  private initialMechanics: Mechanic[] = [
    {
      id: 'mech-1',
      name: 'Rohan Jayawardena',
      title: 'Tire & Suspension Master',
      specialization: 'High-Performance Wheel & Chassis Dynamics',
      experienceYears: 12,
      rating: 4.9,
      reviewCount: 178,
      bio: 'Specialist in 3D laser alignment, computerized dynamic balancing, and racing tire compound fitments. Over 12 years of workshop excellence.',
      imageUrl: '/images/team/mechanic-1.png',
      status: 'available',
      assignedBookingsCount: 3,
      certifications: ['Hunter 3D Alignment Master', 'Michelin Certified Specialist'],
      workingHours: '8:00 AM - 5:30 PM (Mon - Sat)'
    },
    {
      id: 'mech-2',
      name: 'Kasun Perera',
      title: 'Chief Diagnostics Engineer',
      specialization: 'ECU Programming & Oscilloscope Scans',
      experienceYears: 14,
      rating: 5.0,
      reviewCount: 230,
      bio: 'Leading electrical diagnostics authority in Sri Lanka. Expert in CAN-bus communication, Bosch computerized scanning, and hybrid inverter diagnostics.',
      imageUrl: '/images/team/mechanic-2.png',
      status: 'available',
      assignedBookingsCount: 4,
      certifications: ['Bosch Master Diagnostic Tech', 'Toyota T-TEN Master', 'ASE L1 Certified'],
      workingHours: '8:00 AM - 6:00 PM (Mon - Sat)'
    },
    {
      id: 'mech-3',
      name: 'Marcus Cole',
      title: 'Brake & Transmission Tech',
      specialization: 'Dual-Clutch Transmissions & Ceramic Brakes',
      experienceYears: 11,
      rating: 4.8,
      reviewCount: 142,
      bio: 'Master technician specialized in DSG, ZF 8-speed, and CVT gearboxes alongside high-performance Brembo brake system overhauls.',
      imageUrl: '/images/team/mechanic-3.png',
      status: 'busy',
      assignedBookingsCount: 5,
      certifications: ['ZF ProTech Certified', 'Brembo Brake Specialist'],
      workingHours: '8:30 AM - 6:00 PM (Mon - Sat)'
    },
    {
      id: 'mech-4',
      name: 'Devon Brooks',
      title: 'Powertrain & Turbo Specialist',
      specialization: 'Forced Induction & Fuel Injection Systems',
      experienceYears: 9,
      rating: 4.9,
      reviewCount: 115,
      bio: 'Passionate performance mechanic focusing on turbocharger maintenance, high-pressure common rail diesel, and direct injection carbon cleaning.',
      imageUrl: '/images/team/mechanic-4.png',
      status: 'available',
      assignedBookingsCount: 2,
      certifications: ['Garrett Turbo Authorized Tech', 'Denso Fuel Injection Master'],
      workingHours: '8:00 AM - 5:00 PM (Mon - Sat)'
    },
    {
      id: 'mech-5',
      name: 'Nuwan Fernando',
      title: 'Body & Chassis Specialist',
      specialization: 'Chassis Alignment & High-End Body Craft',
      experienceYears: 15,
      rating: 4.9,
      reviewCount: 198,
      bio: 'Master of structural collision repair, computer laser chassis pullers, and mirror-finish paint restoration. Certified across luxury Euro brands.',
      imageUrl: '/images/team/mechanic-5.png',
      status: 'available',
      assignedBookingsCount: 3,
      certifications: ['I-CAR Platinum Body Specialist', 'PPG Master Painter'],
      workingHours: '9:00 AM - 6:30 PM (Mon - Sat)'
    },
    {
      id: 'mech-6',
      name: 'Robert Kowalski',
      title: 'Engine Overhaul Master',
      specialization: 'Complete Engine Rebuilds & Block Machining',
      experienceYears: 16,
      rating: 5.0,
      reviewCount: 260,
      bio: 'Over 16 years rebuilding V6, V8, and hybrid internal combustion engines. Micro-tolerance crankshaft balancing and valve train machining.',
      imageUrl: '/images/team/mechanic-6.png',
      status: 'available',
      assignedBookingsCount: 3,
      certifications: ['ASE Master Engine Machinist', 'BMW Master Certified'],
      workingHours: '8:00 AM - 6:00 PM (Mon - Sat)'
    }
  ];

  private mechanicsSignal = signal<Mechanic[]>(this.loadMechanics());

  readonly mechanics = this.mechanicsSignal.asReadonly();

  private loadMechanics(): Mechanic[] {
    const version = 'v5_no_technician_contact';
    const savedVersion = localStorage.getItem('garagix_mechanics_version');
    if (savedVersion !== version) {
      localStorage.setItem('garagix_mechanics_version', version);
      localStorage.setItem('garagix_mechanics', JSON.stringify(this.initialMechanics));
      return this.initialMechanics;
    }
    const saved = localStorage.getItem('garagix_mechanics');
    if (saved) {
      try {
        const parsed: Mechanic[] = JSON.parse(saved);
        return parsed.map(m => {
          let img = m.imageUrl || '/images/team/mechanic-1.png';
          if (img.startsWith('/images/team/mechanic-') && img.endsWith('.jpg')) {
            img = img.replace(/\.jpg$/, '.png');
          }
          return { ...m, imageUrl: img };
        });
      } catch {
        return this.initialMechanics;
      }
    }
    return this.initialMechanics;
  }

  private saveMechanics(data: Mechanic[]) {
    this.mechanicsSignal.set(data);
    localStorage.setItem('garagix_mechanics', JSON.stringify(data));
  }

  getMechanicById(id: string): Mechanic | undefined {
    return this.mechanics().find(m => m.id === id);
  }

  addMechanic(mechanic: Omit<Mechanic, 'id' | 'assignedBookingsCount'>): Mechanic {
    const newMechanic: Mechanic = {
      ...mechanic,
      id: `mech-${Date.now()}`,
      assignedBookingsCount: 0
    };
    const updated = [...this.mechanics(), newMechanic];
    this.saveMechanics(updated);
    return newMechanic;
  }

  updateMechanic(id: string, updates: Partial<Mechanic>): boolean {
    const current = this.mechanics();
    const index = current.findIndex(m => m.id === id);
    if (index === -1) return false;

    const updated = [...current];
    updated[index] = { ...updated[index], ...updates };
    this.saveMechanics(updated);
    return true;
  }

  deleteMechanic(id: string): boolean {
    const current = this.mechanics();
    const filtered = current.filter(m => m.id !== id);
    if (filtered.length === current.length) return false;
    this.saveMechanics(filtered);
    return true;
  }

  getFeaturedMechanics(limit: number = 3): Mechanic[] {
    return this.mechanics().slice(0, limit);
  }

  getAvailableMechanics(): Mechanic[] {
    return this.mechanics().filter(m => m.status === 'available');
  }

  incrementBookingCount(id: string): void {
    const mech = this.getMechanicById(id);
    if (mech) {
      this.updateMechanic(id, { assignedBookingsCount: mech.assignedBookingsCount + 1 });
    }
  }

  decrementBookingCount(id: string): void {
    const mech = this.getMechanicById(id);
    if (mech && mech.assignedBookingsCount > 0) {
      this.updateMechanic(id, { assignedBookingsCount: mech.assignedBookingsCount - 1 });
    }
  }
}
