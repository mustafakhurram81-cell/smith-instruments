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
}

// Get all unique categories
export async function getCategories(): Promise<string[]> {
    console.log('Fetching categories...');
    const { data, error } = await supabase
        .from('products')
        .select('category');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    console.log('Raw data from Supabase:', data);

    // Get unique categories
    const categories = [...new Set(data.map(d => d.category))].filter(Boolean).sort();
    console.log('Processed categories:', categories);
    return categories;
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

// Get detailed category info (count + image) - with pagination to get ALL products
export async function getCategoryDetails(): Promise<{ name: string; count: number; image: string }[]> {
    console.log('Fetching category details...');

    // Paginate to get ALL products (Supabase defaults to 1000 max)
    const PAGE_SIZE = 1000;
    let allCategories: { category: string }[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('category')
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching categories:', error);
            break;
        }

        if (data && data.length > 0) {
            allCategories = [...allCategories, ...data];
            from += PAGE_SIZE;
            hasMore = data.length === PAGE_SIZE;
        } else {
            hasMore = false;
        }
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

    // 2. Fetch one image for each category in parallel
    const details = await Promise.all(Array.from(uniqueCategories).map(async (cat) => {
        // Fetch 1 product with an image for this category
        const { data } = await supabase
            .from('products')
            .select('image_url')
            .eq('category', cat)
            .neq('image_url', '') // Ensure it has an image
            .limit(1);

        return {
            name: cat,
            count: counts[cat],
            image: data?.[0]?.image_url || ''
        };
    }));

    return details.sort((a, b) => b.count - a.count);
}
