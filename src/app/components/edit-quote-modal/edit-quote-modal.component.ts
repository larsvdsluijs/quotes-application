import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Quote } from '../../models/quote.model';

@Component({
  selector: 'app-edit-quote-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Quote Bewerken</h3>
            <button (click)="onClose()" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form (ngSubmit)="onSubmit()" #editForm="ngForm">
            <div class="space-y-4">
              <!-- Quote Text -->
              <div>
                <label for="text" class="block text-sm font-medium text-gray-700">
                  Quote *
                </label>
                <textarea
                  id="text"
                  name="text"
                  rows="4"
                  [(ngModel)]="editedQuote.text"
                  required
                  class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Voer hier je quote in..."></textarea>
              </div>

              <!-- Author -->
              <div>
                <label for="author" class="block text-sm font-medium text-gray-700">
                  Auteur *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  [(ngModel)]="editedQuote.author"
                  required
                  class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Naam van de persoon die dit gezegd heeft">
              </div>

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
                      Quote succesvol bijgewerkt!
                    </h3>
                    <div class="mt-2 text-sm text-green-700">
                      De quote is bijgewerkt en wacht nu opnieuw op goedkeuring van de community.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  (click)="onClose()"
                  class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Annuleren
                </button>
                <button
                  type="submit"
                  [disabled]="loading || !editForm.form.valid"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'Bezig met bijwerken...' : 'Quote Bijwerken' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EditQuoteModalComponent {
  @Input() show: boolean = false;
  @Input() quote: Quote | null = null;
  @Output() quoteUpdated = new EventEmitter<Quote>();
  @Output() closed = new EventEmitter<void>();

  editedQuote: Partial<Quote> = {};
  loading = false;
  error = '';
  success = false;

  ngOnChanges() {
    if (this.quote) {
      this.editedQuote = {
        text: this.quote.text,
        author: this.quote.author
      };
    }
  }

  onSubmit() {
    if (!this.quote || !this.editedQuote.text || !this.editedQuote.author) {
      this.error = 'Vul alle verplichte velden in';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    // Create updated quote object
    const updatedQuote: Quote = {
      ...this.quote,
      text: this.editedQuote.text!,
      author: this.editedQuote.author!,
      // Reset votes since it's going back to pending
      votes: []
    };

    this.quoteUpdated.emit(updatedQuote);
    this.success = true;
    
    // Close modal after 2 seconds
    setTimeout(() => {
      this.onClose();
    }, 2000);
  }

  onClose() {
    this.closed.emit();
    this.resetForm();
  }

  private resetForm() {
    this.editedQuote = {};
    this.loading = false;
    this.error = '';
    this.success = false;
  }
} 