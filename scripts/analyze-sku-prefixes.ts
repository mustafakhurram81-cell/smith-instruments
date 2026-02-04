import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProductData {
    sku: string;
    name: string;
    category: string;
    subcategory: string;
}

async function fetchAllProducts(): Promise<ProductData[]> {
    const PAGE_SIZE = 1000;
    let allProducts: ProductData[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('sku, name, category, subcategory')
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
    console.log('═══════════════════════════════════════════════════════════');
    console.log('     COMPLETE SKU PREFIX ANALYSIS                          ');
    console.log('═══════════════════════════════════════════════════════════\n');

    const products = await fetchAllProducts();
    console.log(`Total products: ${products.length}\n`);

    // Group by SKU prefix
    const prefixData: Record<string, {
        count: number;
        sampleNames: string[];
        currentCategory: string;
        currentSubcategory: string;
    }> = {};

    products.forEach(p => {
        const prefix = p.sku.split('-')[0];

        if (!prefixData[prefix]) {
            prefixData[prefix] = {
                count: 0,
                sampleNames: [],
                currentCategory: p.category || 'None',
                currentSubcategory: p.subcategory || 'None'
            };
        }

        prefixData[prefix].count++;
        if (prefixData[prefix].sampleNames.length < 3) {
            prefixData[prefix].sampleNames.push(p.name);
        }
    });

    // Sort by prefix number
    const sortedPrefixes = Object.keys(prefixData).sort((a, b) => Number(a) - Number(b));

    console.log('═══════════════════════════════════════════════════════════');
    console.log('  SKU PREFIX → CATALOGUE/INSTRUMENT MAPPING                ');
    console.log('═══════════════════════════════════════════════════════════\n');

    sortedPrefixes.forEach(prefix => {
        const data = prefixData[prefix];
        console.log(`📦 SKU Prefix: ${prefix} (${data.count} products)`);
        console.log(`   Current: ${data.currentCategory} → ${data.currentSubcategory}`);
        console.log(`   Sample products:`);
        data.sampleNames.forEach(name => console.log(`     • ${name}`));
        console.log();
    });

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  SUMMARY TABLE                                             ');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('| Prefix | Count | Current Category | Current Subcategory |');
    console.log('|--------|-------|------------------|---------------------|');
    sortedPrefixes.forEach(prefix => {
        const data = prefixData[prefix];
        console.log(`| ${prefix.padEnd(6)} | ${String(data.count).padEnd(5)} | ${data.currentCategory.substring(0, 16).padEnd(16)} | ${data.currentSubcategory.substring(0, 19).padEnd(19)} |`);
    });

    console.log('\n\nTotal prefixes:', sortedPrefixes.length);
}

main();
