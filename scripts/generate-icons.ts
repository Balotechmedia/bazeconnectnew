import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384]; // Skip 512 since it's the input
const inputPath = './public/icons/icon-512x512.png';
const outputDir = './public/icons';

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎨 Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    await sharp(inputPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated: icon-${size}x${size}.png`);
  }

  console.log('✓ icon-512x512.png already exists (source file)');

  // Generate favicon
  await sharp(inputPath)
    .resize(32, 32)
    .png()
    .toFile('./public/favicon.png');
  
  console.log('✓ Generated: favicon.png');

  // Generate apple-touch-icon
  await sharp(inputPath)
    .resize(180, 180)
    .png()
    .toFile('./public/apple-touch-icon.png');
  
  console.log('✓ Generated: apple-touch-icon.png');

  console.log('🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
