import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    // Wait for the initial auth state to be determined
    filter(user => user !== undefined),
    // Add timeout to prevent hanging
    timeout(5000),
    take(1),
    map(user => {
      console.log('AuthGuard: User state:', user);
      if (user) {
        console.log('AuthGuard: User is authenticated, allowing access');
        return true;
      } else {
        console.log('AuthGuard: User is not authenticated, redirecting to login');
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(error => {
      console.error('AuthGuard: Error or timeout, redirecting to login:', error);
      router.navigate(['/login']);
      return of(false);
    })
  );
}; 