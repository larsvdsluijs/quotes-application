# Quotes Application

Een Angular applicatie voor het beheren en stemmen op quotes met Firebase backend.

## Setup

### Firebase Configuratie

1. Maak een Firebase project aan
2. Voeg Authentication toe (Email/Password)
3. Voeg Firestore Database toe
4. Kopieer de Firebase configuratie naar `src/environments/environment.ts`

### Firestore Security Rules

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

## Development

```bash
npm install
ng serve
```

## Deployment naar GitHub Pages

### 1. GitHub Secrets instellen

Ga naar je GitHub repository → Settings → Secrets and variables → Actions en voeg de volgende secrets toe:

- `FIREBASE_API_KEY`: Je Firebase API Key
- `FIREBASE_AUTH_DOMAIN`: Je Firebase Auth Domain
- `FIREBASE_PROJECT_ID`: Je Firebase Project ID
- `FIREBASE_STORAGE_BUCKET`: Je Firebase Storage Bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Je Firebase Messaging Sender ID
- `FIREBASE_APP_ID`: Je Firebase App ID
- `FIREBASE_MEASUREMENT_ID`: Je Firebase Measurement ID

### 2. GitHub Pages activeren

1. Ga naar je repository → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "gh-pages" (wordt automatisch aangemaakt door de workflow)
4. Save

### 3. Deployen

Push naar de `main` branch en de GitHub Actions workflow zal automatisch:
1. De applicatie builden met de environment variables
2. Deployen naar GitHub Pages

### 4. Veiligheid

- ✅ API keys worden niet geëxposeerd in de code
- ✅ Environment variables worden gebruikt in de build
- ✅ Firebase security rules beschermen de data
- ✅ GitHub Actions workflow is veilig geconfigureerd

## Features

- ✅ Username-based login
- ✅ Quote toevoegen en bewerken
- ✅ Community voting systeem
- ✅ Admin panel voor gebruikersbeheer
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Veilige deployment
