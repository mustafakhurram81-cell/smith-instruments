import { useState, useEffect, useCallback } from 'react';
import { DEBOUNCE_MS } from '../constants';

interface UseSearchOptions<T> {
    searchFn: (query: string) => Promise<T[]>;
    debounceMs?: number;
    minQueryLength?: number;
}

interface UseSearchReturn<T> {
    query: string;
    setQuery: (query: string) => void;
    results: T[];
    loading: boolean;
    error: Error | null;
    clearResults: () => void;
}

/**
 * Custom hook for debounced search functionality.
 * 
 * @example
 * const { query, setQuery, results, loading } = useSearch({
 *   searchFn: async (q) => await searchProducts(q),
 *   debounceMs: 300,
 *   minQueryLength: 2
 * });
 */
export function useSearch<T>({
    searchFn,
    debounceMs = DEBOUNCE_MS.SEARCH,
    minQueryLength = 2
}: UseSearchOptions<T>): UseSearchReturn<T> {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (query.trim().length < minQueryLength) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        const timeout = setTimeout(async () => {
            try {
                const found = await searchFn(query);
                setResults(found);
            } catch (e) {
                setError(e instanceof Error ? e : new Error('Search failed'));
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, debounceMs);

        return () => clearTimeout(timeout);
    }, [query, searchFn, debounceMs, minQueryLength]);

    const clearResults = useCallback(() => {
        setQuery('');
        setResults([]);
    }, []);

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        clearResults
    };
}
