import React from 'react';
import { Package, FolderOpen, Layers, GitBranch, AlertTriangle, ImageOff, FileText, RefreshCw } from 'lucide-react';

interface Stats {
    products: number;
    categories: number;
    uncategorized: number;
    missingImages: number;
    missingDesc: number;
    withVariants: number;
    parentProducts: number;
    missingAttributes: number;
}

interface CategoryStat {
    name: string;
    count: number;
    subcategories: { name: string; count: number }[];
}

interface OverviewTabProps {
    stats: Stats;
    categoryStats: CategoryStat[];
    loading: boolean;
    onRefresh: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
    stats,
    categoryStats,
    loading,
    onRefresh
}) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: stats.products, color: 'blue', icon: Package },
                    { label: 'Categories', value: stats.categories, color: 'green', icon: FolderOpen },
                    { label: 'Parent Products', value: stats.parentProducts, color: 'purple', icon: Layers },
                    { label: 'Products with Variants', value: stats.withVariants, color: 'indigo', icon: GitBranch },
                ].map(stat => (
                    <div key={stat.label} className="bg-white p-4 rounded-xl shadow-sm">
                        <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg w-fit mb-2`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-xs text-stone-500">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-brand-charcoal">{loading ? '...' : stat.value.toLocaleString()}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Uncategorized', value: stats.uncategorized, color: 'amber', icon: AlertTriangle },
                    { label: 'Missing Images', value: stats.missingImages, color: 'red', icon: ImageOff },
                    { label: 'Missing Description', value: stats.missingDesc, color: 'orange', icon: FileText },
                    { label: 'Missing Attributes', value: stats.missingAttributes, color: 'rose', icon: AlertTriangle },
                ].map(stat => (
                    <div key={stat.label} className="bg-white p-4 rounded-xl shadow-sm">
                        <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg w-fit mb-2`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-xs text-stone-500">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-brand-charcoal">{loading ? '...' : stat.value.toLocaleString()}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-brand-charcoal">Category Breakdown</h2>
                    <button onClick={onRefresh} className="text-brand-gold text-sm hover:underline flex items-center gap-1">
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {categoryStats.map(cat => (
                        <div key={cat.name} className="flex items-center gap-3">
                            <div className="w-28 text-sm truncate">{cat.name}</div>
                            <div className="flex-1 h-5 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-gold" style={{ width: `${(cat.count / stats.products) * 100}%` }} />
                            </div>
                            <div className="w-12 text-right text-sm text-stone-500">{cat.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
