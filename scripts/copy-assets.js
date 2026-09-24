import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy static folders to dist for complete standalone production hosting
copyDirSync(path.join(rootDir, 'data'), path.join(distDir, 'data'));
copyDirSync(path.join(rootDir, 'js'), path.join(distDir, 'js'));
copyDirSync(path.join(rootDir, 'css'), path.join(distDir, 'css'));

console.log('[EngiQuiz Build] Successfully copied data, js, and css assets to dist.');
