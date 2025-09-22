import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to update
const filesToUpdate = [
  'frontend/app/register/page.js',
  'frontend/app/quiz/page.js',
  'frontend/app/dashboard/page.js',
  'frontend/app/recommendations/page.js',
  'frontend/app/profile/page.js',
  'frontend/app/timeline/page.js',
  'frontend/app/colleges/page.js',
  'frontend/app/courses/page.js'
];

// Pattern to find and replace
const oldPattern = /'http:\/\/localhost:4000'/g;
const newPattern = "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`";

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace the pattern
    const updatedContent = content.replace(oldPattern, newPattern);

    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No changes needed: ${filePath}`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('API URL update complete!');