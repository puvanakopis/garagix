import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

interface TermSection {
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
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas text-gx-text-primary overflow-x-hidden min-h-screen">
      <!-- 1. Page Header -->
      <app-page-header
        title="TERMS OF SERVICE"
        [breadcrumbs]="[{ label: 'Terms of Service' }]"
        bgImage="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1600&auto=format&fit=crop&q=80"
      />

      <!-- 2. Overview & Quick Reference Bar -->
      <section class="bg-gx-surface py-14 sm:py-16 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="max-w-[840px]">
            <div>
              <span class="sub-tag-red">LEGAL AGREEMENT &amp; SERVICE POLICIES</span>
            </div>
            <h2 class="bootlab-section-title">
              Garagix Workshop Terms &amp; <span class="text-gx-primary">Conditions</span>
            </h2>
            <p class="text-sm sm:text-base text-gx-text-secondary mt-4 leading-relaxed">
              These Terms of Service govern all diagnostic testing, mechanical repairs, periodic maintenance, emergency recovery, parts procurement, and vehicle custody provided by Garagix Auto Care. By authorizing an intake work order or booking an appointment, you agree to the conditions detailed below.
            </p>
            <div class="flex items-center gap-6 mt-6 text-xs text-gx-text-muted flex-wrap">
              <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Effective Date: November 2026</span>
              <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Version 2.4 (Workshop &amp; Digital Tracking)</span>
              <span class="flex items-center gap-1.5"><app-icon name="shield" [size]="12" strokeColor="#d70006" /> Applicable Law: Sri Lanka Automotive &amp; Consumer Protection</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Main Terms Grid (Sidebar Navigation + Active Clause Only) -->
      <section class="bg-gx-canvas py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <!-- Mobile / Tablet Horizontal Tab Navigation -->
          <div class="lg:hidden mb-8">
            <div class="text-xs font-bold text-gx-primary uppercase tracking-widest font-oxanium mb-3">
              SELECT TERMS SECTION
            </div>
            <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              @for (sec of termSections; track sec.id) {
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
                <span>TERMS NAVIGATION</span>
                <span class="text-[10px] text-neutral-400 font-sans font-normal">{{ activeSectionIndex() + 1 }} of {{ termSections.length }}</span>
              </div>
              @for (sec of termSections; track sec.id) {
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
                  <span>Contact Legal &amp; Intake Team</span>
                </a>
              </div>
            </aside>

            <!-- Detailed Active Section Content Column (Single Section View) -->
            <div id="terms-active-content" class="scroll-mt-28">
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

      <!-- 4. Quality Standards & Legal Hotline Banner (Matching 24/7 Recovery Style) -->
      <section class="bg-gx-surface py-16 sm:py-20 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="bg-gx-card border border-[#292929] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div class="relative z-10 max-w-[700px]">
              <div>
                <span class="sub-tag-red">SERVICE QUESTIONS &amp; DISPUTE INTAKE</span>
              </div>
              <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Need Clarification on Repair Estimates or Warranty Terms?
              </h3>
              <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed mb-4">
                Our service advisors and intake coordinators are dedicated to complete transparency. If you have inquiries about estimate variations, OEM warranty processing, or invoice details, reach out to our customer care desk.
              </p>
              <div class="flex items-center gap-4 text-xs text-gx-text-muted flex-wrap">
                <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Written Itemized Estimates</span>
                <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Zero Unauthorized Work Guarantee</span>
                <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Transparent Diagnostic Disclosures</span>
              </div>
            </div>

            <div class="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <a
                routerLink="/contact"
                class="bootlab-btn-primary px-8 py-4 text-xs flex items-center gap-2 group"
              >
                <app-icon name="mail" [size]="14" />
                <span>CONTACT SERVICE ADVISORS</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class TermsComponent {
  selectedSectionId = signal<string>('authorization-estimates');

  termSections: TermSection[] = [
    {
      id: 'authorization-estimates',
      number: '01',
      title: 'Work Authorization & Diagnostic Estimates',
      summary: 'Protocols governing repair orders, computerized initial diagnostic fees, and scope change approvals.',
      clauses: [
        {
          heading: 'Binding Work Order Authorization',
          text: 'No mechanical teardown or repairs will commence without a signed physical or digital work authorization order. Digital authorizations transmitted through the Garagix Customer Portal or confirmed via verified email/SMS carry full legal validity.'
        },
        {
          heading: 'Diagnostic Surcharge & Tear-Down Disclosures',
          text: 'Initial diagnostic fees cover specialized scanning tools, sensor oscilloscope testing, and technician inspection time. If further engine or transmission disassembly is required to pinpoint hidden internal defects, a supplemental teardown quotation will be provided prior to disassembly.'
        },
        {
          heading: 'Supplemental Estimate Notification',
          text: 'If additional worn components or safety hazards are uncovered during repair that exceed the initial estimate by more than 10%, Garagix will halt the specific sub-assembly work and obtain customer approval before installing additional parts.'
        }
      ]
    },
    {
      id: 'parts-warranty',
      number: '02',
      title: 'Replacement Parts & Warranty Coverage',
      summary: 'Manufacturer standards, genuine OEM procurement, and our 12-month / 20,000 km warranty protection.',
      clauses: [
        {
          heading: 'Garagix 12-Month / 20,000 KM Warranty',
          text: 'All genuine OEM replacement parts and associated labor performed at Garagix are protected by a comprehensive 12-month or 20,000-kilometer warranty (whichever occurs first). Warranty claims require presentation of the original service invoice.'
        },
        {
          heading: 'Customer-Supplied Parts Disclaimer',
          text: 'Garagix strongly recommends genuine OEM or certified Tier-1 parts sourced directly through our authorized supply chain. If a customer provides their own parts, Garagix provides zero warranty on the component or any consequential engine damage resulting from part failure.'
        },
        {
          heading: 'Warranty Exclusions',
          text: 'Warranty coverage is voided if the vehicle is subjected to competitive track racing, commercial rideshare abuse, flood submersion, unauthorized aftermarket tuning, ECU flashing, or failure to perform recommended periodic fluid servicing.'
        }
      ]
    },
    {
      id: 'vehicle-custody',
      number: '03',
      title: 'Vehicle Custody, Road Testing & Facility Security',
      summary: 'Operation of customer vehicles for road calibration, workshop insurance, and interior protection.',
      clauses: [
        {
          heading: 'Road Testing Authorization',
          text: 'Customer grants Garagix certified technicians authorization to operate the vehicle on public highways, expressways, and chassis dynamometers solely for diagnosing faults, verifying post-repair calibration, and conducting safety road tests.'
        },
        {
          heading: 'Clean Workshop Protocol Guarantee',
          text: 'Technicians must apply steering wheel wraps, protective seat shields, and heavy-duty floor liners before driving or working within the vehicle cabin. Garagix guarantees the return of your vehicle in pristine condition.'
        },
        {
          heading: 'Valuables & Personal Belongings',
          text: 'While the Garagix engineering facility is monitored 24/7 by CCTV security, customers are required to remove all cash, electronics, jewelry, and loose personal valuables prior to handover. Garagix is not liable for loose items left inside vehicle compartments.'
        }
      ]
    },
    {
      id: 'payment-storage',
      number: '04',
      title: 'Payment Settlement, Lien Rights & Storage Fees',
      summary: 'Invoicing terms, accepted payment channels, storage fee policy, and statutory repair liens.',
      clauses: [
        {
          heading: 'Full Settlement on Vehicle Release',
          text: 'Vehicles will be released only upon full settlement of all outstanding repair invoices, parts charges, and applicable government taxes. Accepted payment methods include major credit/debit cards, bank wire transfers, and cash.'
        },
        {
          heading: 'Complimentary Grace Period & Storage Fees',
          text: 'Upon digital notification that vehicle repairs and quality control inspections are complete, customers have a complimentary 72-hour grace period for collection. Vehicles uncollected after 72 hours incur a daily secure garage storage fee of LKR 2,500.'
        },
        {
          heading: 'Mechanic’s Statutory Lien',
          text: 'Under Sri Lankan commercial and motor vehicle law, Garagix retains a possessory repair lien over any vehicle until all accrued service, part procurement, and storage charges have been paid in full.'
        }
      ]
    },
    {
      id: 'roadside-recovery',
      number: '05',
      title: '24/7 Roadside Assistance & Breakdown Intake',
      summary: 'Terms governing emergency towing dispatch, low-clearance flatbed transit, and emergency intake.',
      clauses: [
        {
          heading: 'Emergency Dispatch & Response Windows',
          text: 'Towing dispatch response times are subject to prevailing traffic, weather, and expressway conditions. Garagix strives for a 25-minute average arrival time within metropolitan Colombo.'
        },
        {
          heading: 'Damage-Free Hydraulic Transport',
          text: 'Our recovery fleet utilizes damage-free low-clearance hydraulic lift beds designed for prestige sedans, electric vehicles, and sports models. Vehicle owners or designated agents must declare pre-existing drivetrain damage or stuck transmission selectors prior to winch loading.'
        }
      ]
    },
    {
      id: 'digital-privacy',
      number: '06',
      title: 'Digital Portal, Repair Tracking & Privacy',
      summary: 'Electronic telemetry data, diagnostic scan logs, and customer account credentials.',
      clauses: [
        {
          heading: 'Vehicle Diagnostic Telemetry Data',
          text: 'OBD-II fault codes, freeze frame records, and module telemetry extracted during diagnostics are securely stored to maintain an accurate digital service history. This technical data is never sold to third-party marketers.'
        },
        {
          heading: 'Account Security & Live Bay Progress',
          text: 'Customers are responsible for maintaining the confidentiality of their Garagix portal passwords. Live repair progress timestamps and mechanic notes are provided for customer convenience and informational transparency.'
        }
      ]
    }
  ];

  activeSection = computed(() => {
    const id = this.selectedSectionId();
    return this.termSections.find(s => s.id === id) || this.termSections[0];
  });

  activeSectionIndex = computed(() => {
    const id = this.selectedSectionId();
    const idx = this.termSections.findIndex(s => s.id === id);
    return idx >= 0 ? idx : 0;
  });

  prevSection = computed(() => {
    const idx = this.activeSectionIndex();
    return idx > 0 ? this.termSections[idx - 1] : null;
  });

  nextSection = computed(() => {
    const idx = this.activeSectionIndex();
    return idx < this.termSections.length - 1 ? this.termSections[idx + 1] : null;
  });

  selectSection(id: string) {
    this.selectedSectionId.set(id);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('terms-active-content');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
