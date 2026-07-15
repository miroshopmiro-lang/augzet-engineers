const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../admin/static');
const destDir = path.join(__dirname, '../static');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const srcElement = path.join(from, element);
    const destElement = path.join(to, element);
    if (fs.lstatSync(srcElement).isDirectory()) {
      copyFolderSync(srcElement, destElement);
    } else {
      fs.copyFileSync(srcElement, destElement);
    }
  });
}

// Clean destination first to prevent stale assets
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}

copyFolderSync(srcDir, destDir);
console.log('Successfully copied assets from admin/static to root static/ folder');
