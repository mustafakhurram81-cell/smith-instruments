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

// Get subcategories for a category with counts and images - with pagination
export async function getSubcategoryDetails(category: string): Promise<{ name: string; count: number; image: string }[]> {
    // Paginate to get ALL products for this category
    const PAGE_SIZE = 1000;
    let allProducts: { subcategory: string; image_url: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('subcategory, image_url')
            .eq('category', category)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching subcategory details:', error);
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

    // Calculate counts and get one image per subcategory
    const counts: Record<string, number> = {};
    const images: Record<string, string> = {};
    const uniqueSubcategories = new Set<string>();

    allProducts.forEach(p => {
        if (p.subcategory && p.subcategory !== 'General') {
            counts[p.subcategory] = (counts[p.subcategory] || 0) + 1;
            uniqueSubcategories.add(p.subcategory);
            // Store first image found for each subcategory
            if (!images[p.subcategory] && p.image_url) {
                images[p.subcategory] = p.image_url;
            }
        }
    });

    const details = Array.from(uniqueSubcategories).map(sub => ({
        name: sub,
        count: counts[sub] || 0,
        image: images[sub] || ''
    }));

    return details.sort((a, b) => a.name.localeCompare(b.name));
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
    const PAGE_SIZE = 1000;
    let allProducts: { subcategory: string; image_url: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('subcategory, image_url')
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching products for instrument categories:', error);
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

    // Group by instrument category
    const categoryData: Record<string, { count: number; image: string; subcategories: Set<string> }> = {};

    allProducts.forEach(p => {
        if (p.subcategory && p.subcategory !== 'General') {
            const instrumentCategory = getInstrumentCategoryFor(p.subcategory);

            if (!categoryData[instrumentCategory]) {
                categoryData[instrumentCategory] = { count: 0, image: '', subcategories: new Set() };
            }

            categoryData[instrumentCategory].count++;
            categoryData[instrumentCategory].subcategories.add(p.subcategory);

            if (!categoryData[instrumentCategory].image && p.image_url) {
                categoryData[instrumentCategory].image = p.image_url;
            }
        }
    });

    return Object.entries(categoryData)
        .map(([name, data]) => ({
            name,
            count: data.count,
            image: data.image,
            subcategories: Array.from(data.subcategories).sort()
        }))
        .sort((a, b) => b.count - a.count);
}

// Get subcategories within an instrument category
export async function getInstrumentSubcategories(instrumentCategory: string): Promise<{ name: string; count: number; image: string }[]> {
    const PAGE_SIZE = 1000;
    let allProducts: { subcategory: string; image_url: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('subcategory, image_url')
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching products:', error);
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

    // Filter to subcategories that belong to this instrument category
    const counts: Record<string, number> = {};
    const images: Record<string, string> = {};

    allProducts.forEach(p => {
        if (p.subcategory && p.subcategory !== 'General') {
            const parentCategory = getInstrumentCategoryFor(p.subcategory);
            if (parentCategory === instrumentCategory) {
                counts[p.subcategory] = (counts[p.subcategory] || 0) + 1;
                if (!images[p.subcategory] && p.image_url) {
                    images[p.subcategory] = p.image_url;
                }
            }
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({
            name,
            count,
            image: images[name] || ''
        }))
        .sort((a, b) => b.count - a.count);
}

// Get all instrument types (subcategories) across all categories with counts
export async function getInstrumentTypes(): Promise<{ name: string; count: number; image: string }[]> {
    const PAGE_SIZE = 1000;
    let allProducts: { subcategory: string; image_url: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('subcategory, image_url')
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching instrument types:', error);
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

    // Aggregate by subcategory
    const counts: Record<string, number> = {};
    const images: Record<string, string> = {};

    allProducts.forEach(p => {
        if (p.subcategory && p.subcategory !== 'General') {
            counts[p.subcategory] = (counts[p.subcategory] || 0) + 1;
            if (!images[p.subcategory] && p.image_url) {
                images[p.subcategory] = p.image_url;
            }
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({
            name,
            count,
            image: images[name] || ''
        }))
        .sort((a, b) => b.count - a.count); // Sort by count descending
}

// ═══════════════════════════════════════════════════════════
// DUAL NAVIGATION QUERIES (using new columns)
// ═══════════════════════════════════════════════════════════

// Get specialty categories with counts and images
export async function getSpecialtyCategories(): Promise<{ name: string; count: number; image: string }[]> {
    const PAGE_SIZE = 1000;
    let allProducts: { specialty_category: string; image_url: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('specialty_category, image_url')
            .not('specialty_category', 'is', null)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching specialty categories:', error);
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

    const counts: Record<string, number> = {};
    const images: Record<string, string> = {};

    allProducts.forEach(p => {
        if (p.specialty_category) {
            counts[p.specialty_category] = (counts[p.specialty_category] || 0) + 1;
            if (!images[p.specialty_category] && p.image_url) {
                images[p.specialty_category] = p.image_url;
            }
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({
            name,
            count,
            image: images[name] || ''
        }))
        .sort((a, b) => b.count - a.count);
}

// Get specialty subcategories for a category
export async function getSpecialtySubcategories(category: string): Promise<{ name: string; count: number; image: string }[]> {
    const PAGE_SIZE = 1000;
    let allProducts: { specialty_subcategory: string; image_url: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('specialty_subcategory, image_url')
            .eq('specialty_category', category)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching specialty subcategories:', error);
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

    const counts: Record<string, number> = {};
    const images: Record<string, string> = {};

    allProducts.forEach(p => {
        if (p.specialty_subcategory) {
            counts[p.specialty_subcategory] = (counts[p.specialty_subcategory] || 0) + 1;
            if (!images[p.specialty_subcategory] && p.image_url) {
                images[p.specialty_subcategory] = p.image_url;
            }
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({
            name,
            count,
            image: images[name] || ''
        }))
        .sort((a, b) => b.count - a.count);
}

// Get products by specialty category and subcategory
export async function getProductsBySpecialty(category: string, subcategory?: string): Promise<Product[]> {
    const PAGE_SIZE = 1000;
    let allProducts: Product[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        let query = supabase
            .from('products')
            .select('*')
            .eq('specialty_category', category);

        if (subcategory) {
            query = query.eq('specialty_subcategory', subcategory);
        }

        const { data, error } = await query.range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching products by specialty:', error);
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

// Get instrument categories with counts and images (from new column)
export async function getInstrumentCategoriesNew(): Promise<{ name: string; count: number; image: string }[]> {
    const PAGE_SIZE = 1000;
    let allProducts: { instrument_category: string; image_url: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('instrument_category, image_url')
            .not('instrument_category', 'is', null)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching instrument categories:', error);
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

    const counts: Record<string, number> = {};
    const images: Record<string, string> = {};

    allProducts.forEach(p => {
        if (p.instrument_category) {
            counts[p.instrument_category] = (counts[p.instrument_category] || 0) + 1;
            if (!images[p.instrument_category] && p.image_url) {
                images[p.instrument_category] = p.image_url;
            }
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({
            name,
            count,
            image: images[name] || ''
        }))
        .sort((a, b) => b.count - a.count);
}

// Get instrument subcategories for a category (from new column)
export async function getInstrumentSubcategoriesNew(category: string): Promise<{ name: string; count: number; image: string }[]> {
    const PAGE_SIZE = 1000;
    let allProducts: { instrument_subcategory: string; image_url: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('instrument_subcategory, image_url')
            .eq('instrument_category', category)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching instrument subcategories:', error);
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

    const counts: Record<string, number> = {};
    const images: Record<string, string> = {};

    allProducts.forEach(p => {
        if (p.instrument_subcategory) {
            counts[p.instrument_subcategory] = (counts[p.instrument_subcategory] || 0) + 1;
            if (!images[p.instrument_subcategory] && p.image_url) {
                images[p.instrument_subcategory] = p.image_url;
            }
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({
            name,
            count,
            image: images[name] || ''
        }))
        .sort((a, b) => b.count - a.count);
}

// Get products by instrument category and subcategory
export async function getProductsByInstrument(category: string, subcategory?: string): Promise<Product[]> {
    const PAGE_SIZE = 1000;
    let allProducts: Product[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        let query = supabase
            .from('products')
            .select('*')
            .eq('instrument_category', category);

        if (subcategory) {
            query = query.eq('instrument_subcategory', subcategory);
        }

        const { data, error } = await query.range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching products by instrument:', error);
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

// Get products by category - with pagination to get ALL
export async function getProductsByCategory(category: string): Promise<Product[]> {
    const PAGE_SIZE = 1000;
    let allProducts: Product[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching products:', error);
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

// Get products by category and subcategory
export async function getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('subcategory', subcategory);

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
}

// Get single product by SKU
export async function getProductBySku(sku: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data;
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(50);

    if (error) {
        console.error('Error searching products:', error);
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
        console.error('Error fetching product variants:', error);
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
    console.log('Fetching category details...');

    // Paginate to get ALL products (Supabase defaults to 1000 max)
    const PAGE_SIZE = 1000;
    let allCategories: { category: string }[] = [];
    let from = 0;
    let hasMore = true;
    let safetyCounter = 0;

    try {
        while (hasMore && safetyCounter < 20) { // Safety limit: 20k items max
            const { data, error } = await supabase
                .from('products')
                .select('category')
                .range(from, from + PAGE_SIZE - 1);

            if (error) {
                console.error('Error fetching categories:', error);
                throw error;
            }

            if (data && data.length > 0) {
                allCategories = [...allCategories, ...data];
                from += PAGE_SIZE;
                hasMore = data.length === PAGE_SIZE;
            } else {
                hasMore = false;
            }
            safetyCounter++;
        }
    } catch (err) {
        console.error("Critical error in getCategoryDetails loop:", err);
        // Continue with what we have if possible?
        if (allCategories.length === 0) return [];
    }

    console.log(`Total products fetched for counts: ${allCategories.length}`);

    // Calculate counts locally
    const counts: Record<string, number> = {};
    const uniqueCategories = new Set<string>();

    allCategories.forEach(p => {
        if (p.category) {
            counts[p.category] = (counts[p.category] || 0) + 1;
            uniqueCategories.add(p.category);
        }
    });

    // 2. Fetch one image for each category in parallel with timeout/safety
    const details = await Promise.all(Array.from(uniqueCategories).map(async (cat) => {
        try {
            // Fetch 1 product with an image for this category
            const { data, error } = await supabase
                .from('products')
                .select('image_url')
                .eq('category', cat)
                .neq('image_url', '') // Ensure it has an image
                .limit(1);

            if (error) throw error;

            return {
                name: cat,
                count: counts[cat],
                image: data?.[0]?.image_url || ''
            };
        } catch (e) {
            console.error(`Error fetching image for category ${cat}:`, e);
            return {
                name: cat,
                count: counts[cat],
                image: ''
            };
        }
    }));

    return details.sort((a, b) => b.count - a.count);
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
            console.error('Error fetching category names:', error);
            return [];
        }

        const uniqueCategories = new Set<string>();
        data?.forEach(p => {
            if (p.category) uniqueCategories.add(p.category);
        });

        return Array.from(uniqueCategories).sort();
    } catch (err) {
        console.error('Error in getCategoryNames:', err);
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
        console.error('Error fetching catalogues:', error);
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
        console.error('Error fetching all catalogues:', error);
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
        console.error('Error fetching catalogue categories:', error);
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
        console.error('Error creating catalogue:', error);
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
        console.error('Error updating catalogue:', error);
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
        console.error('Error deleting catalogue:', error);
        return false;
    }

    return true;
}
