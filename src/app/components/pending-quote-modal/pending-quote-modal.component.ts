import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quote } from '../../models/quote.model';

@Component({
  selector: 'app-pending-quote-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Stem op deze quote</h3>
            <button 
              (click)="close()"
              class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <blockquote class="text-gray-700 italic mb-2">
              "{{ quote?.text }}"
            </blockquote>
            <p class="text-sm text-gray-600">- {{ quote?.author }}</p>
            <p *ngIf="quote?.category" class="text-xs text-gray-500 mt-1">
              Categorie: {{ quote?.category }}
            </p>
          </div>
          
          <div class="flex justify-center space-x-4">
            <button
              (click)="vote('yes')"
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium">
              👍 Ja
            </button>
            <button
              (click)="vote('no')"
              class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium">
              👎 Nee
            </button>
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-500">
              {{ quote?.votes?.length || 0 }} stemmen gegeven
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PendingQuoteModalComponent {
  @Input() show = false;
  @Input() quote: Quote | null = null;
  @Output() voteSubmitted = new EventEmitter<'yes' | 'no'>();
  @Output() closed = new EventEmitter<void>();

  vote(vote: 'yes' | 'no') {
    this.voteSubmitted.emit(vote);
  }

  close() {
    this.closed.emit();
  }
} 