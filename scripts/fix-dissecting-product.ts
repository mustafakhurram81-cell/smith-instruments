import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    // Find the product with unusual SKU
    const { data, error } = await supabase
        .from('products')
        .select('id, sku, name, category, subcategory')
        .ilike('sku', 'dissecting%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Product(s) with "dissecting" SKU prefix:');
    console.log(JSON.stringify(data, null, 2));

    if (data && data.length > 0) {
        // This is likely a dissecting kit - should go to Accessories, Sets & Diagnostics > Dissecting Kits
        for (const product of data) {
            console.log(`\nUpdating: ${product.sku} - ${product.name}`);

            const { error: updateError } = await supabase
                .from('products')
                .update({
                    category: 'Accessories, Sets & Diagnostics',
                    subcategory: 'Dissecting Kits'
                })
                .eq('id', product.id);

            if (updateError) {
                console.error('  ❌ Failed:', updateError.message);
            } else {
                console.log('  ✅ Updated successfully!');
            }
        }
    } else {
        console.log('No products found with "dissecting" SKU prefix.');
    }
}

main();
