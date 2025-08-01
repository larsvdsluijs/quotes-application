const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...');

// Step 1: Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build:prod', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Fix base href for GitHub Pages
console.log('🔧 Fixing base href for GitHub Pages...');
try {
  require('./fix-base-href.js');
  console.log('✅ Base href updated successfully');
} catch (error) {
  console.log('⚠️  Could not update base href:', error.message);
}

// Step 3: Deploy to GitHub Pages
console.log('📤 Deploying to GitHub Pages...');
try {
  execSync('npx gh-pages -d dist/quotes-applictation/browser', { stdio: 'inherit' });
  console.log('✅ Deployment completed successfully!');
  console.log('🌐 Your app should be available at: https://[username].github.io/[repository-name]');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('💡 Make sure you have:');
  console.log('   1. GitHub Pages enabled in your repository settings');
  console.log('   2. Proper permissions to push to the repository');
  console.log('   3. gh-pages package installed (run: npm run deploy:setup)');
  process.exit(1);
} 