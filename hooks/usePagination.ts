import { useState, useCallback } from 'react';

interface UsePaginationOptions {
    initialPage?: number;
    pageSize: number;
}

interface UsePaginationReturn {
    page: number;
    pageSize: number;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    reset: () => void;
    canGoNext: (itemCount: number) => boolean;
    canGoPrev: boolean;
    getRange: () => { from: number; to: number };
}

/**
 * Custom hook for pagination logic.
 * 
 * @example
 * const { page, nextPage, prevPage, canGoNext, canGoPrev, getRange } = usePagination({
 *   pageSize: 50
 * });
 * 
 * // Use in query
 * const { from, to } = getRange();
 * const { data } = await supabase.from('products').range(from, to);
 */
export function usePagination({
    initialPage = 0,
    pageSize
}: UsePaginationOptions): UsePaginationReturn {
    const [page, setPage] = useState(initialPage);

    const nextPage = useCallback(() => {
        setPage(p => p + 1);
    }, []);

    const prevPage = useCallback(() => {
        setPage(p => Math.max(0, p - 1));
    }, []);

    const goToPage = useCallback((newPage: number) => {
        setPage(Math.max(0, newPage));
    }, []);

    const reset = useCallback(() => {
        setPage(initialPage);
    }, [initialPage]);

    const canGoNext = useCallback((itemCount: number) => {
        return itemCount >= pageSize;
    }, [pageSize]);

    const canGoPrev = page > 0;

    const getRange = useCallback(() => {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        return { from, to };
    }, [page, pageSize]);

    return {
        page,
        pageSize,
        nextPage,
        prevPage,
        goToPage,
        reset,
        canGoNext,
        canGoPrev,
        getRange
    };
}
