import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    const PAGE_SIZE = 1000;
    let allProducts: { category: string; subcategory: string }[] = [];
    let from = 0;
    let hasMore = true;

    console.log('Fetching ALL products...\n');

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('category, subcategory')
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

    console.log(`Total products: ${allProducts.length}\n`);

    // Categories (Specialties)
    const categories: Record<string, number> = {};
    // Subcategories (Instrument Types)  
    const subcategories: Record<string, number> = {};

    allProducts.forEach(p => {
        const cat = p.category || 'Uncategorized';
        const sub = p.subcategory || 'General';

        categories[cat] = (categories[cat] || 0) + 1;
        if (sub !== 'General') {
            subcategories[sub] = (subcategories[sub] || 0) + 1;
        }
    });

    console.log('=== CATEGORIES (Browse by Medical Specialty) ===\n');
    Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

    console.log('\n=== SUBCATEGORIES (Browse by Instrument Type) ===\n');
    Object.entries(subcategories)
        .sort((a, b) => b[1] - a[1])
        .forEach(([sub, count]) => console.log(`  ${sub}: ${count}`));

    console.log(`\nTotal categories: ${Object.keys(categories).length}`);
    console.log(`Total instrument types: ${Object.keys(subcategories).length}`);
}

main();
