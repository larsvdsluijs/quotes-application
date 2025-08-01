import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { QuoteCreate } from '../../models/quote.model';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-quote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <app-navbar></app-navbar>

      <!-- Main Content -->
      <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Quote Toevoegen
            </h2>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Voeg een nieuwe quote toe die door de community gestemd kan worden
            </p>
          </div>

          <div class="bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <form (ngSubmit)="onSubmit()" #quoteForm="ngForm">
                <div class="space-y-6">
                  <!-- Quote Text -->
                  <div>
                    <label for="text" class="block text-sm font-medium text-gray-700">
                      Quote *
                    </label>
                    <div class="mt-1">
                      <textarea
                        id="text"
                        name="text"
                        rows="4"
                        [(ngModel)]="quoteData.text"
                        required
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Voer hier je quote in..."></textarea>
                    </div>
                    <p class="mt-2 text-sm text-gray-500">
                      De quote die je wilt toevoegen aan de collectie.
                    </p>
                  </div>

                  <!-- Author -->
                  <div>
                    <label for="author" class="block text-sm font-medium text-gray-700">
                      Persoon *
                    </label>
                    <div class="mt-1">
                      <input
                        type="text"
                        id="author"
                        name="author"
                        [(ngModel)]="quoteData.author"
                        required
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                    </div>
                    <p class="mt-2 text-sm text-gray-500">
                      De naam van de persoon die de quote heeft uitgesproken.
                    </p>
                  </div>

                  <!-- Category -->
                  <!-- <div>
                    <label for="category" class="block text-sm font-medium text-gray-700">
                      Categorie (optioneel)
                    </label>
                    <div class="mt-1">
                      <input
                        type="text"
                        id="category"
                        name="category"
                        [(ngModel)]="quoteData.category"
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="bijv. Motivatie, Humor, Filosofie">
                    </div>
                    <p class="mt-2 text-sm text-gray-500">
                      Een categorie om de quote te organiseren (optioneel).
                    </p>
                  </div> -->

                  <!-- Date -->
                  <!-- <div>
                    <label for="date" class="block text-sm font-medium text-gray-700">
                      Datum (optioneel)
                    </label>
                    <div class="mt-1">
                      <input
                        type="date"
                        id="date"
                        name="date"
                        [(ngModel)]="quoteData.date"
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                    </div>
                    <p class="mt-2 text-sm text-gray-500">
                      De datum waarop de quote is uitgesproken (optioneel).
                    </p>
                  </div> -->

                  <!-- Error Message -->
                  <div *ngIf="error" class="rounded-md bg-red-50 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">
                          Er is een fout opgetreden
                        </h3>
                        <div class="mt-2 text-sm text-red-700">
                          {{ error }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Success Message -->
                  <div *ngIf="success" class="rounded-md bg-green-50 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-green-800">
                          Quote succesvol toegevoegd!
                        </h3>
                        <div class="mt-2 text-sm text-green-700">
                          Je quote is toegevoegd en wacht nu op goedkeuring van de community.
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="flex justify-end">
                    <button
                      type="button"
                      (click)="router.navigate(['/quotes'])"
                      class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      [disabled]="loading || !quoteForm.form.valid"
                      class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ loading ? 'Bezig met toevoegen...' : 'Quote Toevoegen' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AddQuoteComponent {
  quoteData: QuoteCreate = {
    text: '',
    author: '',
    category: '',
    date: undefined
  };
  loading = false;
  error = '';
  success = false;
  mobileMenuOpen = false;
  isAdmin$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private quoteService: QuoteService,
    public router: Router,
    private authService: AuthService
  ) {
    this.isAdmin$ = this.authService.isAdmin();
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  async onSubmit() {
    if (!this.quoteData.text || !this.quoteData.author) {
      this.error = 'Vul alle verplichte velden in';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    try {
      await this.quoteService.addQuote(this.quoteData);
      this.success = true;
      this.quoteData = {
        text: '',
        author: '',
        category: '',
        date: undefined
      };
      
      // Redirect after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/quotes']);
      }, 2000);
    } catch (error: any) {
      this.error = error.message || 'Er is een fout opgetreden bij het toevoegen van de quote';
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 