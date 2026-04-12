import { useQuery } from '@tanstack/react-query';
import {
    getCategoryDetails,
    getCategoryNames,
    getSubcategoryDetails,
    getProductsByCategory,
    getProductsBySubcategory,
    getProductBySku,
    getProductVariants,
    searchProducts,
    getCatalogues,
    getCatalogueForProduct,
    getInstrumentTypes,
    getInstrumentCategories,
    getInstrumentSubcategories,
    // New dual navigation
    getSpecialtyCategories,
    getSpecialtySubcategories,
    getProductsBySpecialty,
    getInstrumentCategoriesNew,
    getInstrumentSubcategoriesNew,
    getProductsByInstrument,
    Product
} from './database';

// Query keys for cache management
export const queryKeys = {
    categories: ['categories'] as const,
    categoryDetails: ['categoryDetails'] as const,
    subcategoryDetails: (category: string) => ['subcategoryDetails', category] as const,
    productsByCategory: (category: string) => ['products', 'category', category] as const,
    productsBySubcategory: (category: string, subcategory: string) =>
        ['products', 'subcategory', category, subcategory] as const,
    productBySku: (sku: string) => ['product', sku] as const,
    searchProducts: (query: string) => ['search', query] as const,
    categoryNames: ['categoryNames'] as const,
    catalogues: ['catalogues'] as const,
};

// Hook to get ONLY category names (lightweight for Header)
export function useCategoryNames() {
    return useQuery({
        queryKey: queryKeys.categoryNames,
        queryFn: getCategoryNames,
        staleTime: 1000 * 60 * 30, // 30 minutes (very stable)
    });
}

// Hook to get category details with counts and images
export function useCategoryDetails() {
    return useQuery({
        queryKey: queryKeys.categoryDetails,
        queryFn: getCategoryDetails,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook to get subcategory details with counts and images
export function useSubcategoryDetails(category: string) {
    return useQuery({
        queryKey: queryKeys.subcategoryDetails(category),
        queryFn: () => getSubcategoryDetails(category),
        enabled: !!category,
        staleTime: 1000 * 60 * 10,
    });
}

// Hook to get products by category
export function useProductsByCategory(category: string, page: number = 1, limit: number = 24, enabled: boolean = true) {
    return useQuery({
        queryKey: [...queryKeys.productsByCategory(category), page, limit],
        queryFn: () => getProductsByCategory(category, page, limit),
        enabled: !!category && enabled,
        staleTime: 1000 * 60 * 5,
    });
}

// Hook to get products by subcategory
export function useProductsBySubcategory(category: string, subcategory: string, page: number = 1, limit: number = 24, search: string = '', enabled: boolean = true) {
    return useQuery({
        queryKey: [...queryKeys.productsBySubcategory(category, subcategory), page, limit, search],
        queryFn: () => getProductsBySubcategory(category, subcategory, page, limit, search),
        enabled: enabled && !!(category && subcategory),
        staleTime: 1000 * 60 * 5,
    });
}

// Hook to get a single product by SKU
export function useProductBySku(sku: string) {
    return useQuery({
        queryKey: queryKeys.productBySku(sku),
        queryFn: () => getProductBySku(sku),
        enabled: !!sku,
        staleTime: 1000 * 60 * 10,
    });
}

// Hook for search (with shorter cache time for fresh results)
export function useSearchProducts(query: string) {
    return useQuery({
        queryKey: queryKeys.searchProducts(query),
        queryFn: () => searchProducts(query),
        enabled: query.length >= 2,
        staleTime: 1000 * 60 * 2, // 2 minutes for search
    });
}

// Hook for catalogues (stable data, long cache)
export function useCatalogues() {
    return useQuery({
        queryKey: queryKeys.catalogues,
        queryFn: getCatalogues,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook for instrument types (for dual navigation)
export function useInstrumentTypes() {
    return useQuery({
        queryKey: ['instrumentTypes'] as const,
        queryFn: getInstrumentTypes,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook for instrument categories (parent level for "Browse by Instrument Type")
export function useInstrumentCategories() {
    return useQuery({
        queryKey: ['instrumentCategories'] as const,
        queryFn: getInstrumentCategories,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook for subcategories within an instrument category
export function useInstrumentSubcategories(instrumentCategory: string) {
    return useQuery({
        queryKey: ['instrumentSubcategories', instrumentCategory] as const,
        queryFn: () => getInstrumentSubcategories(instrumentCategory),
        enabled: !!instrumentCategory,
        staleTime: 1000 * 60 * 10,
    });
}

// ═══════════════════════════════════════════════════════════
// DUAL NAVIGATION HOOKS (using new database columns)
// ═══════════════════════════════════════════════════════════

// Hook for specialty categories (from new column)
export function useSpecialtyCategories() {
    return useQuery({
        queryKey: ['specialtyCategories'] as const,
        queryFn: getSpecialtyCategories,
        staleTime: 1000 * 60 * 10,
    });
}

// Hook for specialty subcategories
export function useSpecialtySubcategories(category: string) {
    return useQuery({
        queryKey: ['specialtySubcategories', category] as const,
        queryFn: () => getSpecialtySubcategories(category),
        enabled: !!category,
        staleTime: 1000 * 60 * 10,
    });
}

// Hook for products by specialty
export function useProductsBySpecialty(category: string, subcategory?: string, page: number = 1, limit: number = 24, enabled: boolean = true) {
    return useQuery({
        queryKey: ['productsBySpecialty', category, subcategory, page, limit] as const,
        queryFn: () => getProductsBySpecialty(category, subcategory, page, limit),
        enabled: !!category && enabled,
        staleTime: 1000 * 60 * 5,
    });
}

// Hook for instrument categories (from new column)
export function useInstrumentCategoriesNew() {
    return useQuery({
        queryKey: ['instrumentCategoriesNew'] as const,
        queryFn: getInstrumentCategoriesNew,
        staleTime: 1000 * 60 * 10,
    });
}

// Hook for instrument subcategories (from new column)
export function useInstrumentSubcategoriesNew(category: string) {
    return useQuery({
        queryKey: ['instrumentSubcategoriesNew', category] as const,
        queryFn: () => getInstrumentSubcategoriesNew(category),
        enabled: !!category,
        staleTime: 1000 * 60 * 10,
    });
}

// Hook for products by instrument
export function useProductsByInstrument(category: string, subcategory?: string, page: number = 1, limit: number = 24, enabled: boolean = true) {
    return useQuery({
        queryKey: ['productsByInstrument', category, subcategory, page, limit] as const,
        queryFn: () => getProductsByInstrument(category, subcategory, page, limit),
        enabled: !!category && enabled,
        staleTime: 1000 * 60 * 5,
    });
}

// Hook for product variants
export function useProductVariants(sku: string) {
    return useQuery({
        queryKey: ['productVariants', sku],
        queryFn: () => getProductVariants(sku),
        enabled: !!sku,
        staleTime: 1000 * 60 * 10
    });
}

// Hook for catalogue associated with a product
export function useCatalogueForProduct(product: Product | null) {
    return useQuery({
        queryKey: ['catalogueForProduct', product?.id],
        queryFn: () => product ? getCatalogueForProduct(product) : null as any,
        enabled: !!product,
        staleTime: 1000 * 60 * 60
    });
}
