const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512, 180]; // 180 for apple-touch-icon
const inputSvg = path.join(__dirname, '../public/humanopslogo.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  console.log('Generating PWA icons with white background...');

  for (const size of sizes) {
    const outputName = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
    const outputPath = path.join(outputDir, outputName);

    try {
      // Create a white background and composite the icon on top
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
        }
      })
      .composite([{
        input: await sharp(inputSvg)
          .resize(Math.floor(size * 0.8), Math.floor(size * 0.8)) // 80% size with padding
          .toBuffer(),
        gravity: 'center'
      }])
      .png()
      .toFile(outputPath);

      console.log(`✓ Created ${outputName}`);
    } catch (error) {
      console.error(`✗ Failed to create ${outputName}:`, error.message);
    }
  }

  console.log('\nDone! PWA icons generated with white background and padding.');
}

generateIcons().catch(console.error);
