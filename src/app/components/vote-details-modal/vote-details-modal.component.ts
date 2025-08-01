import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quote } from '../../models/quote.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-vote-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Stemdetails</h3>
            <button (click)="onClose()" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <!-- Quote Preview -->
            <div class="bg-gray-50 p-3 rounded-md">
              <blockquote class="text-sm text-gray-700 italic">
                "{{ quote?.text }}"
              </blockquote>
              <p class="text-xs text-gray-500 mt-1">— {{ quote?.author }}</p>
            </div>

            <!-- Loading State -->
            <div *ngIf="loading" class="text-center py-4">
              <div class="inline-flex items-center px-3 py-1 text-sm">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Stemdetails laden...
              </div>
            </div>

            <!-- Vote Details -->
            <div *ngIf="!loading" class="space-y-4">
              <!-- Yes Votes -->
              <div>
                <h4 class="text-sm font-medium text-green-700 mb-2 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Ja stemmen ({{ yesVoters.length }})
                </h4>
                <div class="bg-green-50 border border-green-200 rounded-md p-3">
                  <div *ngIf="yesVoters.length === 0" class="text-sm text-green-600">
                    Nog geen ja stemmen
                  </div>
                  <div *ngFor="let voter of yesVoters" class="text-sm text-green-800 mb-1">
                    • {{ voter.displayName || voter.username }}
                  </div>
                </div>
              </div>

              <!-- No Votes -->
              <div>
                <h4 class="text-sm font-medium text-red-700 mb-2 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  Nee stemmen ({{ noVoters.length }})
                </h4>
                <div class="bg-red-50 border border-red-200 rounded-md p-3">
                  <div *ngIf="noVoters.length === 0" class="text-sm text-red-600">
                    Nog geen nee stemmen
                  </div>
                  <div *ngFor="let voter of noVoters" class="text-sm text-red-800 mb-1">
                    • {{ voter.displayName || voter.username }}
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <div class="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div class="text-sm text-gray-700">
                  <div class="flex justify-between">
                    <span>Totaal gestemd:</span>
                    <span class="font-medium">{{ totalVotes }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Goedkeuring:</span>
                    <span class="font-medium">{{ approvalPercentage }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div class="flex justify-end">
              <button
                (click)="onClose()"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Sluiten
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class VoteDetailsModalComponent {
  @Input() show: boolean = false;
  @Input() quote: Quote | null = null;
  @Output() closed = new EventEmitter<void>();

  loading = false;
  yesVoters: User[] = [];
  noVoters: User[] = [];
  totalVotes = 0;
  approvalPercentage = 0;

  constructor(private authService: AuthService) {}

  ngOnChanges() {
    if (this.show && this.quote) {
      this.loadVoteDetails();
    }
  }

  private async loadVoteDetails() {
    this.loading = true;
    
    try {
      // Get all users to map user IDs to names
      const allUsers = await this.authService.getAllUsers().toPromise();
      
      if (this.quote && this.quote.votes) {
        // Separate yes and no votes
        const yesVoteUserIds = this.quote.votes
          .filter(vote => vote.vote === 'yes')
          .map(vote => vote.userId);
        
        const noVoteUserIds = this.quote.votes
          .filter(vote => vote.vote === 'no')
          .map(vote => vote.userId);

        // Map user IDs to user objects
        // The votes use Firebase Auth UID, but user documents use username as ID
        // We need to match by the 'uid' field in user documents (which contains the Firebase Auth UID)
        this.yesVoters = allUsers?.filter(user => 
          yesVoteUserIds.includes(user.uid)
        ) || [];
        this.noVoters = allUsers?.filter(user => 
          noVoteUserIds.includes(user.uid)
        ) || [];
        
        this.totalVotes = this.quote.votes.length;
        this.approvalPercentage = this.totalVotes > 0 
          ? Math.round((this.yesVoters.length / this.totalVotes) * 100) 
          : 0;
      }
    } catch (error) {
      console.error('Error loading vote details:', error);
    } finally {
      this.loading = false;
    }
  }

  onClose() {
    this.closed.emit();
    this.resetData();
  }

  private resetData() {
    this.yesVoters = [];
    this.noVoters = [];
    this.totalVotes = 0;
    this.approvalPercentage = 0;
    this.loading = false;
  }
} 