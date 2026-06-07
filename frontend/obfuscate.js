import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      let finalDestPath = destPath;
      if (entry.name.endsWith('.js')) {
        finalDestPath = destPath + '.safe';
      } else if (entry.name.endsWith('.mjs')) {
        finalDestPath = destPath + '.safe';
      }
      fs.copyFileSync(srcPath, finalDestPath);
    }
  }
}

console.log('Obfuscating build directory...');
if (fs.existsSync('next_safe')) {
  fs.rmSync('next_safe', { recursive: true, force: true });
}
copyDir('.next', 'next_safe');
console.log('Obfuscation complete! Please zip the "next_safe" folder and upload it.');
