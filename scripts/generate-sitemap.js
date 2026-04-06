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
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
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
    console.warn('Warning: Missing Supabase credentials. Sitemap will be static only.');
}

const supabase = (SUPABASE_URL && SUPABASE_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : { from: () => ({ select: () => ({ data: [] }) }) };

const BASE_URL = 'https://smithinstruments.net/#';
const TODAY = new Date().toISOString().split('T')[0];

async function generateSitemap() {
    console.log('Generating sitemap...');

    let categoryCount = 0;
    let subcategoryCount = 0;
    let productCount = 0;

    // Static Routes with priorities
    const staticRoutes = [
        { path: '/', priority: '1.0', changefreq: 'weekly' },
        { path: '/products', priority: '0.9', changefreq: 'daily' },
        { path: '/catalogues', priority: '0.8', changefreq: 'weekly' },
        { path: '/about', priority: '0.7', changefreq: 'monthly' },
        { path: '/contact', priority: '0.7', changefreq: 'monthly' },
        { path: '/blog', priority: '0.6', changefreq: 'weekly' },
        { path: '/quote-cart', priority: '0.5', changefreq: 'monthly' },
        { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
        { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add Static Routes
    staticRoutes.forEach(route => {
        xml += `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
    });

    try {
        // Fetch all products with category/subcategory info
        const { data: products } = await supabase
            .from('products')
            .select('sku, category, subcategory, updated_at');

        if (products && products.length > 0) {
            // Build category -> subcategory -> products map
            const categoryMap = new Map();

            products.forEach(p => {
                if (!p.category) return;

                if (!categoryMap.has(p.category)) {
                    categoryMap.set(p.category, new Map());
                }

                const subMap = categoryMap.get(p.category);
                const sub = p.subcategory || 'General';

                if (!subMap.has(sub)) {
                    subMap.set(sub, []);
                }
                subMap.get(sub).push(p);
            });

            // Add category routes
            for (const [category, subMap] of categoryMap) {
                const safeCat = encodeURIComponent(category);
                xml += `  <url>
    <loc>${BASE_URL}/products/${safeCat}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
                categoryCount++;

                // Add subcategory routes
                for (const [subcategory, prods] of subMap) {
                    if (subcategory && subcategory !== 'General') {
                        const safeSub = encodeURIComponent(subcategory);
                        xml += `  <url>
    <loc>${BASE_URL}/products/${safeCat}/${safeSub}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
                        subcategoryCount++;
                    }
                }
            }

            // Add product routes
            products.forEach(product => {
                const lastMod = product.updated_at
                    ? product.updated_at.split('T')[0]
                    : TODAY;
                xml += `  <url>
    <loc>${BASE_URL}/product/${encodeURIComponent(product.sku)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
                productCount++;
            });
        }

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

    console.log(`Sitemap generated:`);
    console.log(`  - ${staticRoutes.length} static routes`);
    console.log(`  - ${categoryCount} categories`);
    console.log(`  - ${subcategoryCount} subcategories`);
    console.log(`  - ${productCount} products`);
    console.log(`  Total: ${staticRoutes.length + categoryCount + subcategoryCount + productCount} URLs`);
}

generateSitemap();

