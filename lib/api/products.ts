import { supabase } from '../supabase';
import type { Product } from '../types';

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

// Get products by category and subcategory (with optional search)
export async function getProductsBySubcategory(category: string, subcategory: string, page: number = 1, limit: number = 24, search: string = ''): Promise<{ data: Product[]; count: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .eq('subcategory', subcategory);

    if (search && search.trim() !== '') {
        const safeSearch = search.trim().replace(/'/g, "''"); // escape single quotes for postgrest
        query = query.or(`name.ilike.%${safeSearch}%,sku.ilike.%${safeSearch}%`);
    }

    const { data, error, count } = await query
        .order('sku', { ascending: true })
        .range(from, to);

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching products by subcategory:', error);
        return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
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
export function sanitizeFilterInput(input: string): string {
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

// Get product variants
export async function getProductVariants(sku: string): Promise<Product[]> {
    const skuParts = sku.split('-');

    if (skuParts.length < 3) {
        return [];
    }

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

    const variants = (data || []).filter(p => {
        const pParts = p.sku.split('-');
        if (pParts.length < 3) return false;
        const pPrefix = pParts.slice(0, -1).join('-');
        return pPrefix === prefix;
    });

    return variants;
}
