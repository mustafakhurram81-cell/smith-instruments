import { supabase } from '../supabase';

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
        const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_distinct_categories');

        if (!rpcError && rpcData) {
            return rpcData.map((row: any) => row.category);
        }

        const { data, error } = await supabase
            .from('products')
            .select('category')
            .not('category', 'is', null)
            .neq('category', '')
            .limit(1000);

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

// Get subcategories for a category with counts and images
export async function getSubcategoryDetails(category: string): Promise<{ name: string; count: number; image: string }[]> {
    const { data, error } = await supabase.rpc('get_subcategory_details', { p_category: category });
    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching subcategory details:', error);
        return [];
    }
    return data || [];
}

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

    // Specialty Instruments
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
