# Quotes Application

Een Angular webapplicatie voor het beheren van quotes met Firebase backend. Gebruikers kunnen quotes toevoegen, stemmen op quotes, en alleen goedgekeurde quotes worden getoond.

## 🚀 Functionaliteiten

### Authenticatie en Gebruikersbeheer
- Firebase Authentication voor login en registratie
- Admin paneel voor gebruikersbeheer
- Rollen: Admin en Gebruiker

### Quote Management
- Gebruikers kunnen quotes toevoegen met:
  - Quote tekst
  - Auteur
  - Categorie (optioneel)
  - Datum (optioneel)
- Quotes worden eerst opgeslagen als "pending"

### Stemmechanisme
- Elke ingelogde gebruiker kan stemmen (ja/nee) op pending quotes
- Quotes worden goedgekeurd bij 50%+ ja-stemmen
- Realtime updates bij stemmen

### Admin Paneel
- Gebruikers aanmaken en beheren
- Quotes en stemmen bekijken
- Statistieken overzicht

## 🛠️ Technologieën

- **Frontend**: Angular 18
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: Tailwind CSS
- **State Management**: RxJS Observables

## 📦 Firebase Structuur

### Collecties
- `/users` - Gebruikersgegevens incl. rol
- `/quotes` - Goedgekeurde quotes
- `/pending_quotes` - Quotes in afwachting van stemmen

## 🚀 Setup Instructies

### 1. Firebase Project Setup

1. Ga naar [Firebase Console](https://console.firebase.google.com/)
2. Maak een nieuw project aan
3. Schakel Authentication in met Email/Password
4. Maak een Firestore database aan
5. Kopieer je Firebase configuratie

### 2. Firebase Configuratie

Update `src/environments/environment.ts` met je Firebase configuratie:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  }
};
```

### 3. Firestore Security Rules

Stel de volgende security rules in voor je Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
               // Users collection
           match /users/{username} {
             allow read: if true;
             allow write: if request.auth != null;
           }
    
    // Pending quotes collection
    match /pending_quotes/{quoteId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Approved quotes collection
    match /quotes/{quoteId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

### 4. Installatie

```bash
# Installeer dependencies
npm install

# Start development server
npm start
```

De applicatie is nu beschikbaar op `http://localhost:4200`

## 👥 Gebruik

### Eerste Setup
1. Log in als admin (maak eerst een admin gebruiker aan via Firebase Console)
2. Ga naar het Admin paneel
3. Voeg gebruikers toe via het admin paneel

### Dagelijks Gebruik
1. **Bekijk Quotes**: Ga naar de hoofdpagina om goedgekeurde quotes te zien
2. **Voeg Quote Toe**: Klik op "Quote Toevoegen" (alleen voor ingelogde gebruikers)
3. **Stem op Quotes**: Ga naar "Pending Quotes" om te stemmen
4. **Admin Beheer**: Gebruik het admin paneel voor gebruikersbeheer

## 🔧 Development

### Project Structuur
```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── quotes/
│   │   ├── add-quote/
│   │   ├── pending-quotes/
│   │   └── admin/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── quote.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── quote.model.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   └── app.component.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.css
```

### Build voor Productie
```bash
npm run build
```

### Deploy naar Firebase Hosting
```bash
# Installeer Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialiseer project
firebase init hosting

# Deploy
firebase deploy
```

## 🔒 Beveiliging

- Firebase Security Rules voor database toegang
- Route guards voor beveiligde pagina's
- Admin-only toegang voor gebruikersbeheer
- Input validatie op alle formulieren

## 🎨 UI/UX Features

- Responsive design met Tailwind CSS
- Loading states en error handling
- Realtime updates
- Intuïtieve navigatie
- Moderne, clean interface

## 📝 Toekomstige Verbeteringen

- [ ] Email notificaties bij quote goedkeuring
- [ ] Quote categorieën filteren
- [ ] Zoekfunctionaliteit
- [ ] Quote favorieten
- [ ] Gebruiker profielen
- [ ] Quote statistieken
- [ ] Mobile app

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is gelicenseerd onder de MIT License.

## 🆘 Support

Voor vragen of problemen, open een issue in de repository.
