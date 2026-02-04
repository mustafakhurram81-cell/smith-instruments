import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ═══════════════════════════════════════════════════════════
// DUAL HIERARCHY MAPPING
// Each SKU prefix maps to BOTH instrument AND specialty categories
// ═══════════════════════════════════════════════════════════

interface DualMapping {
    instrument: { category: string; subcategory: string };
    specialty: { category: string; subcategory: string };
}

const SKU_DUAL_MAPPING: Record<string, DualMapping> = {
    // ─────────────────────────────────────────────────────────
    // CUTTING & DISSECTING INSTRUMENTS
    // ─────────────────────────────────────────────────────────
    '01': {
        instrument: { category: 'Cutting & Dissecting', subcategory: 'Scalpels & Handles' },
        specialty: { category: 'General Surgery', subcategory: 'Basic Instruments' }
    },
    '02': {
        instrument: { category: 'Cutting & Dissecting', subcategory: 'Scissors' },
        specialty: { category: 'General Surgery', subcategory: 'Basic Instruments' }
    },
    '12': {
        instrument: { category: 'Cutting & Dissecting', subcategory: 'Bone Cutting' },
        specialty: { category: 'Orthopedic Surgery', subcategory: 'Bone Instruments' }
    },

    // ─────────────────────────────────────────────────────────
    // GRASPING & CLAMPING INSTRUMENTS
    // ─────────────────────────────────────────────────────────
    '03': {
        instrument: { category: 'Grasping & Clamping', subcategory: 'Tissue Forceps' },
        specialty: { category: 'General Surgery', subcategory: 'Basic Instruments' }
    },
    '04': {
        instrument: { category: 'Grasping & Clamping', subcategory: 'Hemostatic Forceps' },
        specialty: { category: 'General Surgery', subcategory: 'Hemostasis' }
    },
    '05': {
        instrument: { category: 'Grasping & Clamping', subcategory: 'Sponge Forceps' },
        specialty: { category: 'General Surgery', subcategory: 'Basic Instruments' }
    },

    // ─────────────────────────────────────────────────────────
    // RETRACTION & EXPOSURE
    // ─────────────────────────────────────────────────────────
    '06': {
        instrument: { category: 'Retraction & Exposure', subcategory: 'Retractors' },
        specialty: { category: 'General Surgery', subcategory: 'Exposure' }
    },

    // ─────────────────────────────────────────────────────────
    // SUTURING & WOUND CARE
    // ─────────────────────────────────────────────────────────
    '07': {
        instrument: { category: 'Suturing & Wound Care', subcategory: 'Probes & Sounds' },
        specialty: { category: 'General Surgery', subcategory: 'Wound Care' }
    },
    '08': {
        instrument: { category: 'Suturing & Wound Care', subcategory: 'Dressing Instruments' },
        specialty: { category: 'General Surgery', subcategory: 'Wound Care' }
    },
    '10': {
        instrument: { category: 'Suturing & Wound Care', subcategory: 'Needle Holders' },
        specialty: { category: 'General Surgery', subcategory: 'Suturing' }
    },

    // ─────────────────────────────────────────────────────────
    // ACCESS & CANNULATION
    // ─────────────────────────────────────────────────────────
    '09': {
        instrument: { category: 'Access & Cannulation', subcategory: 'Trocars & Cannulas' },
        specialty: { category: 'Laparoscopic Surgery', subcategory: 'Access' }
    },

    // ─────────────────────────────────────────────────────────
    // SPECIALTY - ABDOMINAL & VISCERAL
    // ─────────────────────────────────────────────────────────
    '11': {
        instrument: { category: 'Specialty Instruments', subcategory: 'GI Instruments' },
        specialty: { category: 'General & Abdominal Surgery', subcategory: 'GI & Abdominal' }
    },
    '18': {
        instrument: { category: 'Specialty Instruments', subcategory: 'Hepatobiliary' },
        specialty: { category: 'General & Abdominal Surgery', subcategory: 'Liver, Kidney & Urology' }
    },

    // ─────────────────────────────────────────────────────────
    // SPECIALTY - CARDIOVASCULAR
    // ─────────────────────────────────────────────────────────
    '14': {
        instrument: { category: 'Specialty Instruments', subcategory: 'Cardiovascular' },
        specialty: { category: 'Cardiovascular Surgery', subcategory: 'Cardiac & Vascular' }
    },

    // ─────────────────────────────────────────────────────────
    // SPECIALTY - NEUROSURGERY
    // ─────────────────────────────────────────────────────────
    '15': {
        instrument: { category: 'Specialty Instruments', subcategory: 'Neurosurgical' },
        specialty: { category: 'Neurosurgery', subcategory: 'Brain & Spine' }
    },

    // ─────────────────────────────────────────────────────────
    // SPECIALTY - OB/GYN
    // ─────────────────────────────────────────────────────────
    '19': {
        instrument: { category: 'Specialty Instruments', subcategory: 'Gynecological' },
        specialty: { category: 'OB/GYN', subcategory: 'Gynecology' }
    },
    '20': {
        instrument: { category: 'Specialty Instruments', subcategory: 'Obstetric' },
        specialty: { category: 'OB/GYN', subcategory: 'Obstetrics' }
    },

    // ─────────────────────────────────────────────────────────
    // SPECIALTY - ENT & HEAD/NECK
    // ─────────────────────────────────────────────────────────
    '23': {
        instrument: { category: 'Specialty Instruments', subcategory: 'ENT' },
        specialty: { category: 'ENT & Head/Neck', subcategory: 'Otology (Ear)' }
    },
    '24': {
        instrument: { category: 'Specialty Instruments', subcategory: 'ENT' },
        specialty: { category: 'ENT & Head/Neck', subcategory: 'Rhinology (Nose)' }
    },
    '27': {
        instrument: { category: 'Specialty Instruments', subcategory: 'ENT' },
        specialty: { category: 'ENT & Head/Neck', subcategory: 'Laryngoscopy & Tonsillectomy' }
    },
    '29': {
        instrument: { category: 'Specialty Instruments', subcategory: 'ENT' },
        specialty: { category: 'ENT & Head/Neck', subcategory: 'Tracheotomy' }
    },

    // ─────────────────────────────────────────────────────────
    // SPECIALTY - ORAL & MAXILLOFACIAL
    // ─────────────────────────────────────────────────────────
    '25': {
        instrument: { category: 'Specialty Instruments', subcategory: 'Oral-Maxillofacial' },
        specialty: { category: 'Oral & Maxillofacial', subcategory: 'TMJ & Dental' }
    },
    '26': {
        instrument: { category: 'Specialty Instruments', subcategory: 'Craniofacial' },
        specialty: { category: 'Oral & Maxillofacial', subcategory: 'Craniofacial' }
    },

    // ─────────────────────────────────────────────────────────
    // SPECIALTY - DERMATOLOGY & AESTHETICS
    // ─────────────────────────────────────────────────────────
    '21': {
        instrument: { category: 'Specialty Instruments', subcategory: 'Dermatology' },
        specialty: { category: 'Dermatology & Aesthetics', subcategory: 'Skin Procedures' }
    },

    // ─────────────────────────────────────────────────────────
    // MEASUREMENT & DIAGNOSTICS
    // ─────────────────────────────────────────────────────────
    '13': {
        instrument: { category: 'Measurement & Diagnostics', subcategory: 'Calipers & Measuring' },
        specialty: { category: 'Diagnostics & Support', subcategory: 'Measurement' }
    },
    '16': {
        instrument: { category: 'Measurement & Diagnostics', subcategory: 'Diagnostic Sets' },
        specialty: { category: 'Diagnostics & Support', subcategory: 'Diagnostics' }
    },
    '17': {
        instrument: { category: 'Measurement & Diagnostics', subcategory: 'Anaesthesia' },
        specialty: { category: 'Anaesthesia', subcategory: 'Anaesthesia Equipment' }
    },

    // ─────────────────────────────────────────────────────────
    // HOLLOWARE & ACCESSORIES
    // ─────────────────────────────────────────────────────────
    '22': {
        instrument: { category: 'Holloware & Accessories', subcategory: 'Dissecting Kits' },
        specialty: { category: 'Education & Training', subcategory: 'Dissecting Kits' }
    },
    '28': {
        instrument: { category: 'Holloware & Accessories', subcategory: 'Holloware & Basins' },
        specialty: { category: 'Support Equipment', subcategory: 'Holloware' }
    },
    '30': {
        instrument: { category: 'Holloware & Accessories', subcategory: 'Instrument Sets' },
        specialty: { category: 'Support Equipment', subcategory: 'Instrument Sets' }
    },
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
            .select('id, sku, name')
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

// Get mapping from SKU
function getMappingFromSku(sku: string): DualMapping | null {
    const prefix = sku.split('-')[0];
    return SKU_DUAL_MAPPING[prefix] || null;
}

async function main() {
    const DRY_RUN = process.argv.includes('--dry-run');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('     DUAL HIERARCHY CATEGORY MIGRATION                     ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (preview only)' : '⚡ LIVE (will update database)'}\n`);

    const products = await fetchAllProducts();
    console.log(`Total products: ${products.length}\n`);

    // Analyze changes
    let toUpdate = 0;
    let noMapping = 0;
    const changes: {
        id: string;
        sku: string;
        instrument: { category: string; subcategory: string };
        specialty: { category: string; subcategory: string };
    }[] = [];
    const unmapped: { sku: string; name: string }[] = [];

    // Stats
    const instrumentStats: Record<string, number> = {};
    const specialtyStats: Record<string, number> = {};

    for (const product of products) {
        const mapping = getMappingFromSku(product.sku);

        if (!mapping) {
            noMapping++;
            unmapped.push({ sku: product.sku, name: product.name });
            continue;
        }

        // Track stats
        instrumentStats[mapping.instrument.category] = (instrumentStats[mapping.instrument.category] || 0) + 1;
        specialtyStats[mapping.specialty.category] = (specialtyStats[mapping.specialty.category] || 0) + 1;

        toUpdate++;
        changes.push({
            id: product.id,
            sku: product.sku,
            instrument: mapping.instrument,
            specialty: mapping.specialty
        });
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('                      SUMMARY                               ');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`  🔄 Will be updated: ${toUpdate}`);
    console.log(`  ❓ No SKU mapping:  ${noMapping}\n`);

    // Show instrument breakdown
    console.log('🔧 Products per INSTRUMENT category:');
    Object.entries(instrumentStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

    console.log('\n🏥 Products per SPECIALTY category:');
    Object.entries(specialtyStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

    // Show sample changes
    console.log('\nSample changes (first 5):');
    changes.slice(0, 5).forEach(c => {
        console.log(`  ${c.sku}:`);
        console.log(`    🔧 Instrument: "${c.instrument.category} → ${c.instrument.subcategory}"`);
        console.log(`    🏥 Specialty:  "${c.specialty.category} → ${c.specialty.subcategory}"`);
    });

    // Show unmapped
    if (unmapped.length > 0) {
        console.log(`\n⚠️  Unmapped SKU prefixes:`);
        const prefixes = new Set(unmapped.map(u => u.sku.split('-')[0]));
        Array.from(prefixes).forEach(p => console.log(`  - ${p}`));
    }

    if (DRY_RUN) {
        console.log('\n\n🔍 DRY RUN complete. Run without --dry-run to apply changes.');
        console.log('\n📋 SQL to run in Supabase first:');
        console.log('─────────────────────────────────────────────────────────');
        console.log(`ALTER TABLE products
ADD COLUMN IF NOT EXISTS instrument_category VARCHAR,
ADD COLUMN IF NOT EXISTS instrument_subcategory VARCHAR,
ADD COLUMN IF NOT EXISTS specialty_category VARCHAR,
ADD COLUMN IF NOT EXISTS specialty_subcategory VARCHAR;

CREATE INDEX IF NOT EXISTS idx_products_instrument_category ON products(instrument_category);
CREATE INDEX IF NOT EXISTS idx_products_specialty_category ON products(specialty_category);`);
        console.log('─────────────────────────────────────────────────────────');
        return;
    }

    // Apply changes
    console.log('\n\n⚡ Applying changes...\n');

    let success = 0;
    let failed = 0;
    const BATCH_SIZE = 50;

    for (let i = 0; i < changes.length; i += BATCH_SIZE) {
        const batch = changes.slice(i, i + BATCH_SIZE);

        for (const change of batch) {
            const { error } = await supabase
                .from('products')
                .update({
                    instrument_category: change.instrument.category,
                    instrument_subcategory: change.instrument.subcategory,
                    specialty_category: change.specialty.category,
                    specialty_subcategory: change.specialty.subcategory
                })
                .eq('id', change.id);

            if (error) {
                failed++;
                if (failed <= 5) {
                    console.error(`  ❌ Failed: ${change.sku} - ${error.message}`);
                }
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
