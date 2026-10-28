import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://smithinstruments.net';
const TODAY = new Date().toISOString().split('T')[0];

function generateSitemap() {
    console.log('Generating sitemap...');

    const publicDir = path.join(__dirname, '../public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

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

    // Catalog pages from public/catalog/index.json (built by `npm run catalog`): one URL per
    // instrument type, subtype and specialty, and one per instrument (its sizes live on that page).
    const index = JSON.parse(fs.readFileSync(path.join(publicDir, 'catalog', 'index.json'), 'utf8'));
    // When the catalogue was last built from the ERP.
    const CATALOG_UPDATED = index.generatedAt.slice(0, 10);

    const types = [...new Set(index.families.map(f => f.t))];
    types.forEach(type => {
        addUrl(`/products/type/${type}`, TODAY, 'weekly', '0.8');
        categoryCount++;
        const subtypes = new Set(index.families.filter(f => f.t === type && f.st).map(f => f.st));
        if (subtypes.size > 1) subtypes.forEach(st => { addUrl(`/products/type/${type}/${st}`, TODAY, 'weekly', '0.7'); subcategoryCount++; });
    });
    [...new Set(index.families.flatMap(f => f.sp))].forEach(sp => {
        addUrl(`/products/specialty/${sp}`, TODAY, 'weekly', '0.7');
        categoryCount++;
    });

    index.families.forEach(f => {
        addUrl(`/product/${f.c}`, CATALOG_UPDATED, 'monthly', '0.6');
        productCount++;
    });

    xml += '</urlset>';

    fs.writeFileSync(sitemapPath, xml);

    console.log(`Sitemap generated:`);
    console.log(`  - ${staticRoutes.length} static routes`);
    console.log(`  - ${categoryCount} categories`);
    console.log(`  - ${subcategoryCount} subcategories`);
    console.log(`  - ${productCount} products`);
    console.log(`  Total: ${staticRoutes.length + categoryCount + subcategoryCount + productCount} URLs`);
}

generateSitemap();
