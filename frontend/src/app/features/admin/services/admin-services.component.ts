import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
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

              <!-- 3. Visibility Status -->
              <div class="space-y-4">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium pb-1 border-b border-[#222222]">
                  3. Visibility Status
                </h4>
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
                  [disabled]="serviceForm.invalid || isSaving()"
                  class="px-5 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  @if (isSaving()) {
                    <span class="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  }
                  <span>{{ isSaving() ? 'Saving...' : (editingServiceId() ? 'Save Changes' : 'Create Package') }}</span>
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
              <!-- Package Overview Header Card (No Image) -->
              <div class="rounded-xl border border-[#262526] bg-[#1c1b1c] p-5">
                <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-oxanium bg-[#d70006] text-white">
                      {{ srv.category }}
                    </span>
                    <span
                      class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      [ngClass]="srv.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'"
                    >
                      {{ srv.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141314] border border-[#262526] text-xs font-semibold text-neutral-200">
                    <app-icon name="clock" [size]="14" strokeColor="#d70006" />
                    <span>{{ srv.durationMinutes }} mins avg turnaround</span>
                  </div>
                </div>
                <div>
                  <span class="text-[11px] text-neutral-400 block">Starting Estimate</span>
                  <span class="text-xl sm:text-2xl font-bold font-oxanium text-white">LKR {{ srv.startingPriceLkr | number }}</span>
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
export class AdminServicesComponent implements OnInit {
  private serviceCatalog = inject(ServiceCatalogService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  allServices = this.serviceCatalog.services;
  categories = this.serviceCatalog.categories;

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('ALL');

  isSaving = signal<boolean>(false);
  showFormModal = signal<boolean>(false);
  editingServiceId = signal<string | null>(null);
  viewingService = signal<CarService | null>(null);

  serviceToDelete = signal<CarService | null>(null);
  deleteDialogOpen = signal<boolean>(false);

  includedItems = signal<string[]>([]);
  commonSymptoms = signal<string[]>([]);

  newIncludedItem = signal<string>('');
  newSymptom = signal<string>('');

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

  ngOnInit(): void {
    this.serviceCatalog.loadServices(false).subscribe({
      error: () => this.toast.showError('Could not sync latest services from backend.')
    });
  }

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

  openViewModal(s: CarService): void {
    this.viewingService.set(s);
  }

  closeViewModal(): void {
    this.viewingService.set(null);
  }

  openAddModal(): void {
    this.editingServiceId.set(null);
    this.serviceForm.reset({
      name: '',
      slug: '',
      category: 'Maintenance',
      startingPriceLkr: 15000,
      durationMinutes: 60,
      shortDescription: '',
      fullDescription: '',
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
    this.newIncludedItem.set('');
    this.newSymptom.set('');
    this.showFormModal.set(true);
  }

  openEditModal(s: CarService): void {
    this.editingServiceId.set(s.id);
    this.serviceForm.patchValue({
      name: s.name,
      slug: s.slug || this.generateSlug(s.name),
      category: s.category,
      startingPriceLkr: s.startingPriceLkr,
      durationMinutes: s.durationMinutes,
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription || s.shortDescription,
      featured: s.featured ?? false,
      isActive: s.isActive
    });
    this.includedItems.set(s.includedItems ? [...s.includedItems] : []);
    this.commonSymptoms.set(s.commonSymptoms ? [...s.commonSymptoms] : []);
    this.newIncludedItem.set('');
    this.newSymptom.set('');
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.editingServiceId.set(null);
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
      featured: Boolean(val.featured),
      isActive: Boolean(val.isActive),
      includedItems: this.includedItems(),
      commonSymptoms: this.commonSymptoms()
    };

    const id = this.editingServiceId();
    this.isSaving.set(true);

    if (id) {
      this.serviceCatalog.updateService(id, payload).subscribe({
        next: (saved) => {
          this.isSaving.set(false);
          this.toast.showSuccess(`Updated ${saved.name} successfully.`);
          this.closeFormModal();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Failed to update service.';
          this.toast.showError(msg);
        }
      });
    } else {
      this.serviceCatalog.createService(payload).subscribe({
        next: (created) => {
          this.isSaving.set(false);
          this.toast.showSuccess(`Added ${created.name} to service catalog.`);
          this.closeFormModal();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Failed to create service.';
          this.toast.showError(msg);
        }
      });
    }
  }

  toggleActive(s: CarService): void {
    this.serviceCatalog.updateService(s.id, { isActive: !s.isActive }).subscribe({
      next: () => {
        this.toast.showInfo(`${s.name} is now ${!s.isActive ? 'Active' : 'Inactive'}.`);
      },
      error: () => {
        this.toast.showError(`Failed to update status for ${s.name}.`);
      }
    });
  }

  requestDelete(s: CarService): void {
    this.serviceToDelete.set(s);
    this.deleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    const s = this.serviceToDelete();
    if (s) {
      this.serviceCatalog.deleteService(s.id).subscribe({
        next: () => {
          this.toast.showSuccess(`Removed ${s.name} from catalog.`);
          this.deleteDialogOpen.set(false);
          this.serviceToDelete.set(null);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Failed to remove service from catalog.';
          this.toast.showError(msg);
        }
      });
    }
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('ALL');
  }
}
