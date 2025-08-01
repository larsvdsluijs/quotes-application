import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Wachtwoord Wijzigen
          </h3>
          <p class="text-sm text-gray-500 mb-6">
            Je moet je wachtwoord wijzigen voordat je verder kunt gaan.
          </p>
          
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Nieuw Wachtwoord
              </label>
              <input
                type="password"
                id="newPassword"
                [(ngModel)]="newPassword"
                name="newPassword"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Voer je nieuwe wachtwoord in">
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Bevestig Nieuw Wachtwoord
              </label>
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Bevestig je nieuwe wachtwoord">
            </div>
            
            <div *ngIf="errorMessage" class="text-red-600 text-sm">
              {{ errorMessage }}
            </div>
            
            <div class="flex space-x-3 mt-6">
              <button
                type="submit"
                [disabled]="loading"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                <span *ngIf="!loading">Wachtwoord Wijzigen</span>
                <span *ngIf="loading">Bezig...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ChangePasswordComponent {
  @Input() show: boolean = false;
  @Output() passwordChanged = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.errorMessage = '';
    
    // Validatie
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Vul alle velden in';
      return;
    }
    
    if (this.newPassword.length < 6) {
      this.errorMessage = 'Nieuw wachtwoord moet minimaal 6 karakters bevatten';
      return;
    }
    
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Nieuwe wachtwoorden komen niet overeen';
      return;
    }

    this.loading = true;
    
    this.authService.changePasswordFirstTime(this.newPassword)
      .then(() => {
        this.loading = false;
        this.passwordChanged.emit();
        this.resetForm();
      })
      .catch((error: any) => {
        this.loading = false;
        this.errorMessage = error.message || 'Er is een fout opgetreden bij het wijzigen van het wachtwoord';
      });
  }

  private resetForm() {
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }
} 