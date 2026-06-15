/**
 * Generate WebP thumbnails from catalogue PDFs.
 *
 * Strategy:
 *   1. Fetch all catalogues from Supabase.
 *   2. For each catalogue without a thumbnail_url:
 *      a. Download the first page of the PDF.
 *      b. Render it to a PNG canvas via pdf.js (Node canvas build).
 *      c. Convert the PNG to an optimised WebP via sharp.
 *      d. Upload the WebP to the Supabase "catalogue-thumbnails" storage bucket.
 *      e. Update the catalogue row with the public URL.
 *
 * Usage:
 *   node scripts/generate-thumbnails.cjs [--force]
 *
 *   --force   Re-generate thumbnails even for catalogues that already have one.
 */

const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ── Supabase config ──────────────────────────────────────────────
const SUPABASE_URL = 'https://jnvdysssdnttlybycefh.supabase.co';
const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const BUCKET_NAME = 'product-images'; // Re-use existing bucket
const THUMB_WIDTH = 480; // px – enough for 240px display @2x retina
const WEBP_QUALITY = 82;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Temp directory for intermediate files ────────────────────────
const TMP_DIR = path.join(__dirname, '../.thumbnail-tmp');

function ensureTmpDir() {
    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

function cleanTmpDir() {
    if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true, force: true });
}

// ── Helpers ──────────────────────────────────────────────────────

/** Slugify a catalogue title for use as a filename */
function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/** Download a PDF and return it as a Buffer */
async function downloadPdf(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
}

/** Render the first page of a PDF to a PNG buffer using pdf.js */
async function renderFirstPage(pdfBuffer) {
    // Dynamically import pdfjs-dist (ESM in CJS context)
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(1);

    // Render at 2x for retina-quality thumbnails
    const scale = (THUMB_WIDTH / page.getViewport({ scale: 1 }).width) * 1;
    const viewport = page.getViewport({ scale });

    // Create a simple canvas-like object for Node
    // pdfjs-dist/legacy supports CanvasFactory with node-canvas or we can use
    // the built-in SVG output. Simplest: use sharp to create from raw pixel data.

    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);

    // We'll use the OffscreenCanvas approach or a custom canvas factory
    // Since we're in Node without node-canvas, let's try a different approach:
    // Use pdfjs with a custom minimal canvas

    // Actually, let's use a simpler approach: use pdf-to-img or canvas
    // Let's try with the canvas package if available, otherwise use pdf2pic approach

    // Cleanest Node.js approach: write PDF to temp file, use Ghostscript or
    // poppler's pdftoppm if available, otherwise use pdf.js with canvas

    // Let's check if 'canvas' is available
    let Canvas;
    try {
        Canvas = require('canvas');
    } catch {
        // canvas not available, we'll use an alternative
        Canvas = null;
    }

    if (Canvas) {
        const canvas = Canvas.createCanvas(width, height);
        const context = canvas.getContext('2d');

        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;

        return canvas.toBuffer('image/png');
    }

    // Fallback: no canvas available, throw to trigger alternative path
    throw new Error('NEEDS_CANVAS');
}

/** Convert a PNG buffer to optimised WebP */
async function toWebp(pngBuffer) {
    return sharp(pngBuffer)
        .resize(THUMB_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toBuffer();
}

/** Upload a WebP buffer to Supabase storage */
async function uploadToStorage(filename, webpBuffer) {
    const filePath = `catalogue-thumbnails/${filename}`;

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, webpBuffer, {
            contentType: 'image/webp',
            upsert: true,
        });

    if (error) throw new Error(`Upload failed for ${filename}: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
}

/** Update the catalogue row with the thumbnail URL */
async function updateCatalogueThumb(id, thumbnailUrl) {
    const { error } = await supabase
        .from('catalogues')
        .update({ thumbnail_url: thumbnailUrl })
        .eq('id', id);

    if (error) throw new Error(`DB update failed for ${id}: ${error.message}`);
}

// ── Alternative: Use pdftoppm (poppler) if available ─────────────
async function renderWithPdftoppm(pdfBuffer, slug) {
    const { execSync } = require('child_process');
    const pdfPath = path.join(TMP_DIR, `${slug}.pdf`);
    const outPrefix = path.join(TMP_DIR, slug);

    fs.writeFileSync(pdfPath, pdfBuffer);

    try {
        execSync(
            `pdftoppm -png -f 1 -l 1 -r 150 -singlefile "${pdfPath}" "${outPrefix}"`,
            { stdio: 'pipe' }
        );
    } catch {
        // Try sips on macOS as last resort
        try {
            // Use macOS sips can't do PDF pages, so try qlmanage
            execSync(
                `qlmanage -t -s ${THUMB_WIDTH} -o "${TMP_DIR}" "${pdfPath}"`,
                { stdio: 'pipe', timeout: 15000 }
            );
            // qlmanage outputs as <filename>.pdf.png
            const qlOutput = path.join(TMP_DIR, `${slug}.pdf.png`);
            if (fs.existsSync(qlOutput)) {
                const buf = fs.readFileSync(qlOutput);
                fs.unlinkSync(qlOutput);
                fs.unlinkSync(pdfPath);
                return buf;
            }
        } catch {
            // do nothing, will be caught below
        }
        throw new Error('PDFTOPPM_NOT_FOUND');
    }

    const pngPath = `${outPrefix}.png`;
    if (!fs.existsSync(pngPath)) throw new Error(`pdftoppm produced no output for ${slug}`);

    const buf = fs.readFileSync(pngPath);
    fs.unlinkSync(pngPath);
    fs.unlinkSync(pdfPath);
    return buf;
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
    const forceAll = process.argv.includes('--force');

    console.log('🖼️  Catalogue Thumbnail Generator');
    console.log('─'.repeat(50));

    // 1. Fetch catalogues
    const { data: catalogues, error } = await supabase
        .from('catalogues')
        .select('id, title, pdf_url, thumbnail_url')
        .order('display_order');

    if (error) {
        console.error('❌ Failed to fetch catalogues:', error.message);
        process.exit(1);
    }

    const toProcess = forceAll
        ? catalogues
        : catalogues.filter(c => !c.thumbnail_url);

    if (toProcess.length === 0) {
        console.log('✅ All catalogues already have thumbnails. Use --force to regenerate.');
        return;
    }

    console.log(`📋 ${toProcess.length} catalogues to process\n`);
    ensureTmpDir();

    let success = 0;
    let failures = 0;

    for (const cat of toProcess) {
        const slug = slugify(cat.title);
        const filename = `${slug}.webp`;

        process.stdout.write(`  ⏳ ${cat.title}...`);

        try {
            // Download PDF
            const pdfBuffer = await downloadPdf(cat.pdf_url);

            // Render first page to PNG
            let pngBuffer;
            try {
                pngBuffer = await renderFirstPage(pdfBuffer);
            } catch (e) {
                // Fallback to pdftoppm / qlmanage
                pngBuffer = await renderWithPdftoppm(pdfBuffer, slug);
            }

            // Convert to WebP
            const webpBuffer = await toWebp(pngBuffer);
            const sizekb = (webpBuffer.length / 1024).toFixed(1);

            // Upload to Supabase Storage
            const publicUrl = await uploadToStorage(filename, webpBuffer);

            // Update DB
            await updateCatalogueThumb(cat.id, publicUrl);

            console.log(` ✅ (${sizekb} KB)`);
            success++;
        } catch (err) {
            console.log(` ❌ ${err.message}`);
            failures++;
        }
    }

    cleanTmpDir();

    console.log('\n' + '─'.repeat(50));
    console.log(`✅ ${success} thumbnails generated`);
    if (failures > 0) console.log(`❌ ${failures} failures`);
    console.log('Done!\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    cleanTmpDir();
    process.exit(1);
});
