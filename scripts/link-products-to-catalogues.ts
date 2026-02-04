import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SKU Prefix → Catalogue Title mapping
const SKU_TO_CATALOGUE: Record<string, string> = {
    '01': 'Scalpels',
    '02': 'Scissors',
    '03': 'Dissecting & Tissue Forceps',
    '04': 'Artery Forceps',
    '05': 'Cotton Swab Forceps',
    '06': 'Retractors',
    '07': 'Probes',
    '08': 'Dressing',
    '09': 'Trocars, Suction Tubes & Cannulas',
    '10': 'Suture',
    '11': 'Stomach, Intestines & Rectum',
    '12': 'Bone Surgery',
    '13': 'Calipers',
    '14': 'Cardiovascular Surgery',
    '15': 'Neurosurgery & Laminectomy',
    '16': 'Diagnostics',
    '17': 'Anaesthesia',
    '18': 'Liver, Gall Bladder, Kidney & Urology',
    '19': 'Gynecology',
    '20': 'Obstetrics',
    '21': 'Dermatology',
    '22': 'Dissecting Kits',
    '23': 'Otology',
    '24': 'Rhinology',
    '25': 'Oral Maxillo-Facial Surgery',
    '26': 'Cranio-Maxillo-Facial Surgery',
    '27': 'Tonsillectomy & Laryngo-Bronchoscopy',
    '28': 'Holloware',
    '29': 'Tracheotomy',
    '30': 'Dissecting Kits', // Instrument sets map to Dissecting Kits for now
};

// Paginate through all products
async function fetchAllProducts() {
    const PAGE_SIZE = 1000;
    let allProducts: any[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('id, sku')
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
    const DRY_RUN = process.argv.includes('--dry-run');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('         LINK PRODUCTS TO CATALOGUES                        ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN' : '⚡ LIVE'}\n`);

    // 1. Fetch all catalogues and create title→id mapping
    const { data: catalogues } = await supabase
        .from('catalogues')
        .select('id, title');

    if (!catalogues) {
        console.error('No catalogues found!');
        return;
    }

    const catalogueMap: Record<string, string> = {};
    catalogues.forEach(c => {
        catalogueMap[c.title] = c.id;
    });

    console.log(`Found ${catalogues.length} catalogues\n`);

    // 2. Fetch all products
    const products = await fetchAllProducts();
    console.log(`Found ${products.length} products\n`);

    // 3. Link products to catalogues
    let linked = 0;
    let noMatch = 0;
    const unmatchedPrefixes = new Set<string>();

    for (const product of products) {
        const prefix = product.sku.split('-')[0];
        const catalogueTitle = SKU_TO_CATALOGUE[prefix];

        if (!catalogueTitle) {
            noMatch++;
            unmatchedPrefixes.add(prefix);
            continue;
        }

        const catalogueId = catalogueMap[catalogueTitle];
        if (!catalogueId) {
            noMatch++;
            unmatchedPrefixes.add(prefix);
            continue;
        }

        if (!DRY_RUN) {
            const { error } = await supabase
                .from('products')
                .update({ catalogue_id: catalogueId })
                .eq('id', product.id);

            if (error) {
                console.error(`Failed ${product.sku}: ${error.message}`);
            }
        }

        linked++;
    }

    // Progress indicator
    console.log(`\n✅ Linked: ${linked}`);
    console.log(`❓ No match: ${noMatch}`);

    if (unmatchedPrefixes.size > 0) {
        console.log(`\nUnmatched prefixes: ${Array.from(unmatchedPrefixes).join(', ')}`);
    }

    if (DRY_RUN) {
        console.log('\n🔍 DRY RUN complete. Run without --dry-run to apply.');
    } else {
        console.log('\n✅ Complete!');
    }
}

main();
