import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ChangePasswordComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log in op je account
          </h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onLogin()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">Gebruikersnaam</label>
              <input id="username" name="username" type="text" required 
                     [(ngModel)]="username"
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                     placeholder="Gebruikersnaam">
            </div>
            <div class="relative">
              <label for="password" class="sr-only">Wachtwoord</label>
              <input id="password" name="password" [type]="showPassword ? 'text' : 'password'" required 
                     [(ngModel)]="password"
                     class="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                     placeholder="Wachtwoord">
              <button 
                type="button"
                (click)="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                <svg *ngIf="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg *ngIf="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <button type="submit" 
                    [disabled]="loading"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              {{ loading ? 'Bezig met inloggen...' : 'Inloggen' }}
            </button>
          </div>

          <div *ngIf="error" class="text-red-600 text-center">
            {{ error }}
          </div>
        </form>
      </div>
    </div>

    <!-- Change Password Modal -->
    <app-change-password 
      [show]="showChangePassword"
      (passwordChanged)="onPasswordChanged()"
      (closed)="onPasswordModalClosed()">
    </app-change-password>
  `,
  styles: []
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';
  showChangePassword = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.username || !this.password) {
      this.error = 'Vul alle velden in';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const result = await this.authService.login(this.username, this.password);
      
      if (result.needsPasswordChange) {
        // Show password change modal
        this.showChangePassword = true;
      } else {
        // Normal login flow
        this.router.navigate(['/quotes']);
      }
    } catch (error: any) {
      this.error = error.message || 'Inloggen mislukt';
    } finally {
      this.loading = false;
    }
  }

  onPasswordChanged() {
    this.showChangePassword = false;
    // Navigate to quotes after password change
    this.router.navigate(['/quotes']);
  }

  onPasswordModalClosed() {
    this.showChangePassword = false;
  }
} 