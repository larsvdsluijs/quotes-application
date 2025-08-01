import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-gray-900">Quotes App</h1>
              </div>
            </div>
            
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-4">
              <!-- Welcome message for logged in users -->
              <div *ngIf="currentUser$ | async as user" class="text-sm text-gray-700 mr-4">
                Welkom, <span class="font-semibold">{{ user.displayName || user.username }}</span>!
              </div>
              
              <a routerLink="/quotes" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Quotes
              </a>
              <a routerLink="/pending-quotes" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Wachtende Quotes
              </a>
              <a routerLink="/add-quote" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Quote Toevoegen
              </a>
              <a *ngIf="isAdmin$ | async" routerLink="/admin" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </a>
              <button *ngIf="isLoggedIn$ | async" 
                      (click)="logout()"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Uitloggen
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
            
            <a routerLink="/quotes" class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Quotes
            </a>
            <a routerLink="/pending-quotes" class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Wachtende Quotes
            </a>
            <a routerLink="/add-quote" class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Quote Toevoegen
            </a>
            <a *ngIf="isAdmin$ | async" routerLink="/admin" class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Admin
            </a>
            <button *ngIf="isLoggedIn$ | async" 
                    (click)="logout()"
                    class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Uitloggen
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Admin Paneel
            </h2>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Beheer gebruikers en quotes
            </p>
          </div>

          <!-- Tabs -->
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button 
                (click)="activeTab = 'users'"
                [class]="activeTab === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Gebruikers
              </button>
              <button 
                (click)="activeTab = 'quotes'"
                [class]="activeTab === 'quotes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Quotes
              </button>
            </nav>
          </div>

          <!-- Users Tab -->
          <div *ngIf="activeTab === 'users'" class="mt-8">
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Gebruikers Beheer
                </h3>

                <!-- Add User Form -->
                <div class="bg-gray-50 p-4 rounded-md mb-6">
                  <h4 class="text-md font-medium text-gray-900 mb-3">Nieuwe Gebruiker Toevoegen</h4>
                  <form (ngSubmit)="addUser()" #userForm="ngForm" class="space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">Gebruikersnaam *</label>
                        <input type="text" id="username" name="username" [(ngModel)]="newUser.username" required
                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      </div>
                      <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord *</label>
                        <input type="password" id="password" name="password" [(ngModel)]="newUser.password" required
                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label for="displayName" class="block text-sm font-medium text-gray-700">Naam</label>
                        <input type="text" id="displayName" name="displayName" [(ngModel)]="newUser.displayName"
                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      </div>
                      <div>
                        <label for="role" class="block text-sm font-medium text-gray-700">Rol *</label>
                        <select id="role" name="role" [(ngModel)]="newUser.role" required
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="user">Gebruiker</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <div class="flex justify-end">
                      <button type="submit" [disabled]="addingUser || !userForm.form.valid"
                              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {{ addingUser ? 'Toevoegen...' : 'Gebruiker Toevoegen' }}
                      </button>
                    </div>
                  </form>
                </div>

                <!-- Users List -->
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <!-- Desktop Table (hidden on mobile) -->
                  <table class="hidden md:table min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gebruikersnaam</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aangemaakt</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr *ngFor="let user of users">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.username }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.displayName || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span [class]="user.role === 'admin' ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'">
                            {{ user.role }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.createdAt | date:'shortDate' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            (click)="deleteUser(user.username)"
                            [disabled]="deletingUser === user.username"
                            class="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Gebruiker verwijderen">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Mobile Cards (visible only on mobile) -->
                  <div class="md:hidden space-y-4 p-4">
                    <div *ngFor="let user of users" 
                         class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                          <h4 class="text-lg font-medium text-gray-900">{{ user.username }}</h4>
                          <p class="text-sm text-gray-500">{{ user.displayName || 'Geen naam' }}</p>
                        </div>
                        <button 
                          (click)="deleteUser(user.username)"
                          [disabled]="deletingUser === user.username"
                          class="flex-shrink-0 ml-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-3 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Gebruiker verwijderen">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                      <div class="flex items-center justify-between">
                        <span [class]="user.role === 'admin' ? 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800' : 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'">
                          {{ user.role }}
                        </span>
                        <span class="text-xs text-gray-500">{{ user.createdAt | date:'shortDate' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quotes Tab -->
          <div *ngIf="activeTab === 'quotes'" class="mt-8">
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quotes Overzicht
                </h3>

                <!-- Statistics -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                  <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                          <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">Pending Quotes</dt>
                            <dd class="text-lg font-medium text-gray-900">{{ pendingQuotesCount }}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <svg class="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                          <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">Goedgekeurde Quotes</dt>
                            <dd class="text-lg font-medium text-gray-900">{{ approvedQuotesCount }}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <svg class="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                          <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">Totaal Gebruikers</dt>
                            <dd class="text-lg font-medium text-gray-900">{{ users.length }}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Quote Management -->
                <div class="space-y-6">
                  <!-- Pending Quotes -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <svg class="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                      Pending Quotes
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div *ngFor="let quote of pendingQuotes" 
                           class="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 border border-orange-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div class="flex justify-between items-start mb-4">
                          <div class="flex-1">
                            <div class="flex items-center mb-3">
                              <div class="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                              <span class="text-xs font-semibold text-orange-600 uppercase tracking-wide">Pending</span>
                            </div>
                            <blockquote class="text-sm text-gray-800 italic leading-relaxed mb-3 text-base">
                              "{{ quote.text }}"
                            </blockquote>
                            <div class="flex items-center justify-between mb-3">
                              <span class="text-sm font-medium text-orange-700">— {{ quote.author }}</span>
                              <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">{{ quote.createdAt | date:'shortDate' }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                              <div class="flex items-center space-x-3">
                                <div class="flex items-center space-x-1">
                                  <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                  </svg>
                                  <span class="text-xs text-orange-600 font-semibold">
                                    {{ quote.votes?.length || 0 }} stemmen
                                  </span>
                                </div>
                                <div *ngIf="quote.category" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-200 text-orange-800 border border-orange-300">
                                  {{ quote.category }}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button 
                            (click)="deleteQuote(quote.id, 'pending_quotes')"
                            class="ml-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200 hover:scale-110"
                            title="Verwijderen">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div *ngIf="pendingQuotes.length === 0" 
                           class="col-span-full text-center py-12">
                        <div class="text-gray-400">
                          <svg class="mx-auto h-16 w-16 mb-4 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                          <p class="text-sm font-medium">Geen pending quotes gevonden</p>
                          <p class="text-xs text-gray-400 mt-1">Nieuwe quotes verschijnen hier</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Approved Quotes -->
                <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Goedgekeurde Quotes
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div *ngFor="let quote of approvedQuotes" 
                           class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 border border-green-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div class="flex justify-between items-start mb-4">
                          <div class="flex-1">
                            <div class="flex items-center mb-3">
                              <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              <span class="text-xs font-semibold text-green-600 uppercase tracking-wide">Goedgekeurd</span>
                            </div>
                            <blockquote class="text-sm text-gray-800 italic leading-relaxed mb-3 text-base">
                              "{{ quote.text }}"
                            </blockquote>
                            <div class="flex items-center justify-between mb-3">
                              <span class="text-sm font-medium text-green-700">— {{ quote.author }}</span>
                              <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">{{ quote.createdAt | date:'shortDate' }}</span>
                            </div>
                            <div *ngIf="quote.category" class="mt-3">
                              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800 border border-green-300">
                                {{ quote.category }}
                              </span>
                            </div>
                          </div>
                          <button 
                            (click)="deleteQuote(quote.id, 'quotes')"
                            class="ml-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200 hover:scale-110"
                            title="Verwijderen">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div *ngIf="approvedQuotes.length === 0" 
                           class="col-span-full text-center py-12">
                        <div class="text-gray-400">
                          <svg class="mx-auto h-16 w-16 mb-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <p class="text-sm font-medium">Geen goedgekeurde quotes gevonden</p>
                          <p class="text-xs text-gray-400 mt-1">Stem op pending quotes om ze goed te keuren</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminComponent implements OnInit {
  activeTab = 'users';
  users: any[] = [];
  recentPendingQuotes: any[] = [];
  pendingQuotes: any[] = [];
  approvedQuotes: any[] = [];
  pendingQuotesCount = 0;
  approvedQuotesCount = 0;
  addingUser = false;
  deletingQuote = false;
  deletingUser = '';
  mobileMenuOpen = false;
  currentUser$;
  isAdmin$;
  isLoggedIn$;

  newUser = {
    username: '',
    password: '',
    displayName: '',
    role: 'user' as 'user' | 'admin'
  };

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
    this.loadUsers();
    this.loadQuotes();
  }

  private loadUsers() {
    // Use AuthService to get all users
    this.authService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        console.log('Loaded users:', users);
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      }
    });
  }

  private loadQuotes() {
    this.quoteService.getPendingQuotes().subscribe({
      next: (quotes) => {
        this.pendingQuotes = quotes;
        this.pendingQuotesCount = quotes.length;
        this.recentPendingQuotes = quotes.slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading pending quotes:', error);
      }
    });

    this.quoteService.getApprovedQuotes().subscribe({
      next: (quotes) => {
        this.approvedQuotes = quotes;
        this.approvedQuotesCount = quotes.length;
      },
      error: (error) => {
        console.error('Error loading approved quotes:', error);
      }
    });
  }

  async deleteQuote(quoteId: string, collection: 'pending_quotes' | 'quotes') {
    if (!confirm('Weet je zeker dat je deze quote wilt verwijderen?')) {
      return;
    }

    this.deletingQuote = true;
    try {
      await this.quoteService.deleteQuote(quoteId, collection);
      console.log('Quote deleted successfully');
      this.loadQuotes(); // Reload quotes after deletion
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      alert(`Fout bij verwijderen quote: ${error.message}`);
    } finally {
      this.deletingQuote = false;
    }
  }

  async addUser() {
    if (!this.newUser.username || !this.newUser.password) {
      console.error('Missing username or password');
      return;
    }

    this.addingUser = true;
    try {
      console.log('Adding user:', this.newUser);
      
      await this.authService.createUserAsAdmin(this.newUser);
      console.log('User added successfully');
      
      // Show success message
      alert('Gebruiker succesvol aangemaakt!');
      
      this.newUser = {
        username: '',
        password: '',
        displayName: '',
        role: 'user'
      };
      
      // Reload users list
      this.loadUsers();
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(`Fout bij aanmaken gebruiker: ${error.message}`);
    } finally {
      this.addingUser = false;
    }
  }

  async deleteUser(username: string) {
    if (!confirm(`Weet je zeker dat je de gebruiker "${username}" wilt verwijderen?`)) {
      return;
    }

    this.deletingUser = username;
    try {
      await this.authService.deleteUser(username);
      console.log('User deleted successfully');
      this.loadUsers(); // Reload users after deletion
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`Fout bij verwijderen gebruiker: ${error.message}`);
    } finally {
      this.deletingUser = '';
    }
  }

  async logout() {
    if (confirm('Weet je zeker dat je wilt uitloggen?')) {
      try {
        await this.authService.logout();
        console.log('User logged out successfully');
        this.router.navigate(['/login']); // Redirect to login page
      } catch (error: any) {
        console.error('Error logging out:', error);
        alert(`Fout bij uitloggen: ${error.message}`);
      }
    }
  }
} 