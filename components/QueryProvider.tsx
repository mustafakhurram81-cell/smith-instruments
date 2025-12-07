import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh
            gcTime: 1000 * 60 * 30, // 30 minutes - keep unused data in cache (formerly cacheTime)
            refetchOnWindowFocus: false, // Don't refetch when user switches tabs
            retry: 2, // Retry failed requests twice
        },
    },
});

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export { queryClient };
