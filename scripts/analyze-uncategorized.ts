import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Paginate through all products
async function fetchAllProducts(filter?: { column: string; value: string }) {
    const PAGE_SIZE = 1000;
    let allProducts: any[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        let query = supabase
            .from('products')
            .select('id, sku, name, category, subcategory, description')
            .range(from, from + PAGE_SIZE - 1);

        if (filter) {
            query = query.eq(filter.column, filter.value);
        }

        const { data, error } = await query;

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
    console.log('Fetching ALL products with pagination...\n');

    // Get ALL products first
    const allProducts = await fetchAllProducts();
    console.log(`Total products in database: ${allProducts.length}\n`);

    // Filter uncategorized
    const uncategorized = allProducts.filter(p =>
        !p.category || p.category === 'Uncategorized' || p.category === ''
    );

    console.log(`Found ${uncategorized.length} uncategorized products\n`);

    // Get products in "Surgical" category (too generic, needs to be split)
    const surgical = allProducts.filter(p => p.category === 'Surgical');
    console.log(`Found ${surgical.length} products in "Surgical" category (needs categorization)\n`);

    // Show full category breakdown  
    console.log('=== FULL CATEGORY BREAKDOWN ===\n');
    const catCounts: Record<string, number> = {};
    allProducts.forEach(p => {
        const cat = p.category || 'Uncategorized';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    Object.entries(catCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

    console.log('\n=== PRODUCTS NEEDING CATEGORIZATION ===');
    console.log(`  Uncategorized: ${uncategorized.length}`);
    console.log(`  Surgical (too generic): ${surgical.length}`);
    console.log(`  TOTAL TO FIX: ${uncategorized.length + surgical.length}\n`);

    // Analyze SKU patterns
    console.log('=== SKU PATTERN ANALYSIS ===\n');

    const skuPrefixes: Record<string, { count: number; samples: string[] }> = {};

    uncategorized?.forEach(p => {
        // Extract first 2-3 characters as prefix
        const prefix = p.sku.split('-')[0];
        if (!skuPrefixes[prefix]) {
            skuPrefixes[prefix] = { count: 0, samples: [] };
        }
        skuPrefixes[prefix].count++;
        if (skuPrefixes[prefix].samples.length < 3) {
            skuPrefixes[prefix].samples.push(`${p.sku}: ${p.name}`);
        }
    });

    console.log('SKU Prefixes in Uncategorized Products:');
    Object.entries(skuPrefixes)
        .sort((a, b) => b[1].count - a[1].count)
        .forEach(([prefix, data]) => {
            console.log(`\n  ${prefix} (${data.count} products)`);
            data.samples.forEach(s => console.log(`    - ${s}`));
        });

    // Print surgical products for review
    console.log('\n\n=== SURGICAL CATEGORY PRODUCTS (to merge) ===\n');
    surgical?.forEach(p => {
        console.log(`  ${p.sku}: ${p.name}`);
        console.log(`    Subcategory: ${p.subcategory}`);
    });

    // Generate CSV for review
    const allToFix = [...(uncategorized || []), ...(surgical || [])];

    let csv = 'id,sku,name,current_category,current_subcategory,suggested_category,suggested_subcategory\n';
    allToFix.forEach(p => {
        const escapedName = `"${(p.name || '').replace(/"/g, '""')}"`;
        csv += `${p.id},${p.sku},${escapedName},${p.category || ''},${p.subcategory || ''},,\n`;
    });

    fs.writeFileSync('uncategorized-products.csv', csv);
    console.log('\n\n✅ Created uncategorized-products.csv with all products to categorize');
    console.log('   Fill in suggested_category and suggested_subcategory columns, then run apply script.');
}

main();
