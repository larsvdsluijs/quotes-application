import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">22 kkr mogolen quotes</h1>
            </div>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Welcome message for logged in users -->
            <div *ngIf="currentUser$ | async as user" class="text-sm text-gray-700 mr-4">
              Welkom, <span class="font-semibold">{{ user.displayName || user.username }}</span>!
            </div>
            
            <button 
                    (click)="router.navigate(['/quotes'])"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
              Quotes
            </button>
            <button *ngIf="isLoggedIn$ | async" 
                    (click)="router.navigate(['/add-quote'])"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
              Quote Toevoegen
            </button>
            <button *ngIf="isLoggedIn$ | async" 
                    (click)="router.navigate(['/pending-quotes'])"
                    class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
              Wachtende Quotes
            </button>
            <button *ngIf="isAdmin$ | async" 
                    (click)="router.navigate(['/admin'])"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
              Admin
            </button>
            <button *ngIf="isLoggedIn$ | async" 
                    (click)="logout()"
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
              Uitloggen
            </button>
            <button *ngIf="!(isLoggedIn$ | async)" 
                    (click)="router.navigate(['/login'])"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
              Inloggen
            </button>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button
              (click)="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <!-- Icon when menu is closed -->
              <svg *ngIf="!mobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Icon when menu is open -->
              <svg *ngIf="mobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div *ngIf="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <!-- Welcome message for logged in users -->
          <div *ngIf="currentUser$ | async as user" class="px-3 py-2 text-sm text-gray-700 border-b border-gray-200">
            Welkom, <span class="font-semibold">{{ user.displayName || user.username }}</span>!
          </div>
          
          <button 
                  (click)="router.navigate(['/quotes']); mobileMenuOpen = false"
                  class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200">
            Quotes
          </button>
          <button *ngIf="isLoggedIn$ | async" 
                  (click)="router.navigate(['/add-quote']); mobileMenuOpen = false"
                  class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200">
            Quote Toevoegen
          </button>
          <button *ngIf="isLoggedIn$ | async" 
                  (click)="router.navigate(['/pending-quotes']); mobileMenuOpen = false"
                  class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200">
            Wachtende Quotes
          </button>
          <button *ngIf="isAdmin$ | async" 
                  (click)="router.navigate(['/admin']); mobileMenuOpen = false"
                  class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200">
            Admin
          </button>
          <button *ngIf="isLoggedIn$ | async" 
                  (click)="logout(); mobileMenuOpen = false"
                  class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200">
            Uitloggen
          </button>
          <button *ngIf="!(isLoggedIn$ | async)" 
                  (click)="router.navigate(['/login']); mobileMenuOpen = false"
                  class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200">
            Inloggen
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  isLoggedIn$;
  isAdmin$;
  currentUser$;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    public router: Router
  ) {
    this.isLoggedIn$ = this.authService.user$;
    this.isAdmin$ = this.authService.isAdmin();
    this.currentUser$ = this.authService.getCurrentUserData();
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
} 