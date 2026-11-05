import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { customerGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. Public Website & Auth Pages
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/public/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/public/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'services/:id',
        loadComponent: () => import('./features/public/service-details/service-details.component').then(m => m.ServiceDetailsComponent)
      },
      {
        path: 'team',
        loadComponent: () => import('./features/public/team/team.component').then(m => m.TeamComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'terms',
        loadComponent: () => import('./features/public/terms/terms.component').then(m => m.TermsComponent)
      },
      {
        path: 'privacy',
        loadComponent: () => import('./features/public/privacy/privacy.component').then(m => m.PrivacyComponent)
      },
      // Auth feature routes lazy loaded
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
      }
    ]
  },

  // 2. Customer Portal Routes
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [customerGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/customer/dashboard/dashboard.component').then(m => m.CustomerDashboardComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/customer/services/customer-services.component').then(m => m.CustomerServicesComponent)
      },
      {
        path: 'book-repair',
        loadComponent: () => import('./features/customer/book-repair/book-repair.component').then(m => m.BookRepairComponent)
      },
      {
        path: 'track-repair',
        loadComponent: () => import('./features/customer/track-repair/track-repair.component').then(m => m.TrackRepairComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/customer/bookings/customer-bookings.component').then(m => m.CustomerBookingsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/customer/profile/profile.component').then(m => m.CustomerProfileComponent)
      }
    ]
  },

  // 3. Admin Dashboard Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/admin/bookings/admin-bookings.component').then(m => m.AdminBookingsComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/admin/services/admin-services.component').then(m => m.AdminServicesComponent)
      },
      {
        path: 'mechanics',
        loadComponent: () => import('./features/admin/mechanics/admin-mechanics.component').then(m => m.AdminMechanicsComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/admin/customers/admin-customers.component').then(m => m.AdminCustomersComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/admin-reports.component').then(m => m.AdminReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/admin-settings.component').then(m => m.AdminSettingsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/admin/profile/admin-profile.component').then(m => m.AdminProfileComponent)
      }
    ]
  },

  // Wildcard fallback
  {
    path: '**',
    redirectTo: ''
  }
];
