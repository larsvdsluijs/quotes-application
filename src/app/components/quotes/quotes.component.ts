import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { AuthService } from '../../services/auth.service';
import { Quote } from '../../models/quote.model';
import { PendingQuoteModalComponent } from '../pending-quote-modal/pending-quote-modal.component';
import { EditQuoteModalComponent } from '../edit-quote-modal/edit-quote-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, PendingQuoteModalComponent, EditQuoteModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
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
              
              <button *ngIf="isLoggedIn$ | async" 
                      (click)="router.navigate(['/add-quote'])"
                      class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Quote Toevoegen
              </button>
              <button *ngIf="isLoggedIn$ | async" 
                      (click)="router.navigate(['/pending-quotes'])"
                      class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Wachtende Quotes
              </button>
              <button *ngIf="isAdmin$ | async" 
                      (click)="router.navigate(['/admin'])"
                      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Admin
              </button>
              <button *ngIf="isLoggedIn$ | async" 
                      (click)="logout()"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Uitloggen
              </button>
              <button *ngIf="!(isLoggedIn$ | async)" 
                      (click)="router.navigate(['/login'])"
                      class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
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

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-4"> 
              <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Goedgekeurde Quotes 
              </h2>
            </div>
            <div class="flex items-center justify-center mb-4"> 
            <svg class="w-8 h-8 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Bekijk alle quotes die zijn goedgekeurd
            </p>
            <div class="mt-6 flex justify-center">
              <div class="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
                <span class="text-sm font-medium text-indigo-800">{{ quotes.length }} quotes</span>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-16">
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-8 max-w-md mx-auto">
              <div class="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 transition ease-in-out duration-150 cursor-not-allowed">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Quotes laden...
              </div>
              <p class="mt-4 text-sm text-gray-500">Even geduld, we halen de beste quotes op</p>
            </div>
          </div>

          <!-- Quotes Grid -->
          <div *ngIf="!loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div *ngFor="let quote of quotes" 
                 (click)="openEditModal(quote)"
                 class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <blockquote class="text-base text-gray-800 italic leading-relaxed mb-4">
                    "{{ quote.text }}"
                  </blockquote>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-blue-700">— {{ quote.author }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div *ngIf="quote.category" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-800 border border-blue-300">
                        {{ quote.category }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading && quotes.length === 0" class="text-center py-16">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
              <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Geen quotes gevonden</h3>
              <p class="text-sm text-gray-500 mb-6">Er zijn nog geen goedgekeurde quotes beschikbaar.</p>
              <div>
                <button *ngIf="isLoggedIn$ | async"
                        (click)="router.navigate(['/add-quote'])"
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105">
                  <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Eerste quote toevoegen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pending Quote Modal -->
      <app-pending-quote-modal
        [show]="showPendingModal"
        [quote]="currentPendingQuote"
        (voteSubmitted)="onVoteSubmitted($event)"
        (closed)="closePendingModal()">
      </app-pending-quote-modal>

      <!-- Edit Quote Modal -->
      <app-edit-quote-modal
        [show]="showEditModal"
        [quote]="currentEditQuote"
        (quoteUpdated)="onQuoteUpdated($event)"
        (closed)="closeEditModal()">
      </app-edit-quote-modal>
    </div>
  `,
  styles: []
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];
  loading = true;
  isLoggedIn$;
  isAdmin$;
  currentUser$;
  showPendingModal = false;
  currentPendingQuote: Quote | null = null;
  showEditModal = false;
  currentEditQuote: Quote | null = null;
  mobileMenuOpen = false;

  constructor(
    private quoteService: QuoteService,
    private authService: AuthService,
    public router: Router
  ) {
    this.isLoggedIn$ = this.authService.user$;
    this.isAdmin$ = this.authService.isAdmin();
    this.currentUser$ = this.authService.getCurrentUserData();
  }

  ngOnInit() {
    this.loadQuotes();
    this.checkPendingQuotes();
  }

  private loadQuotes() {
    this.quoteService.getApprovedQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading quotes:', error);
        this.loading = false;
      }
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private checkPendingQuotes() {
    // Only check if user is logged in
    this.authService.user$.pipe(take(1)).subscribe((user: any) => {
      if (!user) {
        this.showPendingModal = false;
        this.currentPendingQuote = null;
        return;
      }

      this.quoteService.getPendingQuotes().pipe(take(1)).subscribe({
        next: (pendingQuotes: Quote[]) => {
          console.log('Checking pending quotes for user:', user.uid);
          console.log('Total pending quotes:', pendingQuotes.length);
          
          if (pendingQuotes.length > 0) {
            // Find a quote that the current user hasn't voted on
            const unvotedQuote = pendingQuotes.find((quote: Quote) => {
              // Check if user has already voted on this quote
              const hasVoted = quote.votes?.some((vote: any) => vote.userId === user.uid);
              console.log(`Quote "${quote.text}" - User voted:`, hasVoted);
              return !hasVoted;
            });
            
            if (unvotedQuote) {
              console.log('Showing pending quote modal for:', unvotedQuote.text);
              this.currentPendingQuote = unvotedQuote;
              this.showPendingModal = true;
            } else {
              console.log('No unvoted quotes found for user:', user.uid);
              this.showPendingModal = false;
              this.currentPendingQuote = null;
            }
          } else {
            console.log('No pending quotes available');
            this.showPendingModal = false;
            this.currentPendingQuote = null;
          }
        },
        error: (error) => {
          console.error('Error checking pending quotes:', error);
        }
      });
    });
  }

  async onVoteSubmitted(vote: 'yes' | 'no') {
    if (!this.currentPendingQuote) {
      console.error('No current pending quote to vote on');
      return;
    }
    
    try {
      const quoteId = this.currentPendingQuote.id;
      console.log('Voting on quote:', quoteId, 'with vote:', vote);
      
      // Store the quote ID before closing modal
      const quoteToVote = quoteId;
      
      // Close modal immediately to prevent multiple votes
      this.closePendingModal();
      
      // Vote on the quote using the stored ID
      await this.quoteService.voteOnQuote(quoteToVote, vote);
      
      // Wait a bit for the database to update, then check for more pending quotes
      setTimeout(() => {
        console.log('Checking for more pending quotes after vote...');
        this.checkPendingQuotes();
      }, 2000);
    } catch (error) {
      console.error('Error voting on quote:', error);
    }
  }

  closePendingModal() {
    console.log('Closing pending quote modal');
    this.showPendingModal = false;
    this.currentPendingQuote = null;
  }

  openEditModal(quote: Quote) {
    this.currentEditQuote = quote;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.currentEditQuote = null;
  }

  async onQuoteUpdated(updatedQuote: Quote) {
    try {
      await this.quoteService.updateQuote(updatedQuote);
      console.log('Quote updated and moved back to pending');
      
      // Reload quotes to reflect the changes
      this.loadQuotes();
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  }
} 