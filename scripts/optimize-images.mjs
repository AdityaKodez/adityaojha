import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const testimonialDir = path.join(publicDir, 'testimonial');
const imagesDir = path.join(publicDir, 'images');

async function optimizeTestimonials() {
  console.log('--- Optimizing Testimonial Logos ---');
  const files = fs.readdirSync(testimonialDir);

  for (const file of files) {
    if (!file.endsWith('.png')) continue;
    const filePath = path.join(testimonialDir, file);
    const baseName = path.basename(file, '.png');
    const webpPath = path.join(testimonialDir, `${baseName}.webp`);

    const originalStats = fs.statSync(filePath);

    // Resize to 96x96 (crisp 3x for 32px display) and convert to WebP
    await sharp(filePath)
      .resize(96, 96, { fit: 'cover', position: 'center' })
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);

    const newStats = fs.statSync(webpPath);
    const reduction = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);
    console.log(`✓ ${file} (${(originalStats.size / 1024).toFixed(1)} KB) -> ${baseName}.webp (${(newStats.size / 1024).toFixed(1)} KB) [-${reduction}%]`);
  }
}

async function optimizeBanner() {
  console.log('\n--- Optimizing Banner Background ---');
  const bannerPng = path.join(imagesDir, 'brand-background.png');
  const bannerWebp = path.join(imagesDir, 'brand-background.webp');

  if (fs.existsSync(bannerPng)) {
    const originalStats = fs.statSync(bannerPng);

    // Resize to max 1440w and compress to WebP
    await sharp(bannerPng)
      .resize(1440, null, { withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(bannerWebp);

    const newStats = fs.statSync(bannerWebp);
    const reduction = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);
    console.log(`✓ brand-background.png (${(originalStats.size / 1024).toFixed(1)} KB) -> brand-background.webp (${(newStats.size / 1024).toFixed(1)} KB) [-${reduction}%]`);
  }
}

async function optimizeProjectImages() {
  console.log('\n--- Optimizing Project Screenshots ---');
  const projectFiles = ['aura.png', 'gridly.png', 'rixel.png', 'root.png', 'zeno.png'];

  for (const file of projectFiles) {
    const filePath = path.join(publicDir, file);
    if (!fs.existsSync(filePath)) continue;

    const baseName = path.basename(file, '.png');
    const webpPath = path.join(publicDir, `${baseName}.webp`);
    const originalStats = fs.statSync(filePath);

    // Resize to 1200w max and compress to WebP
    await sharp(filePath)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(webpPath);

    const newStats = fs.statSync(webpPath);
    const reduction = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);
    console.log(`✓ ${file} (${(originalStats.size / 1024).toFixed(1)} KB) -> ${baseName}.webp (${(newStats.size / 1024).toFixed(1)} KB) [-${reduction}%]`);
  }
}

async function main() {
  try {
    await optimizeTestimonials();
    await optimizeBanner();
    await optimizeProjectImages();
    console.log('\nAll images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

main();
