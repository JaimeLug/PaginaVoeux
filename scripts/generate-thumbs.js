/**
 * generate-thumbs.js
 * Generates compressed thumbnails (800px wide, 80% JPEG quality) for all
 * gallery images found in imagenes/<slug>/ folders, writing them to
 * imagenes/<slug>/thumbs/.
 *
 * Run: node scripts/generate-thumbs.js
 * Requires: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGENES_ROOT = path.join(__dirname, '..', 'imagenes');
const THUMB_WIDTH = 800;          // px — good balance for a 3-col grid
const THUMB_QUALITY = 78;           // JPEG quality (0-100)
const IMG_EXTS = /\.(jpg|jpeg|png|webp|gif)$/i;

async function processFolder(slugDir) {
    const thumbDir = path.join(slugDir, 'thumbs');
    fs.mkdirSync(thumbDir, { recursive: true });

    const files = fs.readdirSync(slugDir).filter(f => IMG_EXTS.test(f));

    for (const file of files) {
        const src = path.join(slugDir, file);
        const dest = path.join(thumbDir, file.replace(/\.[^.]+$/, '.jpg'));

        // Skip if thumb already up-to-date
        if (fs.existsSync(dest)) {
            const srcMtime = fs.statSync(src).mtimeMs;
            const destMtime = fs.statSync(dest).mtimeMs;
            if (destMtime >= srcMtime) {
                console.log(`  ↷ skip  ${file}`);
                continue;
            }
        }

        try {
            await sharp(src)
                .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
                .jpeg({ quality: THUMB_QUALITY, progressive: true })
                .toFile(dest);
            console.log(`  ✓ ${file}  →  thumbs/${path.basename(dest)}`);
        } catch (err) {
            console.error(`  ✗ ${file}: ${err.message}`);
        }
    }
}

(async () => {
    if (!fs.existsSync(IMAGENES_ROOT)) {
        console.error('No se encontró la carpeta imagenes/');
        process.exit(1);
    }

    const slugDirs = fs.readdirSync(IMAGENES_ROOT, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name !== 'thumbs')
        .map(d => path.join(IMAGENES_ROOT, d.name));

    console.log(`\n🖼  Generando thumbnails en ${slugDirs.length} carpeta(s)...\n`);

    for (const dir of slugDirs) {
        console.log(`📁 ${path.basename(dir)}`);
        await processFolder(dir);
    }

    console.log('\n✅ Listo — thumbnails generados.\n');
})();
