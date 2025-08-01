export const environment = {
  production: true,
  firebase: {
    apiKey: process.env['FIREBASE_API_KEY'] || "AIzaSyBqsizLRacxgdF4IZd0W3lI9t3DU31sMJs",
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || "test-database-faa54.firebaseapp.com",
    projectId: process.env['FIREBASE_PROJECT_ID'] || "test-database-faa54",
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || "test-database-faa54.firebasestorage.app",
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || "561906414923",
    appId: process.env['FIREBASE_APP_ID'] || "1:561906414923:web:c5f911d0009a914260a4ce",
    measurementId: process.env['FIREBASE_MEASUREMENT_ID'] || "G-VYER9XFZSW"
  }
}; 