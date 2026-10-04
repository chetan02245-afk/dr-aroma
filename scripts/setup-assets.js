const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const framesSrcDir = path.join(projectRoot, 'parts', 'ezgif-580d95a3440fd852-jpg');
const framesDstDir = path.join(projectRoot, 'public', 'frames');
const videoDstDir = path.join(projectRoot, 'public', 'video');
const imgDstDir = path.join(projectRoot, 'public', 'images');

[framesDstDir, videoDstDir, imgDstDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

let framesCopied = 0;
for (let i = 1; i <= 120; i++) {
  const numStr = String(i).padStart(3, '0');
  const src = path.join(framesSrcDir, 'ezgif-frame-' + numStr + '.jpg');
  const dst = path.join(framesDstDir, 'frame-' + numStr + '.jpg');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    framesCopied++;
  }
}
console.log('Frames successfully copied:', framesCopied);

const videoSrc = path.join(projectRoot, 'parts', 'img', 'video', 'merge_in_3d_1080p_20260921202315.mp4');
const videoDst = path.join(videoDstDir, 'hero-fallback.mp4');
if (fs.existsSync(videoSrc)) {
  fs.copyFileSync(videoSrc, videoDst);
  console.log('Hero fallback video copied successfully.');
}

const partsImgDir = path.join(projectRoot, 'parts', 'img');
const imgFiles = fs.readdirSync(partsImgDir);
imgFiles.forEach(file => {
  if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png')) {
    const src = path.join(partsImgDir, file);
    let targetName = 'heritage-ingredients.jpg';
    if (file.toLowerCase().includes('dark')) {
      targetName = 'ingredients-dark.jpg';
    } else {
      targetName = 'ingredients-flatlay.jpg';
    }
    fs.copyFileSync(src, path.join(imgDstDir, targetName));
    console.log('Copied image:', file, '->', targetName);
  }
});
