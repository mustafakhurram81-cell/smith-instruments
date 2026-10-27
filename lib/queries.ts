import { useQuery } from '@tanstack/react-query';
import {
    getCatalogues,
    getCatalogueForProduct,
    getProductsBySkus,
    Product
} from './database';

// Query keys for cache management
export const queryKeys = {
    catalogues: ['catalogues'] as const,
};

// Hook for catalogues (stable data, long cache)
export function useCatalogues() {
    return useQuery({
        queryKey: queryKeys.catalogues,
        queryFn: getCatalogues,
        staleTime: 1000 * 60 * 10, // 10 minutes
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

// Hand-picked products for the homepage "Featured products" grid
export function useFeaturedProducts(skus: string[]) {
    return useQuery({
        queryKey: ['featuredProducts', ...skus],
        queryFn: () => getProductsBySkus(skus),
        staleTime: 1000 * 60 * 30,
    });
}
