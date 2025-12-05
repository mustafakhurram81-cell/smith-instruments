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

// Get subcategories for a category
export async function getSubcategories(category: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('products')
        .select('subcategory')
        .eq('category', category)
        .neq('subcategory', 'General');

    if (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }

    // Get unique subcategories
    const subcategories = [...new Set(data.map(d => d.subcategory))].filter(Boolean).sort();
    return subcategories;
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .limit(2000); // Increased limit

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
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

// Get detailed category info (count + image)
export async function getCategoryDetails(): Promise<{ name: string; count: number; image: string }[]> {
    console.log('Fetching category details...');

    // 1. Get counts using a light query (headless)
    const { data: categories, error } = await supabase
        .from('products')
        .select('category');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // Calculate counts locally
    const counts: Record<string, number> = {};
    const uniqueCategories = new Set<string>();

    categories.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
        uniqueCategories.add(p.category);
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
