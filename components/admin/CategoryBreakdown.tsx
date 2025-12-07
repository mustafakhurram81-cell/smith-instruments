import React from 'react';
import { RefreshCw } from 'lucide-react';

interface CategoryBreakdownProps {
    categories: { name: string; count: number }[];
    totalProducts: number;
    onRefresh: () => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
    categories,
    totalProducts,
    onRefresh
}) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-brand-charcoal">Category Breakdown</h2>
            <button
                onClick={onRefresh}
                className="text-brand-gold text-sm hover:underline flex items-center gap-1"
            >
                <RefreshCw size={14} /> Refresh
            </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
            {categories.map(cat => (
                <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-28 text-sm truncate">{cat.name}</div>
                    <div className="flex-1 h-5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-gold transition-all duration-300"
                            style={{ width: `${totalProducts > 0 ? (cat.count / totalProducts) * 100 : 0}%` }}
                        />
                    </div>
                    <div className="w-12 text-right text-sm text-stone-500">{cat.count}</div>
                </div>
            ))}
        </div>
    </div>
);
