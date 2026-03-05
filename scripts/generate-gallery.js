/**
 * generate-gallery.js
 * Scans the `imagenes/` and `videos/` directories to create a JSON manifest of 
 * all media files available for each project slug. 
 * This avoids relying on server directory auto-indexing which is blocked in production.
 *
 * Run: node scripts/generate-gallery.js
 */

const fs = require('fs');
const path = require('path');

const IMAGENES_ROOT = path.join(__dirname, '..', 'imagenes');
const VIDEOS_ROOT = path.join(__dirname, '..', 'videos');
const OUTPUT_FILE = path.join(__dirname, '..', 'js', 'galleryData.json');

const IMG_EXTS = /\.(jpg|jpeg|png|webp|gif)$/i;
const VID_EXTS = /\.(mp4|mov|webm)$/i;

function getFiles(dir, regex) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => regex.test(f));
}

(async () => {
    console.log(`\n🗂  Generando manifiesto de galería...\n`);

    const galleryData = {};

    // Get all slug directories from images
    if (fs.existsSync(IMAGENES_ROOT)) {
        const slugDirs = fs.readdirSync(IMAGENES_ROOT, { withFileTypes: true })
            .filter(d => d.isDirectory() && d.name !== 'thumbs')
            .map(d => d.name);

        for (const slug of slugDirs) {
            const imgDir = path.join(IMAGENES_ROOT, slug);
            const vidDir = path.join(VIDEOS_ROOT, slug);

            // Get images, excluding covers
            const images = getFiles(imgDir, IMG_EXTS).filter(f => !/^portada\.(jpg|jpeg|png|webp)$/i.test(f));

            // Get videos
            const videos = getFiles(vidDir, VID_EXTS);

            if (images.length > 0 || videos.length > 0) {
                galleryData[slug] = {
                    images: images,
                    videos: videos
                };
                console.log(`  ✓ Encontrados en ${slug}: ${images.length} imágenes, ${videos.length} videos`);
            }
        }
    }

    // Ensure js directory exists
    const jsDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir, { recursive: true });
    }

    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(galleryData, null, 2));

    console.log(`\n✅ Manifiesto guardado en: js/galleryData.json`);
    console.log(`   Generado para ${Object.keys(galleryData).length} proyectos.\n`);
})();
