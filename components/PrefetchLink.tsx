import React, { useCallback } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

// Map of routes to their lazy import functions
const prefetchMap: Record<string, () => Promise<unknown>> = {
    '/': () => import('../pages/Home'),
    '/products': () => import('../pages/products/ProductsIndex'),
    '/catalogues': () => import('../pages/Catalogues'),
    '/about': () => import('../pages/About'),
    '/blog': () => import('../pages/Blog'),
    '/contact': () => import('../pages/Contact'),
    '/quote-cart': () => import('../pages/QuoteCart'),
};

// Cache to track which routes have been prefetched
const prefetchedRoutes = new Set<string>();

/**
 * NavLink that prefetches the page code when the user hovers over it.
 * This eliminates the loading delay when navigating between pages.
 */
export const PrefetchNavLink: React.FC<NavLinkProps & { prefetch?: boolean }> = ({
    to,
    prefetch = true,
    onMouseEnter,
    onFocus,
    ...props
}) => {
    const routePath = typeof to === 'string' ? to : to.pathname || '';

    const handlePrefetch = useCallback(() => {
        // Only prefetch if enabled and not already prefetched
        if (!prefetch || prefetchedRoutes.has(routePath)) return;

        // Find matching route (handles exact matches and path prefixes)
        const matchingRoute = Object.keys(prefetchMap).find(route =>
            routePath === route || routePath.startsWith(route + '/')
        );

        if (matchingRoute && prefetchMap[matchingRoute]) {
            prefetchedRoutes.add(routePath);
            // Start loading the chunk in the background
            prefetchMap[matchingRoute]().catch(() => {
                // If prefetch fails, remove from cache so it can be retried
                prefetchedRoutes.delete(routePath);
            });
        }
    }, [routePath, prefetch]);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        handlePrefetch();
        onMouseEnter?.(e);
    }, [handlePrefetch, onMouseEnter]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLAnchorElement>) => {
        handlePrefetch();
        onFocus?.(e);
    }, [handlePrefetch, onFocus]);

    return (
        <NavLink
            to={to}
            onMouseEnter={handleMouseEnter}
            onFocus={handleFocus}
            {...props}
        />
    );
};

export default PrefetchNavLink;
