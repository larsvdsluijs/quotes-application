const fs = require('fs');
const path = require('path');

// Read the environment file
const envFile = path.join(__dirname, '../src/environments/environment.prod.ts');
let content = fs.readFileSync(envFile, 'utf8');

// Get environment variables
const envVars = {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
};

// Replace each placeholder with the actual value
Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    content = content.replace(new RegExp(`"${key}"`, 'g'), `"${value}"`);
  }
});

// Write the updated content back to the file
fs.writeFileSync(envFile, content);

console.log('Environment variables replaced successfully!'); 