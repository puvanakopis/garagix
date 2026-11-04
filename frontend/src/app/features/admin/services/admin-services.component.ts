import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceCatalogService } from '../../../core/services/service-catalog.service';
import { ToastService } from '../../../core/services/toast.service';
import { CarService, ServiceCategory } from '../../../core/models/service.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent, ConfirmDialogComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent & Quick Actions -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Service <span class="text-[#d70006]">Catalog</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure automotive repair packages, starting LKR rates, durations, and diagnostic checklists.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 self-start sm:self-auto cursor-pointer"
          (click)="openAddModal()"
        >
          <app-icon name="plus" [size]="14" />
          <span>Add Service Package</span>
        </button>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      <section aria-label="Services Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">All Packages</span>
          </div>
          <span class="text-base font-bold font-oxanium text-white">{{ allServices().length }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Active Online</span>
          <span class="text-base font-bold font-oxanium text-emerald-400">{{ activeCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Categories</span>
          <span class="text-base font-bold font-oxanium text-white">{{ categories().length }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Avg Starting Rate</span>
          <span class="text-base font-bold font-oxanium text-white">LKR {{ avgStartingRate() | number }}</span>
        </div>
      </section>

      <!-- 3. Search & Filter Bar with Sleek Pills -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 bg-[#141314] border border-[#222222] focus-within:border-[#d70006] rounded-xl px-3.5 py-2 w-full sm:max-w-md transition-colors">
          <app-icon name="search" [size]="16" strokeColor="#878f97" />
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search service name or symptom..."
            class="flex-1 bg-transparent border-none text-white text-xs sm:text-sm outline-none placeholder:text-neutral-500"
          />
          @if (searchQuery()) {
            <button class="text-neutral-400 hover:text-white p-0.5 cursor-pointer" (click)="searchQuery.set('')">
              <app-icon name="x" [size]="14" />
            </button>
          }
        </div>

        <!-- Filter Pills matching dashboard style -->
        <div class="flex items-center p-0.5 rounded-lg bg-[#141314] border border-[#222222] overflow-x-auto scrollbar-none">
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="selectedCategory() === 'ALL' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="selectedCategory.set('ALL')"
          >
            All ({{ allServices().length }})
          </button>
          @for (cat of categories(); track cat) {
            <button
              type="button"
              class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
              [ngClass]="selectedCategory() === cat ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
              (click)="selectedCategory.set(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      </section>

      <!-- 4. Services Table -->
      @if (filteredServices().length > 0) {
        <div class="bg-[#141314] border border-[#222222] rounded-xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr class="border-b border-[#222222] text-[10px] font-bold uppercase font-oxanium text-neutral-400 bg-[#100e0f]">
                  <th class="py-3 px-4">Service Visual</th>
                  <th class="py-3 px-4">Service Name &amp; Category</th>
                  <th class="py-3 px-4">Scope &amp; Inclusions</th>
                  <th class="py-3 px-4">Starting Rate</th>
                  <th class="py-3 px-4">Duration</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1e1c1d]">
                @for (s of filteredServices(); track s.id) {
                  <tr class="hover:bg-[#181717] transition-colors">
                    <td class="py-3 px-4">
                      <button type="button" (click)="openViewModal(s)" class="cursor-pointer block" title="View service details">
                        <img [src]="s.imageUrl" [alt]="s.name" class="w-12 h-9 rounded-md object-cover bg-[#1c1b1c] border border-[#262526] hover:opacity-80 transition-opacity" />
                      </button>
                    </td>
                    <td class="py-3 px-4">
                      <button type="button" (click)="openViewModal(s)" class="text-left cursor-pointer group">
                        <strong class="text-white text-xs block font-oxanium group-hover:text-[#d70006] transition-colors">{{ s.name }}</strong>
                      </button>
                      <span class="inline-block mt-0.5 px-2 py-0.5 rounded bg-[#1c1b1c] text-[10px] text-[#d70006] font-semibold border border-[#262526]">{{ s.category }}</span>
                    </td>
                    <td class="py-3 px-4 max-w-[220px]">
                      <div class="text-xs text-neutral-300 line-clamp-1">{{ s.shortDescription }}</div>
                      <div class="text-[10px] text-neutral-500 mt-0.5">{{ s.includedItems.length }} included items</div>
                    </td>
                    <td class="py-3 px-4 font-oxanium font-bold text-white text-xs">
                      LKR {{ s.startingPriceLkr | number }}
                    </td>
                    <td class="py-3 px-4 text-xs text-neutral-300">
                      {{ s.durationMinutes }} mins
                    </td>
                    <td class="py-3 px-4">
                      <button
                        type="button"
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                        [ngClass]="s.isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'"
                        (click)="toggleActive(s)"
                      >
                        {{ s.isActive ? 'Active' : 'Inactive' }}
                      </button>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          class="px-2.5 py-1 rounded-md bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
                          (click)="openViewModal(s)"
                          title="View Service Package"
                        >
                          <app-icon name="eye" [size]="13" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          class="px-2.5 py-1 rounded-md bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
                          (click)="openEditModal(s)"
                          title="Edit Service"
                        >
                          <app-icon name="edit" [size]="13" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          class="p-1 rounded-md hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          (click)="requestDelete(s)"
                          title="Delete Service"
                        >
                          <app-icon name="trash" [size]="15" strokeColor="#fb7185" />
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <app-empty-state
          icon="wrench"
          title="No Services Found"
          description="Try clearing your search query or switching categories."
          actionLabel="Clear Filters"
          (action)="resetFilters()"
        />
      }

      <!-- Add/Edit Service Modal -->
      @if (showFormModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeFormModal()">
          <div class="w-full max-w-3xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#100e0f]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">SERVICE CONFIGURATION</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">
                  {{ editingServiceId() ? 'Edit Service Package' : 'Create New Service Package' }}
                </h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer transition-colors" (click)="closeFormModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <form [formGroup]="serviceForm" (ngSubmit)="saveServiceForm()" class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <!-- 1. Identification & Category -->
              <div class="space-y-4">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium pb-1 border-b border-[#222222]">
                  1. Identification &amp; Classification
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="srvName" class="text-xs font-semibold text-neutral-300 block mb-1">Service Name <span class="text-[#d70006]">*</span></label>
                    <input
                      id="srvName"
                      type="text"
                      formControlName="name"
                      (input)="onNameInput()"
                      placeholder="e.g. Advanced Suspension Servicing"
                      class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label for="srvCat" class="text-xs font-semibold text-neutral-300 block mb-1">Service Category <span class="text-[#d70006]">*</span></label>
                    <select
                      id="srvCat"
                      formControlName="category"
                      class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors cursor-pointer"
                    >
                      @for (c of categories(); track c) {
                        <option [value]="c">{{ c }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div>
                  <label for="srvSlug" class="text-xs font-semibold text-neutral-300 block mb-1">
                    Slug / URL Identifier
                    <span class="text-[11px] text-neutral-400 font-normal ml-1">(auto-generated from name)</span>
                  </label>
                  <input
                    id="srvSlug"
                    type="text"
                    formControlName="slug"
                    placeholder="e.g. advanced-suspension-servicing"
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-neutral-300 text-xs sm:text-sm outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <!-- 2. Pricing & Workshop Turnaround -->
              <div class="space-y-4">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium pb-1 border-b border-[#222222]">
                  2. Pricing &amp; Workshop Turnaround
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="srvPrice" class="text-xs font-semibold text-neutral-300 block mb-1">Starting Price (LKR) <span class="text-[#d70006]">*</span></label>
                    <div class="relative">
                      <input
                        id="srvPrice"
                        type="number"
                        formControlName="startingPriceLkr"
                        class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl pl-3.5 pr-14 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-oxanium"
                      />
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-oxanium font-bold">LKR</span>
                    </div>
                  </div>
                  <div>
                    <label for="srvDur" class="text-xs font-semibold text-neutral-300 block mb-1">Estimated Duration (Minutes) <span class="text-[#d70006]">*</span></label>
                    <div class="relative">
                      <input
                        id="srvDur"
                        type="number"
                        formControlName="durationMinutes"
                        class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl pl-3.5 pr-14 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-oxanium"
                      />
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-oxanium font-bold">MINS</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. Banner Image & Visibility Toggles -->
              <div class="space-y-4">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium pb-1 border-b border-[#222222]">
                  3. Media &amp; Visibility Status
                </h4>
                <div>
                  <label class="text-xs font-semibold text-neutral-300 block mb-2">Package Banner Image</label>
                  <div class="flex items-center gap-4 p-3 bg-[#1c1b1c] border border-[#262526] rounded-xl">
                    <div class="w-24 h-16 rounded-lg overflow-hidden border-2 border-[#262526] bg-[#141314] shrink-0 flex items-center justify-center">
                      @if (imagePreview() || serviceForm.get('imageUrl')?.value) {
                        <img
                          [src]="imagePreview() || serviceForm.get('imageUrl')?.value"
                          alt="Service preview"
                          class="w-full h-full object-cover"
                        />
                      } @else {
                        <app-icon name="wrench" [size]="20" strokeColor="#878f97" />
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
                          <span>Upload Image</span>
                        </button>
                        @if (imagePreview()) {
                          <button
                            type="button"
                            (click)="removeImage(fileInput)"
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

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label class="flex items-start gap-2.5 p-3 rounded-xl bg-[#1c1b1c] border border-[#262526] cursor-pointer hover:border-[#333233] transition-colors">
                    <input id="srvActive" type="checkbox" formControlName="isActive" class="w-4 h-4 mt-0.5 accent-[#d70006] rounded" />
                    <div>
                      <span class="text-xs font-semibold text-white block">Active in Catalog</span>
                      <span class="text-[11px] text-neutral-400 block mt-0.5">Customers can discover and book this service online</span>
                    </div>
                  </label>
                  <label class="flex items-start gap-2.5 p-3 rounded-xl bg-[#1c1b1c] border border-[#262526] cursor-pointer hover:border-[#333233] transition-colors">
                    <input id="srvFeatured" type="checkbox" formControlName="featured" class="w-4 h-4 mt-0.5 accent-[#d70006] rounded" />
                    <div>
                      <span class="text-xs font-semibold text-white block">Featured Package</span>
                      <span class="text-[11px] text-neutral-400 block mt-0.5">Highlight on homepage and prominent promo cards</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 4. Scope Descriptions -->
              <div class="space-y-4">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium pb-1 border-b border-[#222222]">
                  4. Scope Descriptions
                </h4>
                <div>
                  <label for="srvShortDesc" class="text-xs font-semibold text-neutral-300 block mb-1">
                    Short Description <span class="text-[#d70006]">*</span>
                    <span class="text-[11px] text-neutral-400 font-normal ml-1">(shown on service cards)</span>
                  </label>
                  <textarea
                    id="srvShortDesc"
                    rows="2"
                    formControlName="shortDescription"
                    placeholder="Brief 1-2 sentence overview of the service package..."
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl p-3 text-white text-xs sm:text-sm outline-none transition-colors"
                  ></textarea>
                </div>
                <div>
                  <label for="srvFullDesc" class="text-xs font-semibold text-neutral-300 block mb-1">
                    Full Technical Description <span class="text-[#d70006]">*</span>
                    <span class="text-[11px] text-neutral-400 font-normal ml-1">(detailed methodology, equipment, and warranty)</span>
                  </label>
                  <textarea
                    id="srvFullDesc"
                    rows="3"
                    formControlName="fullDescription"
                    placeholder="Detailed explanation of the full diagnostic process, components inspected or replaced..."
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl p-3 text-white text-xs sm:text-sm outline-none transition-colors"
                  ></textarea>
                </div>
              </div>

              <!-- 5. Included Checks & Deliverables -->
              <div class="space-y-3">
                <div class="flex items-center justify-between pb-1 border-b border-[#222222]">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium">
                    5. Included Checks &amp; Deliverables
                  </h4>
                  <span class="text-[10px] font-bold font-oxanium px-2 py-0.5 rounded bg-[#1c1b1c] border border-[#262526] text-[#d70006]">
                    {{ includedItems().length }} CHECKS
                  </span>
                </div>
                <div class="flex gap-2">
                  <input
                    type="text"
                    [value]="newIncludedItem()"
                    (input)="newIncludedItem.set($any($event.target).value)"
                    (keydown.enter)="$event.preventDefault(); addIncludedItem()"
                    placeholder="Add an inspection checkpoint (e.g. 40-Point safety check)..."
                    class="flex-1 bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors"
                  />
                  <button
                    type="button"
                    (click)="addIncludedItem()"
                    class="px-3.5 py-2 bg-[#252425] hover:bg-[#d70006] hover:text-white text-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider font-oxanium transition-colors cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </div>
                @if (includedItems().length > 0) {
                  <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    @for (item of includedItems(); track $index) {
                      <div class="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#1c1b1c] border border-[#262526] text-xs text-neutral-200">
                        <div class="flex items-center gap-2 min-w-0">
                          <app-icon name="check-circle" [size]="14" strokeColor="#d70006" class="shrink-0" />
                          <span class="truncate">{{ item }}</span>
                        </div>
                        <button
                          type="button"
                          (click)="removeIncludedItem($index)"
                          class="text-neutral-400 hover:text-red-400 p-1 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <app-icon name="x" [size]="14" />
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- 6. Common Symptoms Addressed -->
              <div class="space-y-3">
                <div class="flex items-center justify-between pb-1 border-b border-[#222222]">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium">
                    6. Common Symptoms Pinpointed
                  </h4>
                  <span class="text-[10px] font-bold font-oxanium px-2 py-0.5 rounded bg-[#1c1b1c] border border-[#262526] text-amber-400">
                    {{ commonSymptoms().length }} SYMPTOMS
                  </span>
                </div>
                <div class="flex gap-2">
                  <input
                    type="text"
                    [value]="newSymptom()"
                    (input)="newSymptom.set($any($event.target).value)"
                    (keydown.enter)="$event.preventDefault(); addSymptom()"
                    placeholder="Add warning symptom (e.g. Squealing noise when braking)..."
                    class="flex-1 bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors"
                  />
                  <button
                    type="button"
                    (click)="addSymptom()"
                    class="px-3.5 py-2 bg-[#252425] hover:bg-[#d70006] hover:text-white text-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider font-oxanium transition-colors cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </div>
                @if (commonSymptoms().length > 0) {
                  <div class="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                    @for (sym of commonSymptoms(); track $index) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1c1b1c] border border-[#262526] text-xs text-neutral-200">
                        <app-icon name="alert-triangle" [size]="12" strokeColor="#f59e0b" />
                        <span>{{ sym }}</span>
                        <button
                          type="button"
                          (click)="removeSymptom($index)"
                          class="text-neutral-400 hover:text-red-400 ml-1 cursor-pointer transition-colors"
                        >
                          &times;
                        </button>
                      </span>
                    }
                  </div>
                }
              </div>

              <!-- 7. Frequently Asked Inquiries (FAQs) -->
              <div class="space-y-3">
                <div class="flex items-center justify-between pb-1 border-b border-[#222222]">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium">
                    7. Frequently Asked Inquiries (FAQs)
                  </h4>
                  <span class="text-[10px] font-bold font-oxanium px-2 py-0.5 rounded bg-[#1c1b1c] border border-[#262526] text-white">
                    {{ faqs().length }} FAQS
                  </span>
                </div>
                <div class="p-3 bg-[#181718] border border-[#262526] rounded-xl space-y-2">
                  <input
                    type="text"
                    [value]="newFaqQuestion()"
                    (input)="newFaqQuestion.set($any($event.target).value)"
                    placeholder="Question: e.g. Do you use genuine certified replacement parts?"
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-lg px-3 py-2 text-white text-xs outline-none transition-colors"
                  />
                  <textarea
                    rows="2"
                    [value]="newFaqAnswer()"
                    (input)="newFaqAnswer.set($any($event.target).value)"
                    placeholder="Answer: e.g. Yes, we exclusively source certified OEM parts with manufacturer warranty..."
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-lg px-3 py-2 text-white text-xs outline-none transition-colors"
                  ></textarea>
                  <button
                    type="button"
                    (click)="addFaq()"
                    class="w-full py-2 bg-[#252425] hover:bg-[#d70006] hover:text-white text-neutral-200 rounded-lg text-xs font-bold uppercase tracking-wider font-oxanium transition-colors cursor-pointer"
                  >
                    + Add FAQ Pair
                  </button>
                </div>
                @if (faqs().length > 0) {
                  <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                    @for (faq of faqs(); track $index) {
                      <div class="p-3 rounded-lg bg-[#1c1b1c] border border-[#262526] relative group">
                        <div class="flex items-start justify-between gap-2">
                          <p class="text-xs font-bold text-white mb-0.5">{{ faq.question }}</p>
                          <button
                            type="button"
                            (click)="removeFaq($index)"
                            class="text-neutral-400 hover:text-red-400 p-0.5 cursor-pointer transition-colors shrink-0"
                            title="Remove FAQ"
                          >
                            <app-icon name="trash" [size]="13" />
                          </button>
                        </div>
                        <p class="text-[11px] text-neutral-400 leading-relaxed">{{ faq.answer }}</p>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Form Actions -->
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                  (click)="closeFormModal()"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="serviceForm.invalid"
                  class="px-5 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {{ editingServiceId() ? 'Save Changes' : 'Create Package' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- View Service Package Detail Modal -->
      @if (viewingService(); as srv) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeViewModal()">
          <div class="w-full max-w-2xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">SERVICE PACKAGE OVERVIEW</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">
                  {{ srv.name }}
                </h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeViewModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <!-- Visual Hero Image with Overlays -->
              <div class="relative rounded-xl overflow-hidden border border-[#262526] bg-[#0c0b0c] h-48 sm:h-56">
                <img [src]="srv.imageUrl" [alt]="srv.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                <div class="absolute top-3 left-3 flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-oxanium bg-[#d70006] text-white">
                    {{ srv.category }}
                  </span>
                  <span
                    class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                    [ngClass]="srv.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-xs' : 'bg-red-500/20 text-red-400 border border-red-500/40 backdrop-blur-xs'"
                  >
                    {{ srv.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div class="absolute bottom-3 inset-x-3 flex items-end justify-between gap-4">
                  <div>
                    <span class="text-[11px] text-neutral-400 block">Starting Estimate</span>
                    <span class="text-xl sm:text-2xl font-bold font-oxanium text-white">LKR {{ srv.startingPriceLkr | number }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141314]/90 border border-[#262526] text-xs font-semibold text-neutral-200 backdrop-blur-xs">
                    <app-icon name="clock" [size]="14" strokeColor="#d70006" />
                    <span>{{ srv.durationMinutes }} mins avg turnaround</span>
                  </div>
                </div>
              </div>

              <!-- Descriptions -->
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium mb-1">Package Scope</h4>
                <p class="text-xs sm:text-sm text-neutral-200 leading-relaxed">{{ srv.shortDescription }}</p>
                @if (srv.fullDescription && srv.fullDescription !== srv.shortDescription) {
                  <p class="text-xs text-neutral-400 leading-relaxed mt-2">{{ srv.fullDescription }}</p>
                }
              </div>

              <!-- Included Checkpoints & Scope -->
              @if (srv.includedItems && srv.includedItems.length > 0) {
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium mb-2">
                    Included Checks &amp; Deliverables ({{ srv.includedItems.length }})
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    @for (item of srv.includedItems; track item) {
                      <div class="flex items-start gap-2 p-2.5 rounded-lg bg-[#1c1b1c] border border-[#262526] text-xs text-neutral-300">
                        <app-icon name="check-circle" [size]="14" strokeColor="#d70006" class="mt-0.5 shrink-0" />
                        <span class="leading-tight">{{ item }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Common Symptoms Addressed -->
              @if (srv.commonSymptoms && srv.commonSymptoms.length > 0) {
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium mb-2">Common Symptoms Pinpointed</h4>
                  <div class="flex flex-wrap gap-2">
                    @for (sym of srv.commonSymptoms; track sym) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1c1b1c] border border-[#262526] text-xs text-neutral-300">
                        <app-icon name="alert-triangle" [size]="12" strokeColor="#f59e0b" />
                        <span>{{ sym }}</span>
                      </span>
                    }
                  </div>
                </div>
              }

              <!-- FAQs -->
              @if (srv.faqs && srv.faqs.length > 0) {
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium mb-2">Frequently Asked Inquiries</h4>
                  <div class="space-y-2">
                    @for (faq of srv.faqs; track faq.question) {
                      <div class="p-3 rounded-lg bg-[#1c1b1c] border border-[#262526]">
                        <p class="text-xs font-bold text-white mb-1">{{ faq.question }}</p>
                        <p class="text-[11px] text-neutral-400 leading-relaxed">{{ faq.answer }}</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Modal Footer -->
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
                (click)="closeViewModal(); openEditModal(srv)"
              >
                <app-icon name="edit" [size]="14" />
                <span>Edit Package</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirmation -->
      <app-confirm-dialog
        [isOpen]="deleteDialogOpen()"
        title="Delete Service Package"
        [message]="'Are you sure you want to remove ' + (serviceToDelete()?.name || '') + '? This will unlist it from the customer catalog.'"
        confirmText="Delete Package"
        cancelText="Cancel"
        (confirm)="confirmDelete()"
        (cancel)="deleteDialogOpen.set(false)"
      />
    </div>
  `
})
export class AdminServicesComponent {
  private serviceCatalog = inject(ServiceCatalogService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  allServices = this.serviceCatalog.services;
  categories = this.serviceCatalog.categories;

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('ALL');

  showFormModal = signal<boolean>(false);
  editingServiceId = signal<string | null>(null);
  imagePreview = signal<string>('');
  viewingService = signal<CarService | null>(null);

  serviceToDelete = signal<CarService | null>(null);
  deleteDialogOpen = signal<boolean>(false);

  includedItems = signal<string[]>([]);
  commonSymptoms = signal<string[]>([]);
  faqs = signal<{ question: string; answer: string }[]>([]);

  newIncludedItem = signal<string>('');
  newSymptom = signal<string>('');
  newFaqQuestion = signal<string>('');
  newFaqAnswer = signal<string>('');

  activeCount = computed(() => this.allServices().filter(s => s.isActive).length);
  avgStartingRate = computed(() => {
    const list = this.allServices();
    if (!list.length) return 0;
    const sum = list.reduce((acc, s) => acc + s.startingPriceLkr, 0);
    return Math.round(sum / list.length);
  });

  serviceForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    slug: [''],
    category: ['Maintenance', Validators.required],
    startingPriceLkr: [15000, [Validators.required, Validators.min(1000)]],
    durationMinutes: [60, [Validators.required, Validators.min(15)]],
    shortDescription: ['', Validators.required],
    fullDescription: ['', Validators.required],
    imageUrl: ['https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80'],
    featured: [false],
    isActive: [true]
  });

  filteredServices = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.allServices().filter(s => {
      const matchCat = cat === 'ALL' || s.category === cat;
      const matchQ = !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  });

  onNameInput(): void {
    if (!this.editingServiceId()) {
      const name = this.serviceForm.get('name')?.value || '';
      this.serviceForm.patchValue({ slug: this.generateSlug(name) });
    }
  }

  generateSlug(name: string): string {
    return (name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  addIncludedItem(): void {
    const val = this.newIncludedItem().trim();
    if (!val) return;
    this.includedItems.update(list => [...list, val]);
    this.newIncludedItem.set('');
  }

  removeIncludedItem(idx: number): void {
    this.includedItems.update(list => list.filter((_, i) => i !== idx));
  }

  addSymptom(): void {
    const val = this.newSymptom().trim();
    if (!val) return;
    this.commonSymptoms.update(list => [...list, val]);
    this.newSymptom.set('');
  }

  removeSymptom(idx: number): void {
    this.commonSymptoms.update(list => list.filter((_, i) => i !== idx));
  }

  addFaq(): void {
    const q = this.newFaqQuestion().trim();
    const a = this.newFaqAnswer().trim();
    if (!q || !a) {
      this.toast.showError('Please provide both question and answer for the FAQ.');
      return;
    }
    this.faqs.update(list => [...list, { question: q, answer: a }]);
    this.newFaqQuestion.set('');
    this.newFaqAnswer.set('');
  }

  removeFaq(idx: number): void {
    this.faqs.update(list => list.filter((_, i) => i !== idx));
  }

  openViewModal(s: CarService): void {
    this.viewingService.set(s);
  }

  closeViewModal(): void {
    this.viewingService.set(null);
  }

  openAddModal(): void {
    this.editingServiceId.set(null);
    this.imagePreview.set('https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80');
    this.serviceForm.reset({
      name: '',
      slug: '',
      category: 'Maintenance',
      startingPriceLkr: 15000,
      durationMinutes: 60,
      shortDescription: '',
      fullDescription: '',
      imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
      featured: false,
      isActive: true
    });
    this.includedItems.set([
      'Comprehensive 40-point safety & diagnostics inspection',
      'Engine fluid level and density assessment',
      'Electronic scan for fault trouble codes (DTCs)'
    ]);
    this.commonSymptoms.set([
      'Approaching scheduled service mileage interval',
      'Dashboard check engine or service notification'
    ]);
    this.faqs.set([
      {
        question: 'How long does this service package typically take?',
        answer: 'Standard turnaround is 1 to 2 hours within our dedicated hydraulic workshop bays.'
      }
    ]);
    this.newIncludedItem.set('');
    this.newSymptom.set('');
    this.newFaqQuestion.set('');
    this.newFaqAnswer.set('');
    this.showFormModal.set(true);
  }

  openEditModal(s: CarService): void {
    this.editingServiceId.set(s.id);
    this.imagePreview.set(s.imageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80');
    this.serviceForm.patchValue({
      name: s.name,
      slug: s.slug || this.generateSlug(s.name),
      category: s.category,
      startingPriceLkr: s.startingPriceLkr,
      durationMinutes: s.durationMinutes,
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription || s.shortDescription,
      imageUrl: s.imageUrl,
      featured: s.featured ?? false,
      isActive: s.isActive
    });
    this.includedItems.set(s.includedItems ? [...s.includedItems] : []);
    this.commonSymptoms.set(s.commonSymptoms ? [...s.commonSymptoms] : []);
    this.faqs.set(s.faqs ? s.faqs.map(f => ({ ...f })) : []);
    this.newIncludedItem.set('');
    this.newSymptom.set('');
    this.newFaqQuestion.set('');
    this.newFaqAnswer.set('');
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.editingServiceId.set(null);
    this.imagePreview.set('');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > 3 * 1024 * 1024) {
      this.toast.showError('Image file is too large. Please select an image under 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.imagePreview.set(dataUrl);
      this.serviceForm.patchValue({ imageUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  removeImage(fileInput?: HTMLInputElement): void {
    if (fileInput) fileInput.value = '';
    this.imagePreview.set('');
    this.serviceForm.patchValue({ imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80' });
  }

  saveServiceForm(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      this.toast.showError('Please complete all required fields.');
      return;
    }
    const val = this.serviceForm.value;
    const slug = val.slug?.trim() || this.generateSlug(val.name);

    const payload: Omit<CarService, 'id'> = {
      name: val.name.trim(),
      slug: slug,
      category: val.category,
      startingPriceLkr: Number(val.startingPriceLkr),
      durationMinutes: Number(val.durationMinutes),
      shortDescription: val.shortDescription.trim(),
      fullDescription: (val.fullDescription || val.shortDescription).trim(),
      imageUrl: val.imageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
      featured: Boolean(val.featured),
      isActive: Boolean(val.isActive),
      includedItems: this.includedItems(),
      commonSymptoms: this.commonSymptoms(),
      faqs: this.faqs()
    };

    const id = this.editingServiceId();
    if (id) {
      this.serviceCatalog.updateService(id, payload);
      this.toast.showSuccess(`Updated ${val.name} successfully.`);
    } else {
      this.serviceCatalog.addService(payload);
      this.toast.showSuccess(`Added ${val.name} to service catalog.`);
    }

    this.closeFormModal();
  }

  toggleActive(s: CarService): void {
    this.serviceCatalog.updateService(s.id, { isActive: !s.isActive });
    this.toast.showInfo(`${s.name} is now ${!s.isActive ? 'Active' : 'Inactive'}.`);
  }

  requestDelete(s: CarService): void {
    this.serviceToDelete.set(s);
    this.deleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    const s = this.serviceToDelete();
    if (s) {
      this.serviceCatalog.deleteService(s.id);
      this.toast.showSuccess(`Removed ${s.name} from catalog.`);
      this.deleteDialogOpen.set(false);
      this.serviceToDelete.set(null);
    }
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('ALL');
  }
}
