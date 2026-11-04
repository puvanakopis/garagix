import { Injectable, signal } from '@angular/core';
import { CarService, ServiceCategory } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceCatalogService {
  private initialServices: CarService[] = [
    {
      id: 'srv-1',
      name: 'General Car Maintenance',
      slug: 'general-car-maintenance',
      category: 'Maintenance',
      shortDescription: 'Complete 40-point preventive maintenance inspection and fluid top-up service.',
      fullDescription: 'Our comprehensive General Car Maintenance package keeps your car running at peak performance. It encompasses multi-point mechanical inspections, engine fluid condition assessments, belt checks, filter cleaning, and tire pressure adjustments designed for tropical Sri Lankan driving conditions.',
      startingPriceLkr: 18500,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&auto=format&fit=crop&q=80',
      featured: true,
      isActive: true,
      includedItems: [
        '40-Point safety & mechanical inspection',
        'Top-up of steering, brake, and washer fluids',
        'Air and cabin filter inspection/cleaning',
        'Spark plug & ignition system inspection',
        'Battery load and terminal check',
        'Underbody & suspension inspection'
      ],
      commonSymptoms: [
        'Approaching scheduled service interval (5,000 / 10,000 km)',
        'Sluggish acceleration or decreased fuel efficiency',
        'Subtle rattling sounds over uneven road surfaces',
        'Planning long-distance travel across provinces'
      ],
      faqs: [
        {
          question: 'How often should general maintenance be carried out?',
          answer: 'We recommend scheduled maintenance every 5,000 km or 6 months, whichever comes first, especially in Sri Lanka due to stop-and-go traffic and tropical humidity.'
        },
        {
          question: 'Will genuine OEM parts be used if replacements are required?',
          answer: 'Yes, we only source certified OEM or high-grade aftermarket components with full warranty backing.'
        }
      ],
      recommendedMechanicIds: ['mech-1', 'mech-2']
    },
    {
      id: 'srv-2',
      name: 'Engine Repair & Overhaul',
      slug: 'engine-repair-and-overhaul',
      category: 'Engine & Transmission',
      shortDescription: 'Advanced engine diagnostics, cylinder head servicing, and timing component repairs.',
      fullDescription: 'From mysterious engine knock and timing chain replacements to full cylinder rebuilds, our certified engine specialists employ computerized bore-scopes, compression testers, and factory repair procedures to restore factory horsepower and reliability.',
      startingPriceLkr: 48000,
      durationMinutes: 360,
      imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
      featured: true,
      isActive: true,
      includedItems: [
        'Computerized diagnostic scan and live sensor analysis',
        'Cylinder compression and leak-down test',
        'Timing belt / timing chain alignment check',
        'Gasket, seal, and oil leak remediation',
        'Fuel injector cleaning & calibration',
        'Post-repair dynamometer road testing'
      ],
      commonSymptoms: [
        'Check Engine light illuminated or flashing',
        'Excessive white, blue, or black exhaust smoke',
        'Metallic knocking or ticking engine noise',
        'Loss of power during highway acceleration or uphill climbs',
        'Engine overheating or frequent coolant loss'
      ],
      faqs: [
        {
          question: 'What warranties do you provide on engine rebuilds?',
          answer: 'We provide a comprehensive 12-month or 20,000 km workshop warranty on all internal engine repairs.'
        }
      ],
      recommendedMechanicIds: ['mech-1']
    },
    {
      id: 'srv-3',
      name: 'Brake Repair & System Tuning',
      slug: 'brake-repair-and-tuning',
      category: 'Brakes & Tires',
      shortDescription: 'High-performance ceramic brake pad replacement, disc rotor skimming, and ABS bleed.',
      fullDescription: 'Your safety is non-negotiable. Our technicians inspect and service hydraulic lines, calibrate ABS actuators, skim or replace warped disc rotors, and install dust-free ceramic brake pads for decisive stopping distance.',
      startingPriceLkr: 14500,
      durationMinutes: 90,
      imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=800&auto=format&fit=crop&q=80',
      featured: true,
      isActive: true,
      includedItems: [
        'Front & rear brake pad thickness measurement',
        'Brake caliper slide pin lubrication',
        'Disc rotor micrometer runout check & skimming',
        'DOT 4 / DOT 5.1 high-temp fluid bleed',
        'Emergency handbrake cable adjustment'
      ],
      commonSymptoms: [
        'High-pitched squealing or grinding when braking',
        'Brake pedal feels soft or sinks to the floor',
        'Vibration felt through steering wheel while stopping',
        'Vehicle pulls noticeably to one side under braking'
      ],
      faqs: [
        {
          question: 'Do you skim disc rotors on the car or on a bench lathe?',
          answer: 'We use precision Pro-Cut on-car computerized rotor matching to eliminate microscopic runout and brake pedal judder.'
        }
      ],
      recommendedMechanicIds: ['mech-3']
    },
    {
      id: 'srv-4',
      name: 'Premium Oil Change & Lube Service',
      slug: 'premium-oil-change-lube',
      category: 'Maintenance',
      shortDescription: 'Full synthetic oil replacement with OEM filter and chassis lubrication.',
      fullDescription: 'Keep your engine lubricated and protected from high thermal breakdown. Includes draining old oil, installing genuine OEM oil filter, pouring premium full-synthetic API-SP motor oil, and lubricating door hinges and chassis linkages.',
      startingPriceLkr: 12500,
      durationMinutes: 45,
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80',
      featured: false,
      isActive: true,
      includedItems: [
        'Up to 4 liters of premium full synthetic 0W-20 / 5W-30 engine oil',
        'Genuine OEM oil filter & new drain plug crush washer',
        'Reset of vehicle oil maintenance reminder',
        'Complementary under-hood dust wash & fluid check'
      ],
      commonSymptoms: [
        'Engine oil change indicator light on dashboard',
        'Dark, grimy oil on dipstick inspection',
        'Engine runs louder with increased valve chatter'
      ],
      faqs: [
        {
          question: 'What oil brands do you stock?',
          answer: 'We officially stock Mobil 1, Motul, Castrol Edge, and Toyota Genuine Motor Oils.'
        }
      ],
      recommendedMechanicIds: ['mech-2']
    },
    {
      id: 'srv-5',
      name: 'Auto AC Repair & Climate Control',
      slug: 'auto-ac-repair-climate-control',
      category: 'AC & Climate',
      shortDescription: 'Evaporator leak detection, compressor testing, R134a/R1234yf gas recharge.',
      fullDescription: 'In our tropical climate, an ice-cold air conditioning system is an essential comfort. We vacuum-test for refrigerant leaks, flush clogged condenser lines, replace antibacterial cabin filters, and service compressors.',
      startingPriceLkr: 16500,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
      featured: true,
      isActive: true,
      includedItems: [
        'Electronic halogen refrigerant leak detection',
        'AC system vacuum pressure test',
        'Compressor clutch & coil electrical check',
        'R134a / R1234yf precision gas recharge with PAG oil',
        'Cabin antimicrobial ozone decontamination'
      ],
      commonSymptoms: [
        'AC blowing warm or ambient air only',
        'Unpleasant moldy odor through AC vents',
        'Hissing noise when AC button is pressed',
        'Water pooling on front passenger floorboard'
      ],
      faqs: [
        {
          question: 'How long does an AC gas recharge take?',
          answer: 'A standard recovery, vacuum leak test, and recharge takes approximately 45 to 60 minutes.'
        }
      ],
      recommendedMechanicIds: ['mech-6']
    },
    {
      id: 'srv-6',
      name: 'Tire Replacement & Wheel Balancing',
      slug: 'tire-replacement-and-wheel-balancing',
      category: 'Brakes & Tires',
      shortDescription: 'Laser wheel balancing, brand-new tire fitting, and road force optimization.',
      fullDescription: 'Equip your vehicle with superior wet-grip tires from Michelin, Continental, or Bridgestone. Every installation includes high-precision dynamic wheel balancing and new rubber valve stems.',
      startingPriceLkr: 22000,
      durationMinutes: 60,
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      featured: false,
      isActive: true,
      includedItems: [
        'Tire demounting and computerized bead mounting',
        'Laser dynamic wheel balancing on Corghi machine',
        'Replacement of tire air valve cores',
        'Nitrogen tire inflation for stable tire pressure',
        'Tire tread depth and irregular wear inspection'
      ],
      commonSymptoms: [
        'Steering vibration at 70 - 100 km/h highway speeds',
        'Tread depth worn below legal limit (1.6mm)',
        'Cracking, sidewall bulging, or puncture damage'
      ],
      faqs: [
        {
          question: 'Do you offer tire rotation with balancing?',
          answer: 'Yes, a 4-wheel rotation is included free of charge with full-set balancing.'
        }
      ],
      recommendedMechanicIds: ['mech-4']
    },
    {
      id: 'srv-7',
      name: 'Battery & Hybrid System Check',
      slug: 'battery-and-hybrid-system-check',
      category: 'Electrical & Battery',
      shortDescription: 'High-voltage hybrid battery cell balancing, inverter cooling, 12V test.',
      fullDescription: 'Specialized diagnostic service for Toyota Prius, Axio, Honda Vezel, and modern EV/Hybrid platforms. We conduct cell internal resistance logging, hybrid cooling fan cleaning, and auxiliary 12V AGM battery health testing.',
      startingPriceLkr: 19500,
      durationMinutes: 90,
      imageUrl: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?w=800&auto=format&fit=crop&q=80',
      featured: true,
      isActive: true,
      includedItems: [
        'Hybrid battery cell voltage differential scan',
        'High voltage inverter coolant inspection',
        'Hybrid blower motor & cooling duct decontamination',
        '12V battery Cold Cranking Amps (CCA) load test',
        'Alternator/DC-DC converter charging voltage test'
      ],
      commonSymptoms: [
        'Check Hybrid System warning on instrument cluster',
        'Hybrid battery indicator drops rapidly and charges quickly',
        'Engine running continuously without switching to EV mode',
        'Car fails to start after parked overnight'
      ],
      faqs: [
        {
          question: 'Can you recondition individual weak hybrid battery cells?',
          answer: 'Yes, our laboratory is equipped with precision computerized cell balancers to recondition or replace degraded cell modules.'
        }
      ],
      recommendedMechanicIds: ['mech-5']
    },
    {
      id: 'srv-8',
      name: '3D Wheel Alignment & Suspension Tuning',
      slug: '3d-wheel-alignment-suspension',
      category: 'Brakes & Tires',
      shortDescription: 'Computerized 3D camera wheel alignment and shock absorber diagnostic.',
      fullDescription: 'Eliminate uneven tire wear and steering drift with our Corghi 3D camera alignment rack. We accurately calibrate camber, caster, and toe angles to exact manufacturer tolerances.',
      startingPriceLkr: 9500,
      durationMinutes: 60,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      featured: false,
      isActive: true,
      includedItems: [
        '4-Wheel 3D camera sensor calibration',
        'Toe-in / toe-out steering angle adjustment',
        'Camber & caster angles alignment',
        'Steering rack centering and tie-rod check',
        'Before and after printed angle telemetry report'
      ],
      commonSymptoms: [
        'Steering wheel off-center when driving straight',
        'Uneven inner or outer tire edge wear',
        'Car wandering or pulling left/right on flat expressway'
      ],
      faqs: [
        {
          question: 'How long does a 3D wheel alignment take?',
          answer: 'Typically 45 minutes on our automated alignment bay.'
        }
      ],
      recommendedMechanicIds: ['mech-4']
    },
    {
      id: 'srv-9',
      name: 'Comprehensive Pre-Purchase Inspection',
      slug: 'comprehensive-pre-purchase-inspection',
      category: 'Diagnostics',
      shortDescription: '120-point independent mechanical, chassis, paint gauge, and computer scan.',
      fullDescription: 'Buying a used car? Protect your investment. Our master technicians inspect for accidental structural damage, flood immersion, odometer tampering, engine compression, and paint thickness consistency.',
      startingPriceLkr: 25000,
      durationMinutes: 150,
      imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=80',
      featured: true,
      isActive: true,
      includedItems: [
        '120-Point bumper-to-bumper vehicle inspection',
        'Digital coating thickness gauge check for repaint/filler',
        'Full vehicle ECU scan for stored and pending error codes',
        'Undercarriage chassis frame inspection for accident welds',
        'Extensive road test under varying engine load and braking',
        'Formal 10-page printed condition audit with photo proof'
      ],
      commonSymptoms: [
        'Prospective buyer evaluating a private or dealership vehicle',
        'Vehicle warranty expiration check',
        'Selling your car and wishing to provide verified condition proof'
      ],
      faqs: [
        {
          question: 'Do I receive a written report on the same day?',
          answer: 'Yes, our digital PDF report with high-resolution photos is emailed to you within 2 hours of inspection.'
        }
      ],
      recommendedMechanicIds: ['mech-1', 'mech-2']
    }
  ];

  private _services = signal<CarService[]>(this.initialServices);
  services = this._services.asReadonly();

  categories = signal<ServiceCategory[]>([
    'Maintenance',
    'Diagnostics',
    'Engine & Transmission',
    'Brakes & Tires',
    'Electrical & Battery',
    'AC & Climate',
    'Body & Detailing'
  ]);

  getServices(): CarService[] {
    return this._services();
  }

  getServiceById(id: string): CarService | undefined {
    return this._services().find(s => s.id === id || s.slug === id);
  }

  addService(service: Omit<CarService, 'id'>): void {
    const newService: CarService = {
      ...service,
      id: 'srv-' + (this._services().length + 1)
    };
    this._services.update(current => [newService, ...current]);
  }

  updateService(id: string, updated: Partial<CarService>): void {
    this._services.update(current =>
      current.map(s => s.id === id ? { ...s, ...updated } : s)
    );
  }

  deleteService(id: string): void {
    this._services.update(current => current.filter(s => s.id !== id));
  }
}

