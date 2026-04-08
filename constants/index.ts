/**
 * Application constants and configuration values.
 * Centralizes magic numbers and strings used throughout the codebase.
 */

// ============================================
// PAGINATION
// ============================================

export const PAGE_SIZE = {
    PRODUCTS_TABLE: 50,
    PRODUCTS_FETCH: 1000,
    VARIANTS_FETCH: 200,
    SEARCH_RESULTS: 50,
} as const;

// ============================================
// QUICK FILTERS
// ============================================

export const QUICK_FILTERS = [
    { id: 'all', label: 'All Products', iconName: 'Package' },
    { id: 'missing-images', label: 'Missing Images', iconName: 'ImageOff' },
    { id: 'missing-desc', label: 'Missing Description', iconName: 'FileText' },
    { id: 'uncategorized', label: 'Uncategorized', iconName: 'AlertTriangle' },
    { id: 'has-variants', label: 'Has Variants', iconName: 'GitBranch' },
] as const;

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_PRODUCT = {
    sku: '',
    name: '',
    description: '',
    category: 'Uncategorized',
    subcategory: 'General',
    image_url: '',
} as const;

// ============================================
// EXTERNAL LINKS
// ============================================

export const SOCIAL_LINKS = {
    facebook: 'https://www.facebook.com/smithinstrumentsusa',
    instagram: 'https://www.instagram.com/smithinstruments/',
    linkedin: 'https://www.linkedin.com/company/smith-instruments',
} as const;

export const CONTACT_INFO = {
    email: 'sales@smithinstruments.net',
    phone: '+92 330 2449855',
    locations: [
        {
            type: 'Manufacturing Plant',
            address: 'Sialkot Punjab 51310 Capital Road pakistan'
        },
        {
            type: 'Head Office',
            address: 'Alexandria Virginia 22310 USA'
        }
    ]
} as const;

// ============================================
// FILE UPLOAD
// ============================================

export const UPLOAD_CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    storageBucket: 'product-images',
} as const;

// ============================================
// DEBOUNCE DELAYS
// ============================================

export const DEBOUNCE_MS = {
    SEARCH: 300,
    INLINE_SAVE_FEEDBACK: 1000,
} as const;

// ============================================
// ANIMATION TIMINGS
// ============================================

export const ANIMATION_MS = {
    CAROUSEL_AUTO: 4000,
    TRANSITION_DEFAULT: 300,
} as const;
