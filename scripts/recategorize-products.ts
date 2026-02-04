import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ═══════════════════════════════════════════════════════════
// NEW CATEGORY STRUCTURE (v2 - Based on Newmed research)
// ═══════════════════════════════════════════════════════════

const SKU_MAPPING: Record<string, { category: string; subcategory: string }> = {
    // ─────────────────────────────────────────
    // 1. CUTTING & DISSECTING INSTRUMENTS
    // ─────────────────────────────────────────
    '01': { category: 'Cutting & Dissecting Instruments', subcategory: 'Scalpels & Handles' },
    '02': { category: 'Cutting & Dissecting Instruments', subcategory: 'Scissors' },
    '12': { category: 'Cutting & Dissecting Instruments', subcategory: 'Bone Cutting Instruments' },

    // ─────────────────────────────────────────
    // 2. GRASPING & CLAMPING INSTRUMENTS
    // ─────────────────────────────────────────
    '03': { category: 'Grasping & Clamping Instruments', subcategory: 'Tissue Forceps' },
    '04': { category: 'Grasping & Clamping Instruments', subcategory: 'Hemostatic Forceps' },
    '05': { category: 'Grasping & Clamping Instruments', subcategory: 'Sponge & Swab Forceps' },

    // ─────────────────────────────────────────
    // 3. RETRACTORS & EXPOSING INSTRUMENTS
    // ─────────────────────────────────────────
    '06': { category: 'Retractors & Exposing Instruments', subcategory: 'General Retractors' },

    // ─────────────────────────────────────────
    // 4. SUTURING & WOUND CARE
    // ─────────────────────────────────────────
    '07': { category: 'Suturing & Wound Care', subcategory: 'Probes & Sounds' },
    '08': { category: 'Suturing & Wound Care', subcategory: 'Dressing Instruments' },
    '10': { category: 'Suturing & Wound Care', subcategory: 'Needle Holders & Suturing' },

    // ─────────────────────────────────────────
    // 5. SPECIALTY - HEAD, NECK & ENT
    // ─────────────────────────────────────────
    '21': { category: 'Specialty - Head, Neck & ENT', subcategory: 'Dermatology' },
    '23': { category: 'Specialty - Head, Neck & ENT', subcategory: 'Otology (Ear)' },
    '24': { category: 'Specialty - Head, Neck & ENT', subcategory: 'Rhinology (Nose)' },
    '25': { category: 'Specialty - Head, Neck & ENT', subcategory: 'Oral & Maxillofacial' },
    '26': { category: 'Specialty - Head, Neck & ENT', subcategory: 'Craniofacial' },
    '27': { category: 'Specialty - Head, Neck & ENT', subcategory: 'Laryngoscopy & Tonsillectomy' },
    '29': { category: 'Specialty - Head, Neck & ENT', subcategory: 'Tracheotomy' },

    // ─────────────────────────────────────────
    // 6. SPECIALTY - BODY CAVITY & VASCULAR
    // ─────────────────────────────────────────
    '09': { category: 'Specialty - Body Cavity & Vascular', subcategory: 'Trocars & Cannulas' },
    '11': { category: 'Specialty - Body Cavity & Vascular', subcategory: 'GI & Abdominal' },
    '14': { category: 'Specialty - Body Cavity & Vascular', subcategory: 'Cardiovascular' },
    '15': { category: 'Specialty - Body Cavity & Vascular', subcategory: 'Neurosurgery' },
    '18': { category: 'Specialty - Body Cavity & Vascular', subcategory: 'Hepatobiliary & Urology' },
    '19': { category: 'Specialty - Body Cavity & Vascular', subcategory: 'Gynecology' },
    '20': { category: 'Specialty - Body Cavity & Vascular', subcategory: 'Obstetrics' },

    // ─────────────────────────────────────────
    // 7. ACCESSORIES, SETS & DIAGNOSTICS
    // ─────────────────────────────────────────
    '13': { category: 'Accessories, Sets & Diagnostics', subcategory: 'Calipers & Measuring' },
    '16': { category: 'Accessories, Sets & Diagnostics', subcategory: 'Diagnostic Instruments' },
    '17': { category: 'Accessories, Sets & Diagnostics', subcategory: 'Anaesthesia' },
    '22': { category: 'Accessories, Sets & Diagnostics', subcategory: 'Dissecting Kits' },
    '28': { category: 'Accessories, Sets & Diagnostics', subcategory: 'Holloware & Basins' },
    '30': { category: 'Accessories, Sets & Diagnostics', subcategory: 'Instrument Sets' },
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
            .select('id, sku, name, category, subcategory')
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

// Get category from SKU
function getCategoryFromSku(sku: string): { category: string; subcategory: string } | null {
    const prefix = sku.split('-')[0];
    return SKU_MAPPING[prefix] || null;
}

async function main() {
    const DRY_RUN = process.argv.includes('--dry-run');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('     PRODUCT RECATEGORIZATION v2 (7 Categories)            ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (preview only)' : '⚡ LIVE (will update database)'}\n`);

    const products = await fetchAllProducts();
    console.log(`Total products: ${products.length}\n`);

    // Analyze changes
    let toUpdate = 0;
    let alreadyCorrect = 0;
    let noMapping = 0;
    const changes: { id: string; sku: string; oldCat: string; newCat: string; newSub: string }[] = [];
    const unmapped: { sku: string; name: string }[] = [];

    for (const product of products) {
        const mapping = getCategoryFromSku(product.sku);

        if (!mapping) {
            noMapping++;
            unmapped.push({ sku: product.sku, name: product.name });
            continue;
        }

        // Check if needs update
        if (product.category !== mapping.category || product.subcategory !== mapping.subcategory) {
            toUpdate++;
            changes.push({
                id: product.id,
                sku: product.sku,
                oldCat: `${product.category || 'none'} > ${product.subcategory || 'none'}`,
                newCat: mapping.category,
                newSub: mapping.subcategory
            });
        } else {
            alreadyCorrect++;
        }
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('                      SUMMARY                               ');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`  ✅ Already correct: ${alreadyCorrect}`);
    console.log(`  🔄 Will be updated: ${toUpdate}`);
    console.log(`  ❓ No SKU mapping:  ${noMapping}\n`);

    // Show category breakdown
    const catBreakdown: Record<string, number> = {};
    changes.forEach(c => {
        catBreakdown[c.newCat] = (catBreakdown[c.newCat] || 0) + 1;
    });

    console.log('Products per new category:');
    Object.entries(catBreakdown)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

    // Show sample changes
    console.log('\nSample changes (first 5):');
    changes.slice(0, 5).forEach(c => {
        console.log(`  ${c.sku}:`);
        console.log(`    FROM: "${c.oldCat}"`);
        console.log(`    TO:   "${c.newCat} > ${c.newSub}"`);
    });

    // Show unmapped
    if (unmapped.length > 0) {
        console.log(`\nUnmapped SKU prefixes:`);
        const prefixes = new Set(unmapped.map(u => u.sku.split('-')[0]));
        Array.from(prefixes).forEach(p => console.log(`  - ${p}`));
    }

    if (DRY_RUN) {
        console.log('\n\n🔍 DRY RUN complete. Run without --dry-run to apply changes.');
        return;
    }

    // Apply changes
    console.log('\n\n⚡ Applying changes...\n');

    let success = 0;
    let failed = 0;
    const BATCH_SIZE = 100;

    for (let i = 0; i < changes.length; i += BATCH_SIZE) {
        const batch = changes.slice(i, i + BATCH_SIZE);

        for (const change of batch) {
            const { error } = await supabase
                .from('products')
                .update({
                    category: change.newCat,
                    subcategory: change.newSub
                })
                .eq('id', change.id);

            if (error) {
                failed++;
                console.error(`  ❌ Failed: ${change.sku} - ${error.message}`);
            } else {
                success++;
            }
        }

        // Progress
        const pct = Math.round((i + batch.length) / changes.length * 100);
        process.stdout.write(`\r  Progress: ${pct}% (${i + batch.length}/${changes.length})`);
    }

    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('                      COMPLETE                               ');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`  ✅ Successfully updated: ${success}`);
    console.log(`  ❌ Failed: ${failed}`);
}

main();
