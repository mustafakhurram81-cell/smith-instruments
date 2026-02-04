import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Paginate through all products
async function fetchAllProducts() {
    const PAGE_SIZE = 1000;
    let allProducts: any[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('id, sku, name, category, subcategory, description, image_url')
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error:', error);
            break;
        }

        if (data && data.length > 0) {
            allProducts = [...allProducts, ...data];
            from += PAGE_SIZE;
            hasMore = data.length === PAGE_SIZE;
        } else {
            hasMore = false;
        }
    }

    return allProducts;
}

async function main() {
    console.log('🔍 PRODUCT AUDIT FOR B2C IMPROVEMENT\n');
    console.log('Fetching all products...\n');

    const allProducts = await fetchAllProducts();
    console.log(`Total products: ${allProducts.length}\n`);

    // Audit 1: Missing Images
    const missingImages = allProducts.filter(p => !p.image_url || p.image_url === '');

    // Audit 2: Missing/Short Descriptions  
    const missingDesc = allProducts.filter(p => !p.description || p.description.length < 10);
    const shortDesc = allProducts.filter(p => p.description && p.description.length >= 10 && p.description.length < 50);

    // Audit 3: Uncategorized
    const uncategorized = allProducts.filter(p => !p.category || p.category === 'Uncategorized' || p.category === '');
    const genericCategory = allProducts.filter(p => p.category === 'Surgical');

    console.log('═══════════════════════════════════════════════════');
    console.log('              PRODUCT AUDIT SUMMARY                 ');
    console.log('═══════════════════════════════════════════════════\n');

    console.log(`📸 IMAGES`);
    console.log(`   Missing images: ${missingImages.length} (${(missingImages.length / allProducts.length * 100).toFixed(1)}%)`);
    console.log(`   Has images: ${allProducts.length - missingImages.length} (${((allProducts.length - missingImages.length) / allProducts.length * 100).toFixed(1)}%)\n`);

    console.log(`📝 DESCRIPTIONS`);
    console.log(`   No description: ${missingDesc.length} (${(missingDesc.length / allProducts.length * 100).toFixed(1)}%)`);
    console.log(`   Short (<50 chars): ${shortDesc.length}`);
    console.log(`   Good (50+ chars): ${allProducts.length - missingDesc.length - shortDesc.length}\n`);

    console.log(`📂 CATEGORIZATION`);
    console.log(`   Properly categorized: ${allProducts.length - uncategorized.length - genericCategory.length}`);
    console.log(`   Uncategorized: ${uncategorized.length}`);
    console.log(`   Generic "Surgical": ${genericCategory.length}`);
    console.log(`   NEEDS FIXING: ${uncategorized.length + genericCategory.length}\n`);

    // Priority Score (products needing most work)
    const productScores: { sku: string; name: string; issues: string[]; score: number }[] = [];

    allProducts.forEach(p => {
        const issues: string[] = [];
        let score = 0;

        if (!p.image_url) { issues.push('no-image'); score += 3; }
        if (!p.description || p.description.length < 10) { issues.push('no-desc'); score += 2; }
        else if (p.description.length < 50) { issues.push('short-desc'); score += 1; }
        if (!p.category || p.category === 'Uncategorized') { issues.push('uncategorized'); score += 2; }
        if (p.category === 'Surgical') { issues.push('generic-category'); score += 1; }

        if (issues.length > 0) {
            productScores.push({ sku: p.sku, name: p.name, issues, score });
        }
    });

    // Sort by priority
    productScores.sort((a, b) => b.score - a.score);

    console.log('═══════════════════════════════════════════════════');
    console.log('          TOP 20 PRODUCTS NEEDING WORK              ');
    console.log('═══════════════════════════════════════════════════\n');

    productScores.slice(0, 20).forEach((p, i) => {
        console.log(`${i + 1}. ${p.sku} - ${p.name.substring(0, 40)}`);
        console.log(`   Issues: ${p.issues.join(', ')}`);
    });

    // Generate detailed CSV
    let csv = 'sku,name,category,subcategory,has_image,description_length,issues\n';
    productScores.forEach(p => {
        const product = allProducts.find(x => x.sku === p.sku)!;
        const escapedName = `"${(product.name || '').replace(/"/g, '""')}"`;
        csv += `${p.sku},${escapedName},${product.category || ''},${product.subcategory || ''},${product.image_url ? 'yes' : 'no'},${product.description?.length || 0},"${p.issues.join('; ')}"\n`;
    });

    fs.writeFileSync('product-audit.csv', csv);

    console.log(`\n\n✅ Created product-audit.csv with ${productScores.length} products needing improvement`);
    console.log('   Sorted by priority (worst issues first)');
}

main();
