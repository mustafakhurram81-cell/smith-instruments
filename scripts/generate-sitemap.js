import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually load .env if present (for local build without dotenv dependency)
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                value = value.replace(/\\n/gm, '\n');
            }
            value = value.replace(/(^['"]|['"]$)/g, '').trim();
            process.env[key] = process.env[key] || value;
        }
    });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (process.env.VITE_VERCEL_ENV) { /* Silence on Vercel if strictly not needed, but we do need it */ }
    // Only warn if we really can't connect, but don't fail hard if we are just testing
    console.warn('Warning: Missing Supabase credentials. Sitemap will be static only.');
}

const supabase = (SUPABASE_URL && SUPABASE_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : { from: () => ({ select: () => ({ data: [] }) }) }; // Mock if missing

const BASE_URL = 'https://smith-instruments.vercel.app/#'; // Hash router needs #

async function generateSitemap() {
    console.log('Generating sitemap...');

    // Static Routes
    const staticRoutes = [
        '/',
        '/about',
        '/contact',
        '/catalogues',
        '/products'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add Static Routes
    staticRoutes.forEach(route => {
        xml += `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
`;
    });

    try {
        // Fetch Categories
        const { data: categories } = await supabase
            .from('products')
            .select('category')
            .not('category', 'is', null);

        const uniqueCategories = [...new Set(categories?.map(p => p.category))];

        uniqueCategories.forEach(cat => {
            if (!cat) return;
            const safeCat = encodeURIComponent(cat);
            xml += `  <url>
    <loc>${BASE_URL}/products/${safeCat}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        });

        // Fetch Products (ID and updated_at)
        const { data: products } = await supabase
            .from('products')
            .select('id, updated_at');

        products?.forEach(product => {
            const lastMod = product.updated_at ? product.updated_at.split('T')[0] : new Date().toISOString().split('T')[0];
            xml += `  <url>
    <loc>${BASE_URL}/product/${product.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }

    xml += '</urlset>';

    // Ensure public dir exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log(`Sitemap generated with ${staticRoutes.length} static routes and dynamic product routes.`);
}

generateSitemap();
