import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-debug-auth',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 class="text-lg font-bold mb-2">Debug Authentication State</h3>
      <div class="space-y-2">
        <div><strong>Firebase User:</strong> {{ firebaseUser$ | async | json }}</div>
        <div><strong>Is Logged In:</strong> {{ isLoggedIn$ | async }}</div>
        <div><strong>Current User Data:</strong> {{ currentUser$ | async | json }}</div>
        <div><strong>Is Admin:</strong> {{ isAdmin$ | async }}</div>
      </div>
      <button (click)="logout()" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Force Logout
      </button>
    </div>
  `
})
export class DebugAuthComponent implements OnInit {
  firebaseUser$;
  isLoggedIn$;
  currentUser$;
  isAdmin$;

  constructor(private authService: AuthService) {
    this.firebaseUser$ = this.authService.user$;
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.currentUser$ = this.authService.getCurrentUserData();
    this.isAdmin$ = this.authService.isAdmin();
  }

  ngOnInit() {
    console.log('DebugAuthComponent: Component initialized');
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('DebugAuthComponent: Force logout completed');
    } catch (error) {
      console.error('DebugAuthComponent: Logout error:', error);
    }
  }
} 