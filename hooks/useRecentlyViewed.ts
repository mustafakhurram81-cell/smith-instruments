import { useState, useEffect } from 'react';
import { Product } from '../lib/database';

const STORAGE_KEY = 'smith_recently_viewed';
const MAX_ITEMS = 8;

export interface RecentlyViewedItem {
    id: string;
    sku: string;
    name: string;
    image_url: string | null;
    category: string;
    subcategory: string;
    viewedAt: number;
}

export const useRecentlyViewed = () => {
    const [items, setItems] = useState<RecentlyViewedItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load recently viewed', e);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToRecentlyViewed = (product: Product) => {
        setItems(prev => {
            // Remove if already exists
            const filtered = prev.filter(item => item.id !== product.id);

            // Add to beginning
            const newItem: RecentlyViewedItem = {
                id: product.id,
                sku: product.sku,
                name: product.name,
                image_url: product.image_url,
                category: product.category,
                subcategory: product.subcategory,
                viewedAt: Date.now()
            };

            // Keep only MAX_ITEMS
            return [newItem, ...filtered].slice(0, MAX_ITEMS);
        });
    };

    const clearRecentlyViewed = () => {
        setItems([]);
    };

    return { items, addToRecentlyViewed, clearRecentlyViewed };
};
