const fs = require('fs');
const path = require('path');

// Read the index.html file
const indexPath = path.join(__dirname, '../dist/quotes-applictation/browser/index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Replace the base href for GitHub Pages
content = content.replace('<base href="/">', '<base href="/quotes-applictation/">');

// Write the updated content back to the file
fs.writeFileSync(indexPath, content);

console.log('Base href updated for GitHub Pages!'); 