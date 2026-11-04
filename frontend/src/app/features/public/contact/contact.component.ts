import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas text-gx-text-primary overflow-x-hidden min-h-screen">
      <!-- 1. Page Header -->
      <app-page-header
        title="CONTACT US"
        [breadcrumbs]="[{ label: 'Contact Us' }]"
        bgImage="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1600&auto=format&fit=crop&q=80"
      />

      <!-- 2. Section 1: Direct Communication Channels (4 Pillar Cards) -->
      <section class="bg-gx-surface py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <!-- Section Title -->
          <div class="text-center mb-12 sm:mb-16">
            <div>
              <span class="sub-tag-red">COMMUNICATION CHANNELS</span>
            </div>
            <h2 class="bootlab-section-title text-center">
              Get Connected With Our <span class="text-gx-primary">Engineering Team</span>
            </h2>
            <p class="text-sm sm:text-base text-gx-text-secondary max-w-[680px] mx-auto mt-4 text-center leading-relaxed">
              Whether you need urgent 24/7 roadside breakdown intake, a periodic service estimate, or master technician advice, our team is standing by.
            </p>
          </div>

          <!-- 4 Contact Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Location Card -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between hover:border-gx-primary transition-all duration-300 hover:-translate-y-1.5 group">
              <div>
                <div class="w-12 h-12 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center text-gx-primary mb-6 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="map-pin" [size]="20" strokeColor="#d70006" />
                </div>
                <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mb-1 font-display">Hub Address</div>
                <h3 class="font-display text-xl font-bold text-white mb-2">Central Engineering Hub</h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  No. 45/A, Nawala Road, Nugegoda, Colombo, Sri Lanka
                </p>
              </div>
              <div class="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-gx-text-muted">
                <span>Nawala Flyover Junction</span>
                <span class="text-gx-primary font-bold">&#10003; Open Bay</span>
              </div>
            </div>

            <!-- Phone Card -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between hover:border-gx-primary transition-all duration-300 hover:-translate-y-1.5 group">
              <div>
                <div class="w-12 h-12 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center text-gx-primary mb-6 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <img
                    src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/6996a7e5b754cce799628515_Services%20Icon%20(1).png"
                    alt="Call Any Time"
                    class="w-[18px] h-6 object-contain"
                  />
                </div>
                <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mb-1 font-display">Direct Lines</div>
                <h3 class="font-display text-xl font-bold text-white mb-2">Telephone Inquiries</h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  General: <a href="tel:+94112345678" class="text-white hover:text-gx-primary transition-colors font-medium">(+94) 11 234 5678</a><br>
                  24/7 Hotline: <a href="tel:+94771234567" class="text-white hover:text-gx-primary transition-colors font-medium">(+94) 77 123 4567</a>
                </p>
              </div>
              <div class="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-gx-text-muted">
                <span>24/7 Breakdown</span>
                <span class="text-gx-primary font-bold">&#10003; Live Line</span>
              </div>
            </div>

            <!-- Email Card -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between hover:border-gx-primary transition-all duration-300 hover:-translate-y-1.5 group">
              <div>
                <div class="w-12 h-12 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center text-gx-primary mb-6 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="mail" [size]="20" strokeColor="#d70006" />
                </div>
                <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mb-1 font-display">Electronic Mail</div>
                <h3 class="font-display text-xl font-bold text-white mb-2">Email Correspondence</h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  garage&#64;garagix.com<br>
                  service&#64;garagix.lk
                </p>
              </div>
              <div class="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-gx-text-muted">
                <span>Average Response</span>
                <span class="text-gx-primary font-bold">&#60; 30 Mins</span>
              </div>
            </div>

            <!-- Hours Card -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between hover:border-gx-primary transition-all duration-300 hover:-translate-y-1.5 group">
              <div>
                <div class="w-12 h-12 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center text-gx-primary mb-6 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="clock" [size]="20" strokeColor="#d70006" />
                </div>
                <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mb-1 font-display">Workshop Hours</div>
                <h3 class="font-display text-xl font-bold text-white mb-2">Intake Schedule</h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  Mon - Sat: 8:00 AM - 7:00 PM<br>
                  Sun: Emergency Recovery Only
                </p>
              </div>
              <div class="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-gx-text-muted">
                <span>6 Operational Days</span>
                <span class="text-gx-primary font-bold">&#10003; Open Today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Section 2: Interactive Engineering Hub & Contact Form (Split 2-Column) -->
      <section class="bg-gx-canvas py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          <!-- Left: Dark High Tech World Map & Hub Facility Graphic -->
          <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div>
                <span class="sub-tag-red">CENTRAL ENGINEERING HUB</span>
              </div>
              <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Conveniently Located in Nawala</h3>
              <p class="text-xs sm:text-sm text-gx-text-secondary mb-6 leading-relaxed">
                5 minutes from the baseline highway link and Nugegoda junction. Equipped with 8 drive-in service bays and a climate-controlled customer lounge.
              </p>
            </div>

            <div class="relative w-full h-[260px] sm:h-[340px] bg-[#0c0c0d] border border-gx-border-subtle overflow-hidden my-4">
              <iframe
                src="https://maps.google.com/maps?q=Nawala+Road,+Nugegoda,+Colombo,+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                class="w-full h-full border-0"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Garagix Central Engineering Hub Location"
              ></iframe>

              <div class="absolute bottom-3 left-3 bg-black/85 border border-white/10 px-3 py-1.5 text-[0.6875rem] font-display text-white flex items-center gap-2 pointer-events-none z-10 backdrop-blur-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Direct GPS: 6.8864&deg; N, 79.8894&deg; E</span>
              </div>
            </div>

            <div class="space-y-2.5 pt-2">
              <div class="flex items-center gap-2.5 text-xs text-gx-text-secondary">
                <app-icon name="check" [size]="14" strokeColor="#d70006" />
                <span>Air-Conditioned Waiting Lounge With Glass Bay View</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gx-text-secondary">
                <app-icon name="check" [size]="14" strokeColor="#d70006" />
                <span>High-Speed Customer Optical Wi-Fi &amp; Ergonomic Work Desks</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gx-text-secondary">
                <app-icon name="check" [size]="14" strokeColor="#d70006" />
                <span>Complimentary Freshly Brewed Espresso &amp; Cold Drinks</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gx-text-secondary">
                <app-icon name="check" [size]="14" strokeColor="#d70006" />
                <span>Free On-Site Secure Parking Monitored by 24/7 CCTV</span>
              </div>
            </div>
          </div>

          <!-- Right: Interactive Contact Inquiry Form -->
          <div class="bg-gx-card border border-gx-border p-6 sm:p-10 flex flex-col justify-center">
            <div>
              <span class="sub-tag-red">GET IN TOUCH</span>
            </div>
            <h2 class="bootlab-section-title">
              Let's Discuss About <span class="text-gx-primary">Your Project</span>
            </h2>
            <p class="text-xs sm:text-sm text-gx-text-secondary mt-1 mb-4">
              Send your inquiry directly to our service advisors. We confirm parts availability and appointment slots within 30 minutes.
            </p>

            @if (submittedSuccess()) {
              <div class="bg-[#0f241d] border border-emerald-500/50 p-6 flex flex-col gap-3 mt-4">
                <div class="flex items-center gap-3 text-emerald-400 font-display font-bold text-lg">
                  <app-icon name="check-circle" [size]="24" strokeColor="#10b981" />
                  <span>Inquiry Dispatched Successfully!</span>
                </div>
                <p class="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                  Thank you. A service supervisor will contact you at <strong>{{ contactForm.get('phone')?.value }}</strong> within 30 minutes.
                </p>
                <button
                  type="button"
                  class="mt-2 px-5 py-2.5 border border-emerald-500/50 text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 w-fit cursor-pointer transition-colors"
                  (click)="resetForm()"
                >
                  Send Another Message
                </button>
              </div>
            } @else {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 sm:gap-5 mt-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      formControlName="firstName"
                      placeholder="First Name *"
                      class="w-full bg-[#0e0d0d] border border-[#292929] px-4 py-3.5 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors duration-200"
                      [class.border-red-500]="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      formControlName="lastName"
                      placeholder="Last Name *"
                      class="w-full bg-[#0e0d0d] border border-[#292929] px-4 py-3.5 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors duration-200"
                      [class.border-red-500]="contactForm.get('lastName')?.invalid && contactForm.get('lastName')?.touched"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="email"
                      formControlName="email"
                      placeholder="Email Address *"
                      class="w-full bg-[#0e0d0d] border border-[#292929] px-4 py-3.5 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors duration-200"
                      [class.border-red-500]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      formControlName="phone"
                      placeholder="Phone Number (+94) *"
                      class="w-full bg-[#0e0d0d] border border-[#292929] px-4 py-3.5 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors duration-200"
                      [class.border-red-500]="contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched"
                    />
                  </div>
                </div>

                <select
                  formControlName="serviceType"
                  class="w-full bg-[#0e0d0d] border border-[#292929] px-4 py-3.5 text-white text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors duration-200 cursor-pointer"
                >
                  <option value="" disabled selected>Select Service Needed...</option>
                  <option value="Engine Diagnostics & Overhaul">Engine Diagnostics &amp; Overhaul</option>
                  <option value="Transmission & Gearbox">Transmission &amp; Gearbox Repair</option>
                  <option value="Brake System & ABS">Brake System Tuning &amp; Ceramic Discs</option>
                  <option value="3D Laser Wheel Alignment">3D Laser Wheel Alignment</option>
                  <option value="Hybrid & EV Powertrain">Hybrid Battery Diagnostic &amp; Balancing</option>
                  <option value="Auto AC & Climate">Auto AC &amp; Climate Control</option>
                  <option value="Car Wash & Detailing">Car Wash &amp; Ceramic Paint Protection</option>
                  <option value="General Mechanical Inspection">General Mechanical Inspection</option>
                </select>

                <textarea
                  formControlName="message"
                  rows="4"
                  placeholder="Tell us about your vehicle model, year, and the required service..."
                  class="w-full bg-[#0e0d0d] border border-[#292929] p-4 text-white placeholder-gx-text-muted text-sm font-sans resize-y focus:outline-none focus:border-gx-primary transition-colors duration-200"
                ></textarea>

                <button
                  type="submit"
                  [disabled]="contactForm.invalid || isSubmitting()"
                  class="bootlab-btn-primary w-full py-4 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{{ isSubmitting() ? 'TRANSMITTING...' : 'SEND MESSAGE' }}</span>
                </button>
              </form>
            }
          </div>
        </div>
      </section>

      <!-- 4. Section 3: 24/7 Roadside Assistance & Breakdown Intake Banner -->
      <section class="bg-gx-surface py-16 sm:py-20 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="bg-gx-card border border-[#292929] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div class="relative z-10 max-w-[700px]">
              <div>
                <span class="sub-tag-red">24/7 EMERGENCY RECOVERY</span>
              </div>
              <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Stranded On The Road? Immediate Breakdown Dispatch Available
              </h3>
              <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed mb-4">
                Our heavy-duty hydraulic flatbed recovery trucks operate 24 hours a day across Colombo and Southern/Central Expressway links. Specialized in low-clearance sports cars, hybrid battery failures, and mechanical breakdowns.
              </p>
              <div class="flex items-center gap-4 text-xs text-gx-text-muted flex-wrap">
                <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Average 25-Min Metropolitan Arrival</span>
                <span class="flex items-center gap-1.5"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Damage-Free Hydraulic Lift Bed</span>
              </div>
            </div>

            <div class="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <a
                href="tel:+94771234567"
                class="bootlab-btn-primary px-8 py-4 text-xs flex items-center gap-2 group"
              >
                <span class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                <span>CALL 24/7 HOTLINE: (+94) 77 123 4567</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  isSubmitting = signal<boolean>(false);
  submittedSuccess = signal<boolean>(false);

  contactForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
    serviceType: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submittedSuccess.set(true);
      this.toastService.show('Inquiry received! We will contact you within 30 minutes.', 'success');
    }, 700);
  }

  resetForm() {
    this.contactForm.reset();
    this.submittedSuccess.set(false);
  }
}
