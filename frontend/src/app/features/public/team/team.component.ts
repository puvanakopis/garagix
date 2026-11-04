import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MechanicService } from '../../../core/services/mechanic.service';
import { Mechanic } from '../../../core/models/mechanic.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas text-gx-text-primary overflow-x-hidden min-h-screen">
      <!-- 1. Page Header -->
      <app-page-header
        title="OUR TEAM"
        [breadcrumbs]="[{ label: 'Our Team' }]"
        bgImage="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1600&auto=format&fit=crop&q=80"
      />

      <!-- 2. Main Team Section -->
      <section class="py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="text-center mb-10 sm:mb-14">
            <span class="sub-tag-red">OUR EXPERT TEAM</span>
            <h2 class="bootlab-section-title text-center">
              Meet The Expert Technicians To<br>
              Keeping <span class="text-gx-primary">Your Car.</span>
            </h2>
          </div>

          <!-- 6 Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            @for (mech of mechanics(); track mech.id; let idx = $index) {
              <div
                class="relative overflow-hidden border border-gx-border bg-gx-card transition-all duration-300 hover:border-gx-primary hover:-translate-y-1.5 cursor-pointer group"
                (mouseenter)="setActiveCard(mech.id)"
                (mouseleave)="clearActiveCard()"
                (click)="openMechanicModal(mech)"
              >
                <!-- Photo Container -->
                <div class="h-[380px] sm:h-[420px] overflow-hidden relative">
                  <img
                    [src]="mech.imageUrl"
                    [alt]="mech.name"
                    (error)="onImageError($event, mech)"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <!-- Bottom Detail Overlay Bar -->
                  <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-5 sm:p-6 pt-16 flex items-end justify-between gap-3">
                    <div>
                      <h3 class="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-gx-primary transition-colors duration-200">{{ mech.name }}</h3>
                      <p class="text-xs font-bold text-gx-primary uppercase tracking-widest mt-1">{{ mech.title }}</p>
                    </div>
                    <button
                      type="button"
                      class="px-3 py-1.5 bg-[#d70006] hover:bg-white text-white hover:text-black font-oxanium text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-1 shadow-[0_4px_12px_rgba(215,0,6,0.35)]"
                      (click)="openMechanicModal(mech); $event.stopPropagation()"
                      aria-label="View Technician Profile"
                    >
                      <span>VIEW MORE</span>
                      <app-icon name="chevron-right" [size]="14" strokeColor="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 3. Quality Standards & Workshop Commitment Banner (Styled same as 24/7 Emergency Recovery in Contact Us) -->
      <section class="bg-gx-surface py-16 sm:py-20 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="bg-gx-card border border-[#292929] p-8 sm:p-12 relative overflow-hidden">
            <!-- Ambient Red Accent Glow -->
            <div class="absolute -top-24 -right-24 w-80 h-80 bg-gx-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Top Header & Call to Action -->
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-[#222222] relative z-10">
              <div class="max-w-[720px]">
                <div>
                  <span class="sub-tag-red">ENGINEERING STANDARDS</span>
                </div>
                <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                  Uncompromised Engineering Precision &amp; Factory Protocols
                </h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  Every vehicle serviced by our engineering squad is held to strict manufacturer tolerances, computerized torque verification, and aseptic cleanliness protocols.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <a
                  routerLink="/customer/book-repair"
                  class="bootlab-btn-primary px-8 py-4 text-xs flex items-center gap-2 group"
                >
                  <app-icon name="calendar" [size]="14" />
                  <span>BOOK CERTIFIED TECHNICIAN</span>
                </a>
              </div>
            </div>

            <!-- 3 Quality Pillars Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 relative z-10">
              <!-- Pillar 1 -->
              <div class="bg-[#0e0d0d] border border-[#222222] p-6 hover:border-gx-primary transition-all duration-300 group">
                <div class="w-12 h-12 bg-[#141314] border border-[#292929] flex items-center justify-center shrink-0 text-gx-primary mb-4 group-hover:border-gx-primary group-hover:shadow-[0_0_12px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="award" [size]="22" strokeColor="#d70006" />
                </div>
                <h4 class="font-display text-lg font-bold text-white mb-2 group-hover:text-gx-primary transition-colors">Continuous OEM Certification</h4>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  Each technician completes mandatory annual recertification on European &amp; Japanese platforms.
                </p>
              </div>

              <!-- Pillar 2 -->
              <div class="bg-[#0e0d0d] border border-[#222222] p-6 hover:border-gx-primary transition-all duration-300 group">
                <div class="w-12 h-12 bg-[#141314] border border-[#292929] flex items-center justify-center shrink-0 text-gx-primary mb-4 group-hover:border-gx-primary group-hover:shadow-[0_0_12px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="shield" [size]="22" strokeColor="#d70006" />
                </div>
                <h4 class="font-display text-lg font-bold text-white mb-2 group-hover:text-gx-primary transition-colors">Clean Workshop Protocol</h4>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  Protective interior wraps, seat covers, and floor mats used on every vehicle during repair.
                </p>
              </div>

              <!-- Pillar 3 -->
              <div class="bg-[#0e0d0d] border border-[#222222] p-6 hover:border-gx-primary transition-all duration-300 group">
                <div class="w-12 h-12 bg-[#141314] border border-[#292929] flex items-center justify-center shrink-0 text-gx-primary mb-4 group-hover:border-gx-primary group-hover:shadow-[0_0_12px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="wrench" [size]="22" strokeColor="#d70006" />
                </div>
                <h4 class="font-display text-lg font-bold text-white mb-2 group-hover:text-gx-primary transition-colors">Digital Factory Torquing</h4>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  Every cylinder bolt, wheel stud, and drain plug torqued to computerized factory specs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <!-- Mechanic Profile Detail Modal -->
      @if (selectedMechanic(); as mech) {
        <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" (click)="closeMechanicModal()">
          <div class="w-full max-w-2xl bg-gx-card border border-gx-border shadow-2xl overflow-hidden" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between p-6 border-b border-gx-border-subtle">
              <h3 class="font-display text-xl font-bold text-white">Technician Profile</h3>
              <button class="text-gx-text-muted hover:text-white transition-colors cursor-pointer" (click)="closeMechanicModal()" aria-label="Close dialog">
                <app-icon name="x" [size]="20" />
              </button>
            </div>

            <div class="p-6 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6">
              <div class="flex flex-col items-center text-center">
                <img
                  [src]="mech.imageUrl"
                  [alt]="mech.name"
                  (error)="onImageError($event, mech)"
                  class="w-40 h-48 object-cover border border-[#292929]"
                />
                <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0e0d0d] border border-[#292929] text-[0.6875rem] font-bold uppercase tracking-wider text-white mt-3">
                  <span class="w-2 h-2 rounded-full" [ngClass]="mech.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  <span>{{ mech.status === 'available' ? 'Available Today' : 'In Service Bay' }}</span>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <h2 class="font-display text-2xl font-bold text-white">{{ mech.name }}</h2>
                  <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mt-0.5">{{ mech.title }}</div>
                  <div class="inline-block bg-[#0e0d0d] border border-gx-border-subtle px-2.5 py-1 text-xs text-white mt-2 font-display uppercase tracking-wider">{{ mech.specialization }}</div>
                </div>

                <div class="grid grid-cols-3 gap-2 bg-[#0e0d0d] border border-[#222222] p-3 text-center">
                  <div>
                    <span class="font-display font-black text-white text-base block">{{ mech.experienceYears }} Yrs</span>
                    <span class="text-[0.6875rem] text-gx-text-muted uppercase">Experience</span>
                  </div>
                  <div>
                    <span class="font-display font-black text-white text-base block">&#9733; {{ mech.rating }}</span>
                    <span class="text-[0.6875rem] text-gx-text-muted uppercase">{{ mech.reviewCount }} Reviews</span>
                  </div>
                  <div>
                    <span class="font-display font-black text-white text-base block">{{ mech.assignedBookingsCount }}</span>
                    <span class="text-[0.6875rem] text-gx-text-muted uppercase">Active Repairs</span>
                  </div>
                </div>

                <div>
                  <h4 class="text-xs font-bold text-gx-text-muted uppercase tracking-wider mb-1 font-display">Engineering Bio</h4>
                  <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">{{ mech.bio }}</p>
                </div>

                <div>
                  <h4 class="text-xs font-bold text-gx-text-muted uppercase tracking-wider mb-2 font-display">Factory Certifications</h4>
                  <div class="flex flex-wrap gap-2">
                    @for (cert of mech.certifications; track cert) {
                      <span class="inline-flex items-center gap-1.5 bg-[#0e0d0d] border border-[#292929] px-2.5 py-1 text-xs text-white">
                        <app-icon name="check" [size]="10" strokeColor="#d70006" />
                        {{ cert }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 p-6 border-t border-gx-border-subtle bg-[#100e0f]">
              <button type="button" class="px-5 py-2.5 border border-[#292929] bg-[#0e0d0d] text-white hover:border-white font-display text-xs font-bold uppercase tracking-wider cursor-pointer" (click)="closeMechanicModal()">
                Close
              </button>
              <a
                [routerLink]="['/customer/book-repair']"
                [queryParams]="{ mechanicId: mech.id }"
                class="bootlab-btn-primary px-6 py-2.5 text-xs"
                (click)="closeMechanicModal()"
              >
                <app-icon name="calendar" [size]="14" />
                <span>Book Repair With {{ mech.name }}</span>
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class TeamComponent {
  private mechanicService = inject(MechanicService);

  mechanics = this.mechanicService.mechanics;
  selectedMechanic = signal<Mechanic | null>(null);
  activeCardId = signal<string | null>(null);

  setActiveCard(id: string) {
    this.activeCardId.set(id);
  }

  clearActiveCard() {
    this.activeCardId.set(null);
  }

  openMechanicModal(mech: Mechanic) {
    this.selectedMechanic.set(mech);
  }

  closeMechanicModal() {
    this.selectedMechanic.set(null);
  }

  onImageError(event: Event, mech?: Mechanic) {
    const target = event.target as HTMLImageElement;
    if (!target) return;
    if (target.src.endsWith('.png')) {
      target.src = target.src.replace(/\.png$/, '.jpg');
    } else if (target.src.endsWith('.jpg')) {
      target.src = target.src.replace(/\.jpg$/, '.png');
    } else {
      target.src = '/images/team/mechanic-1.png';
    }
  }
}
