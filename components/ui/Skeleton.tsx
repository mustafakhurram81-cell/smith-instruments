import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
    count = 1
}) => {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%]';

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    const style: React.CSSProperties = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '100%'),
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite'
    };

    const items = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    ));

    return count === 1 ? items[0] : <div className="space-y-2">{items}</div>;
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl overflow-hidden border border-stone-200">
        <div className="aspect-square bg-stone-100">
            <Skeleton height="100%" className="rounded-none" />
        </div>
        <div className="p-4 space-y-2">
            <Skeleton width="40%" height="0.75rem" />
            <Skeleton height="1rem" />
            <Skeleton width="60%" height="0.875rem" />
        </div>
    </div>
);

// Category Card Skeleton
export const CategoryCardSkeleton: React.FC = () => (
    <div className="relative h-80 rounded-2xl overflow-hidden bg-stone-200">
        <Skeleton height="100%" className="rounded-2xl" />
        <div className="absolute bottom-0 left-0 w-full p-8">
            <Skeleton width="60%" height="2rem" className="mb-2" />
            <Skeleton width="30%" height="1rem" />
        </div>
    </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

// Category Grid Skeleton  
export const CategoryGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
        ))}
    </div>
);
