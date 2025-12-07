import { useQuery } from '@tanstack/react-query';
import {
    getCategoryDetails,
    getSubcategoryDetails,
    getProductsByCategory,
    getProductsBySubcategory,
    getProductBySku,
    searchProducts,
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
};

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
export function useProductsByCategory(category: string) {
    return useQuery({
        queryKey: queryKeys.productsByCategory(category),
        queryFn: () => getProductsByCategory(category),
        enabled: !!category,
        staleTime: 1000 * 60 * 5,
    });
}

// Hook to get products by subcategory
export function useProductsBySubcategory(category: string, subcategory: string) {
    return useQuery({
        queryKey: queryKeys.productsBySubcategory(category, subcategory),
        queryFn: () => getProductsBySubcategory(category, subcategory),
        enabled: !!category && !!subcategory,
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
