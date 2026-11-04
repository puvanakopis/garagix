import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

interface PrivacySection {
  id: string;
  number: string;
  title: string;
  summary: string;
  clauses: {
    heading: string;
    text: string;
  }[];
}

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas text-gx-text-primary overflow-x-hidden min-h-screen">
      <!-- 1. Page Header -->
      <app-page-header
        title="PRIVACY POLICY"
        [breadcrumbs]="[{ label: 'Privacy Policy' }]"
        bgImage="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1600&auto=format&fit=crop&q=80"
      />

      <!-- 2. Overview & Quick Reference Bar -->
      <section class="bg-gx-surface py-14 sm:py-16 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="max-w-[840px]">
            <div>
              <span class="sub-tag-red">DATA PROTECTION &amp; PRIVACY POLICY</span>
            </div>
            <h2 class="bootlab-section-title">
              Garagix Customer Data &amp; <span class="text-gx-primary">Privacy Policy</span>
            </h2>
            <p class="text-sm sm:text-base text-gx-text-secondary mt-4 leading-relaxed">
              At Garagix Precision Auto Care, we prioritize the protection and confidentiality of your personal details, vehicle telemetry data, and repair history. This Privacy Policy details how we collect, safeguard, and utilize customer information across our physical workshop facilities and digital web platforms.
            </p>
            <div class="flex items-center gap-6 mt-6 text-xs text-gx-text-muted flex-wrap">
              <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Effective Date: November 2026</span>
              <span class="flex items-center gap-1.5"><app-icon name="shield" [size]="12" strokeColor="#d70006" /> 256-Bit SSL End-to-End Encryption</span>
              <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Compliant with Sri Lanka PDPA &amp; Global Standards</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Main Privacy Grid (Sidebar Navigation + Active Clause Only) -->
      <section class="bg-gx-canvas py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <!-- Mobile / Tablet Horizontal Tab Navigation -->
          <div class="lg:hidden mb-8">
            <div class="text-xs font-bold text-gx-primary uppercase tracking-widest font-oxanium mb-3">
              SELECT PRIVACY SECTION
            </div>
            <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              @for (sec of privacySections; track sec.id) {
                <button
                  type="button"
                  (click)="selectSection(sec.id)"
                  class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer border"
                  [ngClass]="selectedSectionId() === sec.id ? 'bg-[#d70006] text-white border-[#d70006] shadow-[0_0_12px_rgba(215,0,6,0.4)]' : 'bg-gx-card text-neutral-400 border-[#262626] hover:text-white'"
                >
                  {{ sec.number }}. {{ sec.title }}
                </button>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-start">
            <!-- Sticky Quick Navigation Sidebar -->
            <aside class="hidden lg:block sticky top-28 bg-gx-card border border-[#262626] p-6 space-y-2">
              <div class="text-xs font-bold text-gx-primary uppercase tracking-widest font-oxanium mb-4 flex items-center justify-between">
                <span>PRIVACY NAVIGATION</span>
                <span class="text-[10px] text-neutral-400 font-sans font-normal">{{ activeSectionIndex() + 1 }} of {{ privacySections.length }}</span>
              </div>
              @for (sec of privacySections; track sec.id) {
                <button
                  type="button"
                  (click)="selectSection(sec.id)"
                  class="w-full flex items-center justify-between p-3 text-xs font-semibold text-left transition-all duration-200 cursor-pointer border-l-2"
                  [ngClass]="selectedSectionId() === sec.id ? 'bg-[#141314] text-white border-[#d70006] font-bold shadow-inner' : 'text-neutral-400 hover:text-white hover:bg-[#100f0f] border-transparent'"
                >
                  <span class="truncate pr-2">{{ sec.number }}. {{ sec.title }}</span>
                  <app-icon name="chevron-right" [size]="14" [strokeColor]="selectedSectionId() === sec.id ? '#d70006' : '#737373'" />
                </button>
              }
              <div class="pt-4 border-t border-[#222222] mt-4">
                <a
                  routerLink="/contact"
                  class="flex items-center gap-2 text-xs font-bold text-gx-primary hover:text-white transition-colors"
                >
                  <app-icon name="phone" [size]="12" strokeColor="#d70006" />
                  <span>Contact Data Protection Officer</span>
                </a>
              </div>
            </aside>

            <!-- Detailed Active Section Content Column (Single Section View) -->
            <div id="privacy-active-content" class="scroll-mt-28">
              @if (activeSection(); as sec) {
                <article class="bg-gx-card border border-gx-border p-6 sm:p-10 transition-all duration-300">
                  <div class="flex items-center justify-between gap-4 mb-3">
                    <div class="flex items-center gap-3">
                      <span class="font-oxanium text-xs font-bold text-gx-primary tracking-widest uppercase">SECTION {{ sec.number }}</span>
                      <span class="w-8 h-[1px] bg-[#333333]"></span>
                    </div>
                    <span class="text-xs text-gx-text-muted font-display uppercase tracking-wider">Module {{ sec.number }} / 06</span>
                  </div>

                  <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                    {{ sec.title }}
                  </h3>
                  <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed mb-8 pb-6 border-b border-[#222222]">
                    {{ sec.summary }}
                  </p>

                  <div class="space-y-6">
                    @for (clause of sec.clauses; track clause.heading) {
                      <div class="bg-[#0e0d0d] border border-[#222222] p-5 sm:p-6 hover:border-[#383838] transition-colors">
                        <h4 class="font-display text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                          <span class="w-2 h-2 bg-gx-primary rounded-full shrink-0"></span>
                          <span>{{ clause.heading }}</span>
                        </h4>
                        <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                          {{ clause.text }}
                        </p>
                      </div>
                    }
                  </div>

                  <!-- Previous / Next Section Pagination Switcher -->
                  <div class="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-[#222222] flex-wrap">
                    @if (prevSection(); as prev) {
                      <button
                        type="button"
                        (click)="selectSection(prev.id)"
                        class="flex items-center gap-2 text-xs font-bold text-neutral-300 hover:text-gx-primary transition-colors cursor-pointer py-2 px-3 border border-[#262626] bg-[#0e0d0d] hover:border-gx-primary"
                      >
                        <app-icon name="chevron-left" [size]="14" />
                        <span>Previous: {{ prev.number }}. {{ prev.title }}</span>
                      </button>
                    } @else {
                      <div></div>
                    }

                    @if (nextSection(); as next) {
                      <button
                        type="button"
                        (click)="selectSection(next.id)"
                        class="flex items-center gap-2 text-xs font-bold text-white hover:text-white transition-colors cursor-pointer py-2 px-4 bg-[#d70006] hover:bg-white hover:!text-black font-oxanium tracking-wider uppercase ml-auto"
                      >
                        <span>Next: {{ next.number }}. {{ next.title }}</span>
                        <app-icon name="chevron-right" [size]="14" />
                      </button>
                    }
                  </div>
                </article>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Data Protection Officer & Privacy Inquiries Banner -->
      <section class="bg-gx-surface py-16 sm:py-20 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="bg-gx-card border border-[#292929] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div class="relative z-10 max-w-[700px]">
              <div>
                <span class="sub-tag-red">DATA GOVERNANCE &amp; INQUIRIES</span>
              </div>
              <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Questions Regarding Your Stored Diagnostic or Account Data?
              </h3>
              <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed mb-4">
                You retain complete control over your technical repair logs and contact profile. Contact our Data Protection Officer for data access requests, vehicle telemetry purges, or privacy inquiries.
              </p>
              <div class="flex items-center gap-4 text-xs text-gx-text-muted flex-wrap">
                <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Zero Third-Party Data Selling</span>
                <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Instant Telemetry Access on Demand</span>
                <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Encrypted Cloud Service Records</span>
              </div>
            </div>

            <div class="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <a
                routerLink="/contact"
                class="bootlab-btn-primary px-8 py-4 text-xs flex items-center gap-2 group"
              >
                <app-icon name="mail" [size]="14" />
                <span>CONTACT PRIVACY DESK</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class PrivacyComponent {
  selectedSectionId = signal<string>('information-we-collect');

  privacySections: PrivacySection[] = [
    {
      id: 'information-we-collect',
      number: '01',
      title: 'Information We Collect',
      summary: 'Categories of personal, vehicle technical, and telemetry information captured during workshop intake and digital booking.',
      clauses: [
        {
          heading: 'Vehicle Technical & Telemetry Data',
          text: 'During mechanical intake and computerized diagnostics, we collect technical identifiers including the Vehicle Identification Number (VIN), engine code, odometer reading, ECU diagnostic trouble codes (DTCs), freeze-frame sensor data, and wheel alignment measurements.'
        },
        {
          heading: 'Customer Identity & Contact Information',
          text: 'We collect your full name, telephone number, verified email address, billing/residential address, and national identity credentials when you book an appointment, submit an intake form, or register a portal account.'
        },
        {
          heading: 'Digital Interaction & Session Logs',
          text: 'When accessing the Garagix web platform or customer portal, our secure servers log IP addresses, browser types, device fingerprints, and access timestamps to ensure account security and prevent fraudulent appointment bookings.'
        }
      ]
    },
    {
      id: 'how-we-use-data',
      number: '02',
      title: 'How We Utilize Your Data',
      summary: 'Legitimate business purposes including precision repairs, live garage bay tracking, and warranty validation.',
      clauses: [
        {
          heading: 'Execution of Mechanical Services & OEM Parts Sourcing',
          text: 'Vehicle VIN and technical specifications are utilized solely to cross-reference factory service manuals, identify certified OEM replacement components, and ensure accurate torque calibrations tailored to your exact car make and model.'
        },
        {
          heading: 'Live Repair Progress Notifications',
          text: 'We utilize your contact telephone number and email to transmit automated SMS or WhatsApp notifications regarding garage bay intake, diagnostic estimate completions, parts arrival, and final collection readiness.'
        },
        {
          heading: 'Warranty Administration & Preventive Alerts',
          text: 'Historical repair records and component serial numbers are preserved to honor our 12-Month / 20,000 KM warranty and to send you preventive service reminders for critical fluid flushes or tire rotations.'
        }
      ]
    },
    {
      id: 'telemetry-rights',
      number: '03',
      title: 'Vehicle Diagnostic Telemetry & Non-Disclosure',
      summary: 'Our strict policy governing automotive electronic records, OBD-II scan data, and aftermarket confidentiality.',
      clauses: [
        {
          heading: 'Strict Commercial Non-Disclosure',
          text: 'Garagix enforces an absolute policy against selling, leasing, or monetizing your vehicle diagnostic logs, telemetry scans, or driving history to insurance brokers, automotive advertisers, or data aggregators.'
        },
        {
          heading: 'Customer Ownership of Diagnostic Records',
          text: 'You maintain full ownership of all electronic scan reports produced in our diagnostic bays. Upon request, itemized PDF copies of all pre- and post-repair OBD-II scan results will be delivered to your portal dashboard or email.'
        }
      ]
    },
    {
      id: 'data-security',
      number: '04',
      title: 'Data Security & Workshop Infrastructure',
      summary: 'Physical security safeguards, encryption standards, and restricted access protocols.',
      clauses: [
        {
          heading: '256-Bit SSL/TLS Digital Encryption',
          text: 'All electronic transmissions between your browser and our booking infrastructure are protected via 256-bit SSL encryption. Data at rest is encrypted utilizing AES-256 protocols on secured cloud servers.'
        },
        {
          heading: 'Role-Based Technician Access Controls',
          text: 'Workshop mechanics have access only to vehicle technical specifications, diagnostic fault logs, and service work orders required to perform repairs. Technicians cannot access payment records, billing histories, or personal identity documents.'
        },
        {
          heading: '24/7 Facility CCTV Surveillance',
          text: 'All Garagix garage bays, vehicle storage areas, and customer lounges are monitored by 24/7 CCTV surveillance to protect customer vehicles. Video footage is maintained on a rolling 30-day security loop and accessible solely for security verification.'
        }
      ]
    },
    {
      id: 'third-party-sharing',
      number: '05',
      title: 'Third-Party Disclosures & Partners',
      summary: 'Authorized OEM suppliers, PCI-DSS payment gateways, and statutory regulatory compliance.',
      clauses: [
        {
          heading: 'Authorized OEM Parts Distribution Networks',
          text: 'We share only your vehicle VIN and model code with factory-authorized parts distributors (e.g. Bosch, Brembo, Toyota, Mercedes-Benz, BMW OEM distribution channels) solely to confirm component part fitment.'
        },
        {
          heading: 'PCI-DSS Compliant Payment Gateways',
          text: 'Online repair deposit transactions and digital card payments are processed directly through certified PCI-DSS Level 1 compliant financial gateways. Garagix never stores or retains raw credit/debit card numbers on local workshop computers.'
        },
        {
          heading: 'Legal Compliance & Road Safety Authorities',
          text: 'We may disclose vehicle repair or ownership records if strictly required by valid subpoena, court order, or official investigation by Sri Lanka Police or National Road Safety regulatory bodies.'
        }
      ]
    },
    {
      id: 'your-privacy-rights',
      number: '06',
      title: 'Your Privacy Rights & Data Control',
      summary: 'Access requests, data rectification, account deletion, and direct Data Protection Officer communication.',
      clauses: [
        {
          heading: 'Right to Access & Rectification',
          text: 'You have the right to inspect, download, and update your personal contact details, registered vehicles, and historical service invoices at any time through your Garagix Customer Portal account.'
        },
        {
          heading: 'Account Deletion & Data Purge Policy',
          text: 'You may request full erasure of your customer profile and digital account by submitting a written request to privacy@garagix.com. Note that statutory tax invoices and warranty records must be retained for legal auditing periods mandated by law.'
        },
        {
          heading: 'Direct Contact with Data Protection Officer (DPO)',
          text: 'For any privacy concerns, data rights disputes, or policy inquiries, you may contact our dedicated Data Protection Officer at dpo@garagix.com or write to: Data Governance Desk, Garagix Engineering Hub, No. 45/A, Nawala Road, Nugegoda, Sri Lanka.'
        }
      ]
    }
  ];

  activeSection = computed(() => {
    const id = this.selectedSectionId();
    return this.privacySections.find(s => s.id === id) || this.privacySections[0];
  });

  activeSectionIndex = computed(() => {
    const id = this.selectedSectionId();
    const idx = this.privacySections.findIndex(s => s.id === id);
    return idx >= 0 ? idx : 0;
  });

  prevSection = computed(() => {
    const idx = this.activeSectionIndex();
    return idx > 0 ? this.privacySections[idx - 1] : null;
  });

  nextSection = computed(() => {
    const idx = this.activeSectionIndex();
    return idx < this.privacySections.length - 1 ? this.privacySections[idx + 1] : null;
  });

  selectSection(id: string) {
    this.selectedSectionId.set(id);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('privacy-active-content');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}

