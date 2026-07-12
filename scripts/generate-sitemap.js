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

const BASE_URL = 'https://smithinstruments.net';
const TODAY = new Date().toISOString().split('T')[0];

async function generateSitemap() {
    console.log('Generating sitemap...');

    const publicDir = path.join(__dirname, '../public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // A transient API/configuration failure must never replace a complete
    // production sitemap with a static-only version.
    if ((!SUPABASE_URL || !SUPABASE_KEY) && fs.existsSync(sitemapPath)) {
        console.warn('Keeping the existing sitemap because Supabase credentials are unavailable.');
        return;
    }

    let categoryCount = 0;
    let subcategoryCount = 0;
    let productCount = 0;

    const addUrl = (routePath, lastmod, changefreq, priority) => {
        xml += `  <url>
    <loc>${BASE_URL}${routePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
    };

    // Static Routes with priorities
    const staticRoutes = [
        { path: '/', priority: '1.0', changefreq: 'weekly' },
        { path: '/products', priority: '0.9', changefreq: 'daily' },
        { path: '/catalogues', priority: '0.8', changefreq: 'weekly' },
        { path: '/about', priority: '0.7', changefreq: 'monthly' },
        { path: '/distributor', priority: '0.7', changefreq: 'monthly' },
        { path: '/contact', priority: '0.7', changefreq: 'monthly' },
        { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
        { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add Static Routes
    staticRoutes.forEach(route => addUrl(route.path, TODAY, route.changefreq, route.priority));

    let fetchFailed = false;

    try {
        let allProducts = [];
        let hasMore = true;
        let page = 0;
        const limit = 1000;

        while (hasMore) {
            const { data, error } = await supabase
                .from('products')
                .select('sku, category, subcategory, instrument_category, instrument_subcategory, specialty_category, specialty_subcategory, updated_at')
                .range(page * limit, (page + 1) * limit - 1);

            if (error) {
                console.error('Error fetching products:', error);
                fetchFailed = true;
                break;
            }

            if (data && data.length > 0) {
                allProducts = allProducts.concat(data);
                page++;
            } else {
                hasMore = false;
            }
        }

        const products = allProducts;

        if (products && products.length > 0) {
            const addNavigationRoutes = (prefix, categoryField, subcategoryField) => {
                const categoryMap = new Map();

                products.forEach(product => {
                    const category = product[categoryField];
                    if (!category) return;

                    if (!categoryMap.has(category)) categoryMap.set(category, new Set());
                    const subcategory = product[subcategoryField];
                    if (subcategory && subcategory !== 'General') {
                        categoryMap.get(category).add(subcategory);
                    }
                });

                for (const [category, subcategories] of categoryMap) {
                    const categoryPath = `${prefix}/${encodeURIComponent(category)}`;
                    addUrl(categoryPath, TODAY, 'weekly', '0.8');
                    categoryCount++;

                    for (const subcategory of subcategories) {
                        addUrl(`${categoryPath}/${encodeURIComponent(subcategory)}`, TODAY, 'weekly', '0.7');
                        subcategoryCount++;
                    }
                }
            };

            // Keep legacy routes indexed while adding the current dual-navigation URLs.
            addNavigationRoutes('/products', 'category', 'subcategory');
            addNavigationRoutes('/products/instruments', 'instrument_category', 'instrument_subcategory');
            addNavigationRoutes('/products/specialty', 'specialty_category', 'specialty_subcategory');

            // Add product routes
            products.forEach(product => {
                const lastMod = product.updated_at
                    ? product.updated_at.split('T')[0]
                    : TODAY;
                addUrl(`/product/${encodeURIComponent(product.sku)}`, lastMod, 'monthly', '0.6');
                productCount++;
            });
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        fetchFailed = true;
    }

    if (fetchFailed && fs.existsSync(sitemapPath)) {
        console.warn('Keeping the existing sitemap because product data could not be fetched.');
        return;
    }

    xml += '</urlset>';

    // Ensure public dir exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(sitemapPath, xml);

    console.log(`Sitemap generated:`);
    console.log(`  - ${staticRoutes.length} static routes`);
    console.log(`  - ${categoryCount} categories`);
    console.log(`  - ${subcategoryCount} subcategories`);
    console.log(`  - ${productCount} products`);
    console.log(`  Total: ${staticRoutes.length + categoryCount + subcategoryCount + productCount} URLs`);
}

generateSitemap();
