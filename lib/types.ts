// Product type from Supabase
export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    image_url: string;
    // Upgrade specifications from 'any' to strict type
    specifications: Record<string, string> | null;
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
