import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/quotes', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'debug', loadComponent: () => import('./components/debug-auth/debug-auth.component').then(m => m.DebugAuthComponent) },
  { path: 'quotes', loadComponent: () => import('./components/quotes/quotes.component').then(m => m.QuotesComponent), canActivate: [authGuard] },
  { path: 'add-quote', loadComponent: () => import('./components/add-quote/add-quote.component').then(m => m.AddQuoteComponent), canActivate: [authGuard] },
  { path: 'pending-quotes', loadComponent: () => import('./components/pending-quotes/pending-quotes.component').then(m => m.PendingQuotesComponent), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard, adminGuard] },
  // { path: 'setup', loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '/quotes' }
];
