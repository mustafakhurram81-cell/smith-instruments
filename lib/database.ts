import { supabase } from './supabase';

// Product type from Supabase
export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    image_url: string;
    specifications: any;
    variant_group?: string; // Groups products that are variations of each other
    catalogue_id?: string; // Links to the catalogue this product appears in
    // Dual navigation fields
    instrument_category?: string;
    instrument_subcategory?: string;
    specialty_category?: string;
    specialty_subcategory?: string;
}

// Catalogue reference type (subset of full Catalogue)
export interface CatalogueRef {
    id: string;
    title: string;
    pdf_url: string;
}

// Get catalogue by ID
export async function getCatalogueById(id: string): Promise<CatalogueRef | null> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('id, title, pdf_url')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

// Get catalogue by title (case-insensitive)
export async function getCatalogueByTitle(title: string): Promise<CatalogueRef | null> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('id, title, pdf_url')
        .ilike('title', title)
        .eq('is_active', true)
        .single();

    if (error) return null;
    return data;
}

// Mapping from SKU prefix (first 2 digits) → catalogue title
// Each product's SKU follows the pattern XX-YYY-ZZ where XX determines which catalogue it belongs to
const SKU_PREFIX_TO_CATALOGUE: Record<string, string> = {
    '01': 'Scalpels',                                 // 01-100-01 to 01-208-00
    '02': 'Scissors',                                 // 02-100-12 to 02-606-16
    '03': 'Dissecting & Tissue Forceps',              // 03-100-10 to 03-562-03
    '04': 'Artery Forceps',                           // 04-100-02 to 04-828-18
    '05': 'Cotton Swab Forceps',                      // 05-100-22 to 05-156-26
    '06': 'Retractors',                               // 06-100-12 to 06-700-01
    '07': 'Probes',                                   // 07-100-13 to 07-186-90
    '08': 'Diagnostics',                              // 08-100-18 to 08-275-40
    '09': 'Trocars, Suction Tubes & Cannulas',        // 09-100-18 to 09-310-01
    '10': 'Anaesthesia',                              // 10-100-01 to 10-170-25
    '11': 'Suture',                                   // 11-100-01 to 11-646-14
    '12': 'Bone Surgery',                             // 12-100-24 to 12-216-26
    '13': 'Bone Surgery',                             // 13-100-24 to 13-992-04
    '14': 'Cardiovascular Surgery',                   // 14-100-23 to 14-546-04
    '15': 'Neurosurgery & Laminectomy',               // 15-100-30 to 15-702-16
    '16': 'Tracheotomy',                              // 16-100-14 to 16-150-10
    '17': 'Dermatology',                              // 17-100-01 to 17-160-23
    '18': 'Stomach, Intestines & Rectum',             // 18-100-12 to 18-360-38
    '19': 'Liver, Gall Bladder, Kidney & Urology',   // 19-100-01 to 19-216-12
    '20': 'Gynecology',                               // 20-100-01 to 20-548-28
    '21': 'Obstetrics',                               // 21-100-35 to 21-266-08
    // '22': no catalogue for Ophthalmology
    '23': 'Otology',                                  // 23-100-01 to 23-568-92
    '24': 'Rhinology',                                // 24-100-14 to 24-424-03
    '25': 'Oral Maxillo-Facial Surgery',              // 25-100-17 to 25-480-08
    '26': 'Tonsillectomy & Laryngo-Bronchoscopy',     // 26-100-18 to 26-310-12
    '27': 'Cranio-Maxillo-Facial Surgery',            // 27-100-16 to 27-302-17
    '28': 'Holloware',                                // 28-100-22 to 28-422-15
    '29': 'Dissecting Kits',                          // 29-100-09 to 29-141-15
};

// Find the matching catalogue for a product based on its SKU prefix
export async function getCatalogueForProduct(product: Product): Promise<CatalogueRef | null> {
    // Extract the SKU prefix (first 2 digits before the first dash)
    const prefix = product.sku.split('-')[0];
    const catalogueTitle = SKU_PREFIX_TO_CATALOGUE[prefix];

    if (catalogueTitle) {
        return getCatalogueByTitle(catalogueTitle);
    }

    return null;
}

// Get subcategories for a category with counts and images - with pagination
export async function getSubcategoryDetails(category: string): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_subcategory_details', { p_category: category });
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching subcategory details:', error);
        return [];
    }
    return data || [];
}

// ═══════════════════════════════════════════════════════════
// INSTRUMENT CATEGORY GROUPINGS
// Maps subcategories to parent instrument categories for "Browse by Instrument Type"
// ═══════════════════════════════════════════════════════════

export const INSTRUMENT_CATEGORY_MAP: Record<string, string> = {
    // Cutting Instruments
    'Scissors': 'Cutting Instruments',
    'Scalpels & Handles': 'Cutting Instruments',
    'Bone Cutting Instruments': 'Cutting Instruments',
    'Bone Cutting': 'Cutting Instruments',

    // Forceps & Clamps  
    'Tissue Forceps': 'Forceps & Clamps',
    'Hemostatic Forceps': 'Forceps & Clamps',
    'Sponge & Swab Forceps': 'Forceps & Clamps',
    'Sponge Forceps': 'Forceps & Clamps',

    // Retractors
    'General Retractors': 'Retractors',

    // Suturing & Wound Care
    'Needle Holders & Suturing': 'Suturing & Wound Care',
    'Needle Holders': 'Suturing & Wound Care',
    'Probes & Sounds': 'Suturing & Wound Care',
    'Dressing Instruments': 'Suturing & Wound Care',
    'Dressing': 'Suturing & Wound Care',

    // Access Instruments
    'Trocars & Cannulas': 'Access Instruments',

    // Specialty Instruments (procedure-specific)
    'Cardiovascular': 'Specialty Instruments',
    'Neurosurgery': 'Specialty Instruments',
    'GI & Abdominal': 'Specialty Instruments',
    'Gynecology': 'Specialty Instruments',
    'Obstetrics': 'Specialty Instruments',
    'Hepatobiliary & Urology': 'Specialty Instruments',
    'Rhinology (Nose)': 'Specialty Instruments',
    'Otology (Ear)': 'Specialty Instruments',
    'Oral & Maxillofacial': 'Specialty Instruments',
    'Craniofacial': 'Specialty Instruments',
    'Laryngoscopy & Tonsillectomy': 'Specialty Instruments',
    'Tracheotomy': 'Specialty Instruments',
    'Dermatology': 'Specialty Instruments',

    // Accessories & Diagnostics
    'Holloware & Basins': 'Accessories & Diagnostics',
    'Calipers & Measuring': 'Accessories & Diagnostics',
    'Diagnostic Instruments': 'Accessories & Diagnostics',
    'Anaesthesia': 'Accessories & Diagnostics',
    'Dissecting Kits': 'Accessories & Diagnostics',
    'Instrument Sets': 'Accessories & Diagnostics',
};

// Get parent instrument category for a subcategory
export function getInstrumentCategoryFor(subcategory: string): string {
    return INSTRUMENT_CATEGORY_MAP[subcategory] || 'Other Instruments';
}

// Get instrument categories (parent level) with counts and images
export async function getInstrumentCategories(): Promise<{ name: string; count: number; image: string; subcategories: string[] }[]> {
    const { data, error } = await supabase.rpc('get_instrument_categories_with_subs');
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching products for instrument categories:', error);
        return [];
    }
    return data || [];
}

// Get subcategories within an instrument category
export async function getInstrumentSubcategories(instrumentCategory: string): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_instrument_subcategory_details', { p_category: instrumentCategory });
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching products:', error);
        return [];
    }
    return data || [];
}

// Get all instrument types (subcategories) across all categories with counts
export async function getInstrumentTypes(): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_all_instrument_types');
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching instrument types:', error);
        return [];
    }
    return data || [];
}

// ═══════════════════════════════════════════════════════════
// DUAL NAVIGATION QUERIES (using new columns)
// ═══════════════════════════════════════════════════════════

// Get specialty categories with counts and images
export async function getSpecialtyCategories(): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_specialty_categories_details');
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching specialty categories:', error);
        return [];
    }
    return data || [];
}

// Get specialty subcategories for a category
export async function getSpecialtySubcategories(category: string): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_specialty_subcategory_details', { p_category: category });
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching specialty subcategories:', error);
        return [];
    }
    return data || [];
}

// Get products by specialty category and subcategory
export async function getProductsBySpecialty(category: string, subcategory?: string, page: number = 1, limit: number = 24): Promise<{ data: Product[]; count: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('specialty_category', category);

    if (subcategory) {
        query = query.eq('specialty_subcategory', subcategory);
    }

    const { data, error, count } = await query
        .order('sku', { ascending: true })
        .range(from, to);

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching products by specialty:', error);
        return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
}

// Get instrument categories with counts and images (from new column)
export async function getInstrumentCategoriesNew(): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_instrument_category_details');
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching instrument categories:', error);
        return [];
    }
    return data || [];
}

// Get instrument subcategories for a category (from new column)
export async function getInstrumentSubcategoriesNew(category: string): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_instrument_subcategory_details', { p_category: category });
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching instrument subcategories:', error);
        return [];
    }
    return data || [];
}

// Get products by instrument category and subcategory
export async function getProductsByInstrument(category: string, subcategory?: string, page: number = 1, limit: number = 24): Promise<{ data: Product[]; count: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('instrument_category', category);

    if (subcategory) {
        query = query.eq('instrument_subcategory', subcategory);
    }

    const { data, error, count } = await query
        .order('sku', { ascending: true })
        .range(from, to);

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching products by instrument:', error);
        return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
}

// Get products by category - with pagination to get ALL
export async function getProductsByCategory(category: string, page: number = 1, limit: number = 24): Promise<{ data: Product[]; count: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('sku', { ascending: true })
        .range(from, to);

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching products by category:', error);
        return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
}

// Get products by category and subcategory
export async function getProductsBySubcategory(category: string, subcategory: string, page: number = 1, limit: number = 24): Promise<{ data: Product[]; count: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .eq('subcategory', subcategory)
        .order('sku', { ascending: true })
        .range(from, to);

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching products by subcategory:', error);
        return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
}

// Get single product by SKU
export async function getProductBySku(sku: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching product:', error);
        return null;
    }

    return data;
}

// Sanitize input for PostgREST filter queries
function sanitizeFilterInput(input: string): string {
    // Escape characters that have special meaning in PostgREST filters
    return input.replace(/[%_().,\\"]/g, '\\$&');
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
    const sanitized = sanitizeFilterInput(query.trim());
    if (!sanitized) return [];

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${sanitized}%,sku.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
        .limit(50);

    if (error) {
        if (import.meta.env.DEV) console.error('Error searching products:', error);
        return [];
    }

    return data || [];
}

// Get product variants - finds products with same SKU prefix
// e.g., 01-100-01, 01-100-02, 01-100-03 are variants (prefix: 01-100)
export async function getProductVariants(sku: string): Promise<Product[]> {
    // Extract the SKU prefix (everything before the last dash and number)
    // Pattern: XX-XXX-YY where YY is the variant number
    const skuParts = sku.split('-');

    if (skuParts.length < 3) {
        // SKU doesn't follow the expected pattern
        return [];
    }

    // Get the prefix (all parts except the last one)
    const prefix = skuParts.slice(0, -1).join('-');

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('sku', `${prefix}-%`)
        .order('sku', { ascending: true });

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching product variants:', error);
        return [];
    }

    // Filter to ensure we only get actual variants (same prefix pattern)
    const variants = (data || []).filter(p => {
        const pParts = p.sku.split('-');
        if (pParts.length < 3) return false;
        const pPrefix = pParts.slice(0, -1).join('-');
        return pPrefix === prefix;
    });

    return variants;
}

// Get detailed category info (count + image) - with pagination to get ALL products
export async function getCategoryDetails(): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_category_details');
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching category details:', error);
        return [];
    }
    return data || [];
}

// Optimization: Get ONLY category names for the Header (skips expensive image/count lookups)
export async function getCategoryNames(): Promise<string[]> {
    try {
        // Try to use RPC function for max performance (needs to be created in Supabase)
        // SQL: CREATE OR REPLACE FUNCTION get_distinct_categories()
        // RETURNS TABLE(category text) AS $$
        //   SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' ORDER BY category;
        // $$ LANGUAGE SQL STABLE;

        const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_distinct_categories');

        if (!rpcError && rpcData) {
            return rpcData.map((row: any) => row.category);
        }

        // Fallback: Use a more efficient query with limit
        // This limits to 1000 products to extract categories (should be enough to get all unique ones)
        const { data, error } = await supabase
            .from('products')
            .select('category')
            .not('category', 'is', null)
            .neq('category', '')
            .limit(1000); // Limit for performance

        if (error) {
            if (import.meta.env.DEV) console.error('Error fetching category names:', error);
            return [];
        }

        const uniqueCategories = new Set<string>();
        data?.forEach(p => {
            if (p.category) uniqueCategories.add(p.category);
        });

        return Array.from(uniqueCategories).sort();
    } catch (err) {
        if (import.meta.env.DEV) console.error('Error in getCategoryNames:', err);
        return [];
    }
}

// ============================================
// CATALOGUES
// ============================================

export interface Catalogue {
    id: string;
    title: string;
    description: string;
    category: string;
    size: string;
    color: string;
    pdf_url: string;
    thumbnail_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

// Get all active catalogues (for public display)
export async function getCatalogues(): Promise<Catalogue[]> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching catalogues:', error);
        return [];
    }

    return data || [];
}

// Get all catalogues including inactive (for admin)
export async function getAllCatalogues(): Promise<Catalogue[]> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching all catalogues:', error);
        return [];
    }

    return data || [];
}

// Get unique catalogue categories
export async function getCatalogueCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('category')
        .eq('is_active', true);

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching catalogue categories:', error);
        return [];
    }

    const uniqueCategories = new Set<string>();
    data?.forEach(c => {
        if (c.category) uniqueCategories.add(c.category);
    });

    return ['All', ...Array.from(uniqueCategories).sort()];
}

// Create a new catalogue (admin)
export async function createCatalogue(catalogue: Omit<Catalogue, 'id' | 'created_at'>): Promise<Catalogue | null> {
    const { data, error } = await supabase
        .from('catalogues')
        .insert(catalogue)
        .select()
        .single();

    if (error) {
        if (import.meta.env.DEV) console.error('Error creating catalogue:', error);
        return null;
    }

    return data;
}

// Update a catalogue (admin)
export async function updateCatalogue(id: string, updates: Partial<Catalogue>): Promise<Catalogue | null> {
    const { data, error } = await supabase
        .from('catalogues')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (import.meta.env.DEV) console.error('Error updating catalogue:', error);
        return null;
    }

    return data;
}

// Delete a catalogue (admin)
export async function deleteCatalogue(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('catalogues')
        .delete()
        .eq('id', id);

    if (error) {
        if (import.meta.env.DEV) console.error('Error deleting catalogue:', error);
        return false;
    }

    return true;
}
