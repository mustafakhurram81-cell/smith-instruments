import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Loader2, Search, Edit, X, Save,
    RefreshCw, ChevronRight, ChevronDown, Eye, Layers
} from 'lucide-react';
import { Button } from '../Shared';
import type { Product, VariantGroup } from '../../types';
import { PAGE_SIZE } from '../../constants';

interface VariantsTabProps {
    onRefreshStats?: () => void;
}

export const VariantsTab: React.FC<VariantsTabProps> = ({ onRefreshStats }) => {
    const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
    const [variantsLoading, setVariantsLoading] = useState(false);
    const [expandedVariantGroups, setExpandedVariantGroups] = useState<Set<string>>(new Set());
    const [variantSearchQuery, setVariantSearchQuery] = useState('');
    const [variantPage, setVariantPage] = useState(0);
    const [editingVariant, setEditingVariant] = useState<Product | null>(null);

    const fetchVariantGroups = async (query: string = '', pageNum: number = 0) => {
        setVariantsLoading(true);

        let queryBuilder = supabase
            .from('products')
            .select('*')
            .not('specifications->variant_of', 'is', null)
            .order('sku', { ascending: true })
            .range(pageNum * PAGE_SIZE.VARIANTS_FETCH, (pageNum + 1) * PAGE_SIZE.VARIANTS_FETCH - 1);

        if (query.trim()) {
            queryBuilder = queryBuilder.or(`sku.ilike.%${query}%,name.ilike.%${query}%`);
        }

        const { data } = await queryBuilder;

        // Group by variant_of (parent SKU)
        const groups: Record<string, VariantGroup> = {};
        ((data || []) as Product[]).forEach(product => {
            const parentSku = product.specifications?.variant_of || product.sku;
            if (!groups[parentSku]) {
                groups[parentSku] = {
                    parent_sku: parentSku,
                    parent_name: product.name,
                    variants: []
                };
            }
            groups[parentSku].variants.push(product);
        });

        // Sort variants within each group
        Object.values(groups).forEach(g => {
            g.variants.sort((a, b) => a.sku.localeCompare(b.sku));
        });

        setVariantGroups(Object.values(groups));
        setVariantsLoading(false);
    };

    useEffect(() => {
        fetchVariantGroups('', 0);
    }, []);

    const toggleVariantGroup = (parentSku: string) => {
        setExpandedVariantGroups(prev => {
            const next = new Set(prev);
            next.has(parentSku) ? next.delete(parentSku) : next.add(parentSku);
            return next;
        });
    };

    const handleSaveVariant = async () => {
        if (!editingVariant) return;
        await supabase.from('products').update({
            specifications: editingVariant.specifications
        }).eq('id', editingVariant.id);

        // Refresh variant groups
        fetchVariantGroups(variantSearchQuery, variantPage);
        setEditingVariant(null);
        onRefreshStats?.();
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search parent SKU or name..."
                        value={variantSearchQuery}
                        onChange={e => setVariantSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchVariantGroups(variantSearchQuery, 0)}
                        className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:!border-stone-400"
                    />
                </div>
                <Button variant="outline" onClick={() => fetchVariantGroups(variantSearchQuery, 0)}>
                    <RefreshCw size={16} className="mr-1" /> Refresh
                </Button>
            </div>

            {/* Variant Groups */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {variantsLoading ? (
                    <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-brand-orange" size={32} /></div>
                ) : (
                    <div className="divide-y">
                        {variantGroups.length === 0 ? (
                            <div className="p-12 text-center text-stone-500">No variant groups found</div>
                        ) : (
                            variantGroups.map(group => (
                                <div key={group.parent_sku}>
                                    <div
                                        className="flex items-center justify-between p-4 hover:bg-stone-50 cursor-pointer"
                                        onClick={() => toggleVariantGroup(group.parent_sku)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {expandedVariantGroups.has(group.parent_sku) ? (
                                                <ChevronDown size={18} className="text-stone-400" />
                                            ) : (
                                                <ChevronRight size={18} className="text-stone-400" />
                                            )}
                                            <Layers size={18} className="text-brand-orange" />
                                            <span className="font-mono text-brand-orange">{group.parent_sku}</span>
                                            <span className="text-stone-600">{group.parent_name}</span>
                                        </div>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full">
                                            {group.variants.length} variants
                                        </span>
                                    </div>

                                    {expandedVariantGroups.has(group.parent_sku) && (
                                        <div className="bg-stone-50 border-t">
                                            <table className="w-full text-sm">
                                                <thead className="bg-stone-100">
                                                    <tr>
                                                        <th className="p-3 text-left pl-12">SKU</th>
                                                        <th className="p-3 text-left">Description</th>
                                                        <th className="p-3 text-left">Fig</th>
                                                        <th className="p-3 text-left">Length</th>
                                                        <th className="p-3 text-left">Blade</th>
                                                        <th className="p-3 text-left">Size</th>
                                                        <th className="p-3 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.variants.map(variant => (
                                                        <tr key={variant.id} className="border-t border-stone-200 hover:bg-white">
                                                            <td className="p-3 pl-12 font-mono text-brand-orange">{variant.sku}</td>
                                                            <td className="p-3 text-stone-600 max-w-[200px] truncate">{variant.description}</td>
                                                            <td className="p-3 text-stone-500">{variant.specifications?.fig || variant.specifications?.figure || '—'}</td>
                                                            <td className="p-3 text-stone-500">{variant.specifications?.length || '—'}</td>
                                                            <td className="p-3 text-stone-500">{variant.specifications?.blade || '—'}</td>
                                                            <td className="p-3 text-stone-500">{variant.specifications?.size || '—'}</td>
                                                            <td className="p-3 text-right">
                                                                <div className="flex justify-end gap-1">
                                                                    <a
                                                                        href={`/product/${variant.sku}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-1.5 hover:bg-stone-100 rounded"
                                                                        title="View on site"
                                                                    >
                                                                        <Eye size={14} className="text-stone-500" />
                                                                    </a>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingVariant(variant);
                                                                        }}
                                                                        className="p-1.5 hover:bg-stone-100 rounded"
                                                                    >
                                                                        <Edit size={14} className="text-stone-500" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
                <div className="p-4 border-t flex justify-between items-center text-sm">
                    <span className="text-stone-500">Page {variantPage + 1}</span>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setVariantPage(p => p - 1); fetchVariantGroups(variantSearchQuery, variantPage - 1); }} disabled={variantPage === 0}>Prev</Button>
                        <Button variant="outline" onClick={() => { setVariantPage(p => p + 1); fetchVariantGroups(variantSearchQuery, variantPage + 1); }} disabled={variantGroups.length < 50}>Next</Button>
                    </div>
                </div>
            </div>

            {/* Edit Variant Modal */}
            {editingVariant && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Edit Variant Attributes</h3>
                            <button onClick={() => setEditingVariant(null)}><X size={20} /></button>
                        </div>
                        <div className="space-y-3">
                            <div><label className="text-xs text-stone-500">SKU</label><input value={editingVariant.sku} disabled className="w-full p-3 border rounded-lg bg-stone-50" /></div>
                            <div><label className="text-xs text-stone-500">Fig</label><input value={editingVariant.specifications?.fig || editingVariant.specifications?.figure || ''} onChange={e => setEditingVariant({ ...editingVariant, specifications: { ...editingVariant.specifications, fig: e.target.value } })} className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="text-xs text-stone-500">Length</label><input value={editingVariant.specifications?.length || ''} onChange={e => setEditingVariant({ ...editingVariant, specifications: { ...editingVariant.specifications, length: e.target.value } })} className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="text-xs text-stone-500">Blade</label><input value={editingVariant.specifications?.blade || ''} onChange={e => setEditingVariant({ ...editingVariant, specifications: { ...editingVariant.specifications, blade: e.target.value } })} className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="text-xs text-stone-500">Size</label><input value={editingVariant.specifications?.size || ''} onChange={e => setEditingVariant({ ...editingVariant, specifications: { ...editingVariant.specifications, size: e.target.value } })} className="w-full p-3 border rounded-lg" /></div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button variant="outline" onClick={() => setEditingVariant(null)} className="flex-1">Cancel</Button>
                            <Button variant="primary" onClick={handleSaveVariant} className="flex-1"><Save size={16} className="mr-1" /> Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
