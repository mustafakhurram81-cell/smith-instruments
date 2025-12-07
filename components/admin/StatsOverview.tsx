import React from 'react';
import { Package, FolderOpen, AlertTriangle, ImageOff, FileText, LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
    loading?: boolean;
}

const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
};

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color, loading }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className={`p-2 ${colorClasses[color]} rounded-lg w-fit mb-2`}>
            <Icon size={20} />
        </div>
        <p className="text-xs text-stone-500">{label}</p>
        <h3 className="text-2xl font-bold text-brand-charcoal">
            {loading ? '...' : typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
    </div>
);

interface StatsOverviewProps {
    stats: {
        products: number;
        categories: number;
        uncategorized: number;
        missingImages: number;
        missingDesc: number;
    };
    loading?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, loading }) => {
    const cards = [
        { label: 'Total Products', value: stats.products, color: 'blue' as const, icon: Package },
        { label: 'Categories', value: stats.categories, color: 'green' as const, icon: FolderOpen },
        { label: 'Uncategorized', value: stats.uncategorized, color: 'amber' as const, icon: AlertTriangle },
        { label: 'Missing Images', value: stats.missingImages, color: 'red' as const, icon: ImageOff },
        { label: 'Missing Description', value: stats.missingDesc, color: 'purple' as const, icon: FileText },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cards.map(card => (
                <StatsCard key={card.label} {...card} loading={loading} />
            ))}
        </div>
    );
};
