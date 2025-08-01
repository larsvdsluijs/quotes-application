import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { AuthService } from '../../services/auth.service';
import { Quote } from '../../models/quote.model';
import { VoteDetailsModalComponent } from '../vote-details-modal/vote-details-modal.component';
import { NavbarComponent } from '../shared/navbar.component';

@Component({
  selector: 'app-pending-quotes',
  standalone: true,
  imports: [CommonModule, RouterModule, VoteDetailsModalComponent, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <app-navbar></app-navbar>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Wachtende Quotes
            </h2>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Stem op quotes die wachten op goedkeuring
            </p>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-12">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Quotes laden...
            </div>
          </div>

          <!-- Quotes Grid -->
          <div *ngIf="!loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div *ngFor="let quote of quotes" 
                 class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <blockquote class="text-lg text-gray-900 mb-4">
                  "{{ quote.text }}"
                </blockquote>
                <div class="mb-4">
                  <p class="text-sm font-medium text-gray-900">— {{ quote.author }}</p>
                  <p *ngIf="quote.category" class="text-sm text-gray-500">{{ quote.category }}</p>
                  <p *ngIf="quote.date" class="text-sm text-gray-500">{{ quote.date | date:'shortDate' }}</p>
                  <p class="text-xs text-gray-500 mt-2">
                    Toegevoegd op {{ quote.createdAt | date:'shortDate' }}
                  </p>
                </div>

                <!-- Vote Statistics -->
                <div class="mb-4 p-3 bg-gray-50 rounded-md">
                  <div class="flex justify-between text-sm">
                    <span class="text-green-600 font-medium">
                      Ja: {{ getYesVotes(quote) }}
                    </span>
                    <span class="text-red-600 font-medium">
                      Nee: {{ getNoVotes(quote) }}
                    </span>
                  </div>
                  <div class="mt-2">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-green-600 h-2 rounded-full" 
                           [style.width.%]="getApprovalPercentage(quote)"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ getApprovalPercentage(quote) | number:'1.0-0' }}% goedkeuring
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ getTotalVotes(quote) }} van {{ totalUsers }} gebruikers hebben gestemd
                    </p>
                  </div>
                  <!-- View Votes Button -->
                  <button 
                    (click)="openVoteDetails(quote)"
                    class="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-200 border border-blue-200">
                    <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Bekijk stemmen
                  </button>
                </div>

                <!-- Vote Buttons -->
                <div class="flex space-x-2">
                  <button 
                    (click)="voteOnQuote(quote.id, 'yes')"
                    [disabled]="voting"
                    class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-3 py-2 rounded-md text-sm font-medium disabled:cursor-not-allowed">
                    <svg *ngIf="voting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ja
                  </button>
                  <button 
                    (click)="voteOnQuote(quote.id, 'no')"
                    [disabled]="voting"
                    class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-2 rounded-md text-sm font-medium disabled:cursor-not-allowed">
                    <svg *ngIf="voting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Nee
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading && quotes.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Geen pending quotes</h3>
            <p class="mt-1 text-sm text-gray-500">Er zijn momenteel geen quotes die wachten op goedkeuring.</p>
            <div class="mt-6">
              <button (click)="router.navigate(['/add-quote'])"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Quote toevoegen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vote Details Modal -->
    <app-vote-details-modal
      [show]="showVoteDetailsModal"
      [quote]="selectedQuote"
      (closed)="closeVoteDetails()">
    </app-vote-details-modal>
  `,
  styles: []
})
export class PendingQuotesComponent implements OnInit {
  quotes: Quote[] = [];
  loading = true;
  voting = false;
  mobileMenuOpen = false;
  currentUser$;
  isAdmin$;
  isLoggedIn$;
  totalUsers: number = 0;
  selectedQuote: Quote | null = null;
  showVoteDetailsModal = false;

  constructor(
    private quoteService: QuoteService,
    private authService: AuthService,
    public router: Router
  ) {
    this.currentUser$ = this.authService.getCurrentUserData();
    this.isAdmin$ = this.authService.isAdmin();
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.loadQuotes();
    this.getTotalUsers().then(total => this.totalUsers = total);
  }

  private loadQuotes() {
    this.quoteService.getPendingQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending quotes:', error);
        this.loading = false;
      }
    });
  }

  async voteOnQuote(quoteId: string, vote: 'yes' | 'no') {
    this.voting = true;
    try {
      await this.quoteService.voteOnQuote(quoteId, vote);
    } catch (error) {
      console.error('Error voting on quote:', error);
    } finally {
      this.voting = false;
    }
  }

  getYesVotes(quote: Quote): number {
    return quote.votes.filter(v => v.vote === 'yes').length;
  }

  getNoVotes(quote: Quote): number {
    return quote.votes.filter(v => v.vote === 'no').length;
  }

  getApprovalPercentage(quote: Quote): number {
    const yesVotes = this.getYesVotes(quote);
    const totalVotes = (quote.votes || []).length;
    return totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  }

  getTotalVotes(quote: Quote): number {
    return (quote.votes || []).length;
  }

  async getTotalUsers(): Promise<number> {
    try {
      return await this.quoteService.getTotalUsersCount();
    } catch (error) {
      console.error('Error getting total users:', error);
      return 1;
    }
  }

  async hasVoted(quote: Quote): Promise<boolean> {
    const currentUser = await this.authService.user$.pipe().toPromise();
    return quote.votes.some(v => v.userId === currentUser?.uid);
  }

  async hasVotedYes(quote: Quote): Promise<boolean> {
    const currentUser = await this.authService.user$.pipe().toPromise();
    return quote.votes.some(v => v.userId === currentUser?.uid && v.vote === 'yes');
  }

  async hasVotedNo(quote: Quote): Promise<boolean> {
    const currentUser = await this.authService.user$.pipe().toPromise();
    return quote.votes.some(v => v.userId === currentUser?.uid && v.vote === 'no');
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  openVoteDetails(quote: Quote) {
    this.selectedQuote = quote;
    this.showVoteDetailsModal = true;
  }

  closeVoteDetails() {
    this.selectedQuote = null;
    this.showVoteDetailsModal = false;
  }
} 