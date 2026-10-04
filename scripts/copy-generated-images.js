const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\cheta\\.gemini\\antigravity-ide\\brain\\131e5f9a-6e26-49e8-a660-d7f031259dd6';
const targetDir = path.resolve(__dirname, '..', 'public', 'images');

const files = fs.readdirSync(brainDir);
files.forEach(f => {
  if (f.startsWith('rooh_gulab_perfume') && f.endsWith('.jpg')) {
    fs.copyFileSync(path.join(brainDir, f), path.join(targetDir, 'rooh-gulab.jpg'));
    console.log('Copied rooh-gulab.jpg');
  }
  if (f.startsWith('tripolia_royal_oudh') && f.endsWith('.jpg')) {
    fs.copyFileSync(path.join(brainDir, f), path.join(targetDir, 'tripolia-royal-oudh.jpg'));
    console.log('Copied tripolia-royal-oudh.jpg');
  }
  if (f.startsWith('mitti_attar_perfume') && f.endsWith('.jpg')) {
    fs.copyFileSync(path.join(brainDir, f), path.join(targetDir, 'mitti-attar.jpg'));
    console.log('Copied mitti-attar.jpg');
  }
  if (f.startsWith('kasturi_shamama_royal') && f.endsWith('.jpg')) {
    fs.copyFileSync(path.join(brainDir, f), path.join(targetDir, 'kasturi-shamama.jpg'));
    console.log('Copied kasturi-shamama.jpg');
  }
  if (f.startsWith('bespoke_atelier_blend') && f.endsWith('.jpg')) {
    fs.copyFileSync(path.join(brainDir, f), path.join(targetDir, 'bespoke-atelier.jpg'));
    console.log('Copied bespoke-atelier.jpg');
  }
});
