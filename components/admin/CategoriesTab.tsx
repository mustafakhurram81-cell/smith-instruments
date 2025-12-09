import React from 'react';
import { ChevronRight, ChevronDown, Edit, FolderEdit } from 'lucide-react';

interface CategoryStat {
    name: string;
    count: number;
    subcategories: { name: string; count: number }[];
}

interface CategoriesTabProps {
    categoryStats: CategoryStat[];
    expandedCategories: Set<string>;
    onToggleExpand: (catName: string) => void;
    onRenameCategory: (category: string) => void;
    onDeleteCategory: (category: string) => void;
    onRenameSubcategory: (category: string, oldSub: string, newSub: string) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
    categoryStats,
    expandedCategories,
    onToggleExpand,
    onRenameCategory,
    onDeleteCategory,
    onRenameSubcategory
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-stone-100">
                <h2 className="font-medium text-brand-charcoal">Category Structure</h2>
            </div>
            <div className="divide-y divide-stone-100">
                {categoryStats.map(cat => (
                    <div key={cat.name}>
                        <div
                            className="flex items-center gap-3 p-4 hover:bg-stone-50 cursor-pointer"
                            onClick={() => onToggleExpand(cat.name)}
                        >
                            {expandedCategories.has(cat.name) ? (
                                <ChevronDown size={18} className="text-stone-400" />
                            ) : (
                                <ChevronRight size={18} className="text-stone-400" />
                            )}
                            <span className="font-medium text-brand-charcoal flex-1">{cat.name}</span>
                            <span className="text-sm text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                                {cat.count} products
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onRenameCategory(cat.name); }}
                                className="p-1.5 hover:bg-stone-200 rounded text-stone-400 hover:text-brand-charcoal"
                                title="Rename category"
                            >
                                <FolderEdit size={16} />
                            </button>
                        </div>

                        {expandedCategories.has(cat.name) && (
                            <div className="bg-stone-50 border-t border-stone-100">
                                {cat.subcategories.map(sub => (
                                    <div key={sub.name} className="flex items-center gap-3 px-12 py-3 hover:bg-stone-100">
                                        <span className="flex-1 text-sm text-stone-600">{sub.name}</span>
                                        <span className="text-xs text-stone-400">{sub.count}</span>
                                        <button
                                            onClick={() => {
                                                const newName = prompt('Rename subcategory:', sub.name);
                                                if (newName && newName !== sub.name) {
                                                    onRenameSubcategory(cat.name, sub.name, newName);
                                                }
                                            }}
                                            className="p-1 hover:bg-white rounded text-stone-400 hover:text-brand-charcoal"
                                            title="Rename subcategory"
                                        >
                                            <Edit size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
