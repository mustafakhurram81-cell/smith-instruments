import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
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
