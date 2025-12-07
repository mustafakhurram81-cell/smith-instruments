// Script to convert images to WebP format
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '../public');

async function convertToWebP() {
    const files = ['smith-logo-full.jpg', 'smith-logo-full.png', 'smith-logo-optimized.jpg'];

    for (const file of files) {
        const inputPath = path.join(publicDir, file);
        const outputPath = path.join(publicDir, file.replace(/\.(jpg|png)$/, '.webp'));

        if (fs.existsSync(inputPath)) {
            try {
                await sharp(inputPath)
                    .webp({ quality: 85 })
                    .toFile(outputPath);
                console.log(`✅ Converted ${file} to WebP`);
            } catch (err) {
                console.error(`❌ Failed to convert ${file}:`, err.message);
            }
        } else {
            console.log(`⏭️ Skipped ${file} (not found)`);
        }
    }
}

convertToWebP();
