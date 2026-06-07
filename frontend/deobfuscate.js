import fs from 'fs';
import path from 'path';

function restoreDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      restoreDir(srcPath, destPath);
    } else {
      let finalDestPath = destPath;
      if (entry.name.endsWith('.safe')) {
        finalDestPath = destPath.slice(0, -5); // Remove ".safe" extension
      }
      fs.copyFileSync(srcPath, finalDestPath);
    }
  }
}

console.log('Restoring .next directory...');
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
}
restoreDir('next_safe', '.next');
console.log('Restoration complete! Cleaning up...');
fs.rmSync('next_safe', { recursive: true, force: true });
console.log('Success! Your .next directory is restored.');
