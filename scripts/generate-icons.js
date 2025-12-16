const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputSvg = path.join(__dirname, '../public/humanopslogo.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  console.log('Generating PWA icons from humanopslogo.svg...');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);

    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Created icon-${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to create icon-${size}.png:`, error.message);
    }
  }

  console.log('\nDone! PWA icons generated successfully.');
}

generateIcons().catch(console.error);
