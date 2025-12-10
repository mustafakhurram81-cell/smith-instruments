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
