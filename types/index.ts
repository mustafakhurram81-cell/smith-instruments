/**
 * Shared TypeScript interfaces for the Smith Instruments codebase.
 * This is the SINGLE SOURCE OF TRUTH for all types.
 * Do NOT define Product, Catalogue, or CatalogueRef elsewhere.
 */

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    image_url: string;
    specifications: ProductSpecifications | null;
    variant_group?: string;
    catalogue_id?: string;
    // Dual navigation fields
    instrument_category?: string;
    instrument_subcategory?: string;
    specialty_category?: string;
    specialty_subcategory?: string;
}

export interface ProductSpecifications {
    variant_of?: string;
    fig?: string;
    figure?: string;
    length?: string;
    blade?: string;
    size?: string;
    [key: string]: string | undefined;
}

export interface NewProduct {
    sku: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
}

// ============================================
// CATALOGUE TYPES
// ============================================

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

// ============================================
// CATEGORY TYPES
// ============================================

export interface CategoryDetail {
    name: string;
    count: number;
    image: string;
}

export interface SubcategoryDetail {
    name: string;
    count: number;
}

export interface CategoryStats {
    name: string;
    count: number;
    subcategories: SubcategoryDetail[];
}

// ============================================
// ADMIN DASHBOARD TYPES
// ============================================

export interface VariantGroup {
    parent_sku: string;
    parent_name: string;
    variants: Product[];
}

export interface DashboardStats {
    products: number;
    categories: number;
    uncategorized: number;
    missingImages: number;
    missingDesc: number;
    withVariants: number;
    parentProducts: number;
    missingAttributes: number;
}

export interface InlineEditState {
    id: string;
    field: 'name' | 'category' | 'subcategory';
    value: string;
}

export interface CategoryEditState {
    old: string;
    new: string;
}

// ============================================
// FILTER TYPES
// ============================================

export type QuickFilterType =
    | 'all'
    | 'missing-images'
    | 'missing-desc'
    | 'uncategorized'
    | 'has-variants';

export type SortColumn = 'sku' | 'name' | 'category';
export type SortOrder = 'asc' | 'desc';

// ============================================
// QUOTE TYPES
// ============================================

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface QuoteRequest {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message?: string;
    items: CartItem[];
    status: 'pending' | 'contacted' | 'completed' | 'cancelled';
}

// ============================================
// AUTH TYPES
// ============================================

export type UserRole = 'admin' | 'manager' | 'viewer';

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
}
