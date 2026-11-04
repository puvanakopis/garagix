import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MechanicService } from '../../../core/services/mechanic.service';
import { ToastService } from '../../../core/services/toast.service';
import { Mechanic } from '../../../core/models/mechanic.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-mechanics',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent, ConfirmDialogComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent & Quick Actions -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Master <span class="text-[#d70006]">Technicians &amp; Bays</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage workshop technicians, bay assignments, and certifications.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 self-start sm:self-auto cursor-pointer"
          (click)="openAddModal()"
        >
          <app-icon name="plus" [size]="14" />
          <span>Add Master Technician</span>
        </button>
      </header>

      <!-- 2. Minimal Status Summary Bar -->
      <section aria-label="Technicians Summary" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">Total Technicians</span>
          </div>
          <span class="text-base font-bold font-oxanium text-white">{{ allMechanics().length }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Active Bay Jobs</span>
          <span class="text-base font-bold font-oxanium text-white">{{ totalActiveJobs() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Avg Experience</span>
          <span class="text-base font-bold font-oxanium text-white">{{ avgExperience() }} Yrs</span>
        </div>
      </section>

      <!-- 3. Search Bar -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 bg-[#141314] border border-[#222222] focus-within:border-[#d70006] rounded-xl px-3.5 py-2 w-full max-w-md transition-colors">
          <app-icon name="search" [size]="16" strokeColor="#878f97" />
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search technician name, title, specialization..."
            class="flex-1 bg-transparent border-none text-white text-xs sm:text-sm outline-none placeholder:text-neutral-500"
          />
          @if (searchQuery()) {
            <button class="text-neutral-400 hover:text-white p-0.5 cursor-pointer" (click)="searchQuery.set('')">
              <app-icon name="x" [size]="14" />
            </button>
          }
        </div>
      </section>

      <!-- 4. Mechanics Grid -->
      @if (filteredMechanics().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (mech of filteredMechanics(); track mech.id) {
            <div class="bg-[#141314] border border-[#222222] hover:border-neutral-700 rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 transition-colors">
              <div>
                <div class="flex items-center gap-3 pb-3 border-b border-[#222222]">
                  <button type="button" (click)="openViewModal(mech)" class="cursor-pointer shrink-0" title="View details">
                    <img
                      [src]="mech.imageUrl"
                      [alt]="mech.name"
                      (error)="onImageError($event)"
                      class="w-12 h-12 rounded-full object-cover border border-[#262526] hover:opacity-80 transition-opacity"
                    />
                  </button>
                  <div class="flex-1 min-w-0">
                    <button type="button" (click)="openViewModal(mech)" class="text-left cursor-pointer group block truncate w-full" title="View details">
                      <h3 class="font-oxanium font-bold text-white text-base truncate group-hover:text-[#d70006] transition-colors">{{ mech.name }}</h3>
                    </button>
                    <div class="text-xs text-neutral-400 truncate">{{ mech.title }}</div>
                  </div>
                </div>

                <div class="py-3.5 space-y-2 text-xs">
                  <div class="flex justify-between">
                    <span class="text-neutral-400">Specialization:</span>
                    <span class="text-[#d70006] font-semibold font-oxanium">{{ mech.specialization }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-neutral-400">Experience:</span>
                    <span class="text-white">{{ mech.experienceYears }} Years</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-neutral-400">Active Bay Load:</span>
                    <span class="text-white font-medium">{{ mech.assignedBookingsCount }} Scheduled</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-neutral-400">Working Hours:</span>
                    <span class="text-neutral-400 text-[11px]">{{ mech.workingHours }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 pt-3 border-t border-[#1f1e1f]">
                <button
                  type="button"
                  class="flex-1 py-1.5 px-2.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  (click)="openViewModal(mech)"
                  title="View Profile Details"
                >
                  <app-icon name="eye" [size]="13" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  class="flex-1 py-1.5 px-2.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  (click)="openEditModal(mech)"
                  title="Edit Profile"
                >
                  <app-icon name="edit" [size]="13" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-lg border border-red-900/40 hover:bg-red-950/40 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                  (click)="requestDelete(mech)"
                  title="Remove from roster"
                >
                  <app-icon name="trash" [size]="15" strokeColor="#fb7185" />
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <app-empty-state
          icon="users"
          title="No Technicians Found"
          description="Try resetting your search query or availability filter."
          actionLabel="Reset Filter"
          (action)="resetFilters()"
        />
      }

      <!-- Add/Edit Mechanic Modal -->
      @if (showFormModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeFormModal()">
          <div class="w-full max-w-xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">TECHNICIAN ROSTER</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">
                  {{ editingMechanicId() ? 'Edit Master Technician' : 'Register New Technician' }}
                </h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeFormModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <form [formGroup]="mechForm" (ngSubmit)="saveMechanic()" class="p-6 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="mName" class="text-xs font-semibold text-neutral-300 block mb-1">Full Name <span class="text-[#d70006]">*</span></label>
                  <input id="mName" type="text" formControlName="name" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="mTitle" class="text-xs font-semibold text-neutral-300 block mb-1">Job Title <span class="text-[#d70006]">*</span></label>
                  <input id="mTitle" type="text" formControlName="title" placeholder="e.g. Master Hybrid Specialist" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="mSpec" class="text-xs font-semibold text-neutral-300 block mb-1">Specialization <span class="text-[#d70006]">*</span></label>
                  <input id="mSpec" type="text" formControlName="specialization" placeholder="e.g. Hybrid & Diagnostics" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="mExp" class="text-xs font-semibold text-neutral-300 block mb-1">Experience (Years) <span class="text-[#d70006]">*</span></label>
                  <input id="mExp" type="number" formControlName="experienceYears" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-oxanium" />
                </div>
              </div>

              <div>
                <label class="text-xs font-semibold text-neutral-300 block mb-2">Avatar Photo</label>
                <div class="flex items-center gap-4 p-3 bg-[#1c1b1c] border border-[#262526] rounded-xl">
                  <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-[#262526] bg-[#141314] shrink-0 flex items-center justify-center">
                    @if (avatarPreview() || mechForm.get('imageUrl')?.value) {
                      <img
                        [src]="avatarPreview() || mechForm.get('imageUrl')?.value"
                        alt="Avatar preview"
                        class="w-full h-full object-cover"
                        (error)="onImageError($event)"
                      />
                    } @else {
                      <app-icon name="user" [size]="24" strokeColor="#878f97" />
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <input
                      #fileInput
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      class="hidden"
                      (change)="onFileSelected($event)"
                    />
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        (click)="fileInput.click()"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252425] hover:bg-[#2e2d2e] text-xs font-semibold text-neutral-200 hover:text-white border border-[#333233] hover:border-neutral-500 transition-colors cursor-pointer"
                      >
                        <app-icon name="upload" [size]="14" />
                        <span>Upload Photo</span>
                      </button>
                      @if (avatarPreview()) {
                        <button
                          type="button"
                          (click)="removeAvatar(fileInput)"
                          class="px-2 py-1 text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          Reset
                        </button>
                      }
                    </div>
                    <p class="text-[11px] text-neutral-400 mt-1">PNG, JPG, or WEBP (up to 3MB)</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                  (click)="closeFormModal()"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="mechForm.invalid"
                  class="px-4 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {{ editingMechanicId() ? 'Save Profile' : 'Register Technician' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- View Technician Profile Modal -->
      @if (viewingMechanic(); as mech) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeViewModal()">
          <div class="w-full max-w-xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">TECHNICIAN DOSSIER</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">
                  {{ mech.name }}
                </h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeViewModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <!-- Profile Top Row -->
              <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                <img
                  [src]="mech.imageUrl"
                  [alt]="mech.name"
                  (error)="onImageError($event)"
                  class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-[#333233] shrink-0"
                />
                <div class="flex-1 text-center sm:text-left min-w-0">
                  <h2 class="font-oxanium text-xl font-bold text-white">{{ mech.name }}</h2>
                  <div class="text-xs font-semibold text-neutral-400 mt-0.5">{{ mech.title }}</div>
                  <div class="inline-block mt-2 px-2.5 py-1 rounded bg-[#141314] border border-[#262526] text-xs font-bold font-oxanium text-[#d70006]">
                    {{ mech.specialization }}
                  </div>
                  @if (mech.rating) {
                    <div class="flex items-center justify-center sm:justify-start gap-1.5 mt-2.5 text-xs text-neutral-300">
                      <app-icon name="star" [size]="13" strokeColor="#f59e0b" />
                      <span class="font-bold text-white">{{ mech.rating }}</span>
                      <span class="text-neutral-400">&bull; {{ mech.reviewCount }} QA Reviews</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Key Metrics Grid -->
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-3 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                  <span class="text-[10px] text-neutral-400 uppercase font-oxanium block">Experience</span>
                  <strong class="text-sm font-bold text-white font-oxanium mt-0.5 block">{{ mech.experienceYears }} Years</strong>
                </div>
                <div class="p-3 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                  <span class="text-[10px] text-neutral-400 uppercase font-oxanium block">Bay Allocation</span>
                  <strong class="text-sm font-bold text-white font-oxanium mt-0.5 block">{{ mech.assignedBookingsCount }} Jobs</strong>
                </div>
                <div class="p-3 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                  <span class="text-[10px] text-neutral-400 uppercase font-oxanium block">Working Shift</span>
                  <strong class="text-xs font-medium text-neutral-300 mt-0.5 block truncate" [title]="mech.workingHours">{{ mech.workingHours || 'Standard' }}</strong>
                </div>
              </div>

              <!-- Engineering Bio -->
              @if (mech.bio) {
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium mb-1.5">Engineering Bio</h4>
                  <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                    {{ mech.bio }}
                  </p>
                </div>
              }

              <!-- Factory Certifications -->
              @if (mech.certifications && mech.certifications.length > 0) {
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium mb-2">Factory &amp; Guild Certifications</h4>
                  <div class="flex flex-wrap gap-2">
                    @for (cert of mech.certifications; track cert) {
                      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1b1c] border border-[#262526] text-xs text-neutral-200">
                        <app-icon name="check" [size]="12" strokeColor="#d70006" />
                        <span>{{ cert }}</span>
                      </span>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#222222] bg-[#100e0f]">
              <button
                type="button"
                class="px-4 py-2 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                (click)="closeViewModal()"
              >
                Close
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
                (click)="closeViewModal(); openEditModal(mech)"
              >
                <app-icon name="edit" [size]="14" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirmation -->
      <app-confirm-dialog
        [isOpen]="deleteDialogOpen()"
        title="Remove Master Technician"
        [message]="'Are you sure you want to remove ' + (mechanicToDelete()?.name || '') + ' from the active technician directory?'"
        confirmText="Remove Technician"
        cancelText="Cancel"
        (confirm)="confirmDelete()"
        (cancel)="deleteDialogOpen.set(false)"
      />
    </div>
  `
})
export class AdminMechanicsComponent {
  private mechanicService = inject(MechanicService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  allMechanics = this.mechanicService.mechanics;

  searchQuery = signal<string>('');
  showFormModal = signal<boolean>(false);
  editingMechanicId = signal<string | null>(null);
  avatarPreview = signal<string>('');
  viewingMechanic = signal<Mechanic | null>(null);

  mechanicToDelete = signal<Mechanic | null>(null);
  deleteDialogOpen = signal<boolean>(false);

  totalActiveJobs = computed(() => {
    return this.allMechanics().reduce((sum, m) => sum + (m.assignedBookingsCount || 0), 0);
  });

  avgExperience = computed(() => {
    const mechs = this.allMechanics();
    if (mechs.length === 0) return 0;
    const total = mechs.reduce((sum, m) => sum + (m.experienceYears || 0), 0);
    return Math.round(total / mechs.length);
  });

  mechForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    title: ['', Validators.required],
    specialization: ['', Validators.required],
    experienceYears: [8, [Validators.required, Validators.min(1)]],
    status: ['available', Validators.required],
    workingHours: ['8:00 AM - 5:30 PM (Mon - Sat)'],
    bio: [''],
    imageUrl: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80']
  });

  filteredMechanics = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allMechanics();

    return this.allMechanics().filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.specialization.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q)
    );
  });

  openViewModal(m: Mechanic): void {
    this.viewingMechanic.set(m);
  }

  closeViewModal(): void {
    this.viewingMechanic.set(null);
  }

  openAddModal(): void {
    this.editingMechanicId.set(null);
    this.avatarPreview.set('/images/team/mechanic-1.png');
    this.mechForm.reset({
      experienceYears: 8,
      status: 'available',
      workingHours: '8:00 AM - 5:30 PM (Mon - Sat)',
      imageUrl: '/images/team/mechanic-1.png'
    });
    this.showFormModal.set(true);
  }

  openEditModal(m: Mechanic): void {
    this.editingMechanicId.set(m.id);
    this.avatarPreview.set(m.imageUrl || '/images/team/mechanic-1.png');
    this.mechForm.patchValue({
      name: m.name,
      title: m.title,
      specialization: m.specialization,
      experienceYears: m.experienceYears,
      status: m.status || 'available',
      workingHours: m.workingHours,
      bio: m.bio,
      imageUrl: m.imageUrl || '/images/team/mechanic-1.png'
    });
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.editingMechanicId.set(null);
    this.avatarPreview.set('');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > 3 * 1024 * 1024) {
      this.toast.showError('Image file is too large. Please select a photo under 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.avatarPreview.set(dataUrl);
      this.mechForm.patchValue({ imageUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(fileInput?: HTMLInputElement): void {
    if (fileInput) fileInput.value = '';
    this.avatarPreview.set('');
    this.mechForm.patchValue({ imageUrl: '/images/team/mechanic-1.png' });
  }

  saveMechanic(): void {
    if (this.mechForm.invalid) return;
    const val = this.mechForm.value;
    const editId = this.editingMechanicId();

    if (editId) {
      this.mechanicService.updateMechanic(editId, val);
      this.toast.showSuccess(`Updated ${val.name}'s profile.`);
    } else {
      this.mechanicService.addMechanic({
        name: val.name,
        title: val.title,
        specialization: val.specialization,
        experienceYears: Number(val.experienceYears),
        rating: 4.9,
        reviewCount: 1,
        bio: val.bio || 'Certified specialist technician.',
        imageUrl: val.imageUrl || '/images/team/mechanic-1.png',
        status: val.status || 'available',
        certifications: ['Automotive Guild Member'],
        workingHours: val.workingHours
      });
      this.toast.showSuccess(`Registered ${val.name} to garage bay registry.`);
    }
    this.closeFormModal();
  }

  requestDelete(m: Mechanic): void {
    this.mechanicToDelete.set(m);
    this.deleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    const m = this.mechanicToDelete();
    if (m) {
      this.mechanicService.deleteMechanic(m.id);
      this.toast.showSuccess(`Removed ${m.name} from registry.`);
    }
    this.deleteDialogOpen.set(false);
    this.mechanicToDelete.set(null);
  }

  resetFilters(): void {
    this.searchQuery.set('');
  }

  onImageError(event: Event): void {
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
