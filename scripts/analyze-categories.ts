import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    const { data, error } = await supabase
        .from('products')
        .select('category, subcategory');

    if (error) {
        console.error('Error:', error);
        return;
    }

    // Count by category
    const catCounts: Record<string, number> = {};
    const subCounts: Record<string, Record<string, number>> = {};

    data?.forEach(p => {
        const cat = p.category || 'Uncategorized';
        const sub = p.subcategory || 'General';

        catCounts[cat] = (catCounts[cat] || 0) + 1;

        if (!subCounts[cat]) subCounts[cat] = {};
        subCounts[cat][sub] = (subCounts[cat][sub] || 0) + 1;
    });

    console.log('\n=== CURRENT PRODUCT CATEGORIES ===\n');

    Object.entries(catCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
            console.log(`📁 ${cat}: ${count} products`);
            const subs = subCounts[cat];
            if (subs) {
                Object.entries(subs)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .forEach(([sub, subCount]) => {
                        console.log(`   └─ ${sub}: ${subCount}`);
                    });
                const totalSubs = Object.keys(subs).length;
                if (totalSubs > 5) {
                    console.log(`   └─ ... and ${totalSubs - 5} more subcategories`);
                }
            }
        });

    console.log(`\n=== TOTAL: ${data?.length || 0} products in ${Object.keys(catCounts).length} categories ===\n`);
}

main();
