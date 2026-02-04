import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../AuthProvider';
import {
    Package, Loader2, Search, Edit, Trash2, X, Save,
    Plus, Upload, CheckSquare, Square,
    ImageOff, FileText, RefreshCw,
    Download, ArrowUpDown, Eye, Check, Link2, Unlink, GitBranch, AlertTriangle
} from 'lucide-react';
import { Button } from '../Shared';
import type { Product, CategoryStats, QuickFilterType, SortColumn, SortOrder, InlineEditState, NewProduct } from '../../types';
import { PAGE_SIZE } from '../../constants';
import { ImportModal } from './ImportModal';

interface ProductsTabProps {
    categoryStats: CategoryStats[];
    onRefreshStats: () => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ categoryStats, onRefreshStats }) => {
    const { canExport } = useAuth();

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [subcategoryFilter, setSubcategoryFilter] = useState('');
    const [sortBy, setSortBy] = useState<SortColumn>('sku');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // Selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Quick filters
    const [quickFilter, setQuickFilter] = useState<QuickFilterType>('all');

    // Inline editing
    const [inlineEdit, setInlineEdit] = useState<InlineEditState | null>(null);
    const [savingInline, setSavingInline] = useState<string | null>(null);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showBulkSubcategoryModal, setShowBulkSubcategoryModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // New product form
    const [newProduct, setNewProduct] = useState<NewProduct>({ sku: '', name: '', description: '', category: '', subcategory: '' });

    // Bulk operations
    const [bulkCategory, setBulkCategory] = useState('');
    const [bulkSubcategory, setBulkSubcategory] = useState('');

    // Image upload
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Link as variant
    const [linkingProduct, setLinkingProduct] = useState<Product | null>(null);
    const [parentSearchQuery, setParentSearchQuery] = useState('');
    const [parentSearchResults, setParentSearchResults] = useState<Product[]>([]);
    const [parentSearching, setParentSearching] = useState(false);
    const [linkingSaving, setLinkingSaving] = useState(false);

    const pageSize = PAGE_SIZE.PRODUCTS_TABLE;

    // Get subcategories for selected category
    const subcategoriesForCategory = categoryFilter
        ? categoryStats.find(c => c.name === categoryFilter)?.subcategories || []
        : [];

    const fetchProducts = async (query: string = '', category: string = '', subcategory: string = '', pageNum: number = 0, qFilter: QuickFilterType = 'all') => {
        setProductsLoading(true);
        setSelectedIds(new Set());

        let queryBuilder = supabase
            .from('products')
            .select('id, sku, name, description, category, subcategory, image_url, specifications')
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(pageNum * pageSize, (pageNum + 1) * pageSize - 1);

        if (query.trim()) {
            queryBuilder = queryBuilder.or(`sku.ilike.%${query}%,name.ilike.%${query}%`);
        }
        if (category) {
            queryBuilder = queryBuilder.eq('category', category);
        }
        if (subcategory) {
            queryBuilder = queryBuilder.eq('subcategory', subcategory);
        }

        // Apply quick filters
        if (qFilter === 'missing-images') {
            queryBuilder = queryBuilder.or('image_url.is.null,image_url.eq.');
        } else if (qFilter === 'missing-desc') {
            queryBuilder = queryBuilder.or('description.is.null,description.eq.');
        } else if (qFilter === 'uncategorized') {
            queryBuilder = queryBuilder.eq('category', 'Uncategorized');
        } else if (qFilter === 'has-variants') {
            queryBuilder = queryBuilder.not('specifications->variant_of', 'is', null);
        }

        const { data } = await queryBuilder;
        setProducts((data || []) as Product[]);
        setProductsLoading(false);
    };

    useEffect(() => {
        fetchProducts(searchQuery, categoryFilter, subcategoryFilter, 0, quickFilter);
    }, [sortBy, sortOrder]);

    const handleSearch = () => {
        setPage(0);
        fetchProducts(searchQuery, categoryFilter, subcategoryFilter, 0, quickFilter);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        await supabase.from('products').delete().eq('id', id);
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleSaveProduct = async () => {
        if (!editingProduct) return;
        await supabase.from('products').update({
            name: editingProduct.name,
            description: editingProduct.description,
            category: editingProduct.category,
            subcategory: editingProduct.subcategory
        }).eq('id', editingProduct.id);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null);
    };

    const handleAddProduct = async () => {
        if (!newProduct.sku || !newProduct.name) return alert('SKU and Name are required');
        const { error } = await supabase.from('products').insert({
            sku: newProduct.sku,
            name: newProduct.name,
            description: newProduct.description,
            category: newProduct.category || 'Uncategorized',
            subcategory: newProduct.subcategory || 'General',
            image_url: ''
        });
        if (!error) {
            setShowAddModal(false);
            setNewProduct({ sku: '', name: '', description: '', category: '', subcategory: '' });
            fetchProducts(searchQuery, categoryFilter, subcategoryFilter, page, quickFilter);
            onRefreshStats();
        }
    };

    const handleBulkCategoryChange = async () => {
        if (!bulkCategory || selectedIds.size === 0) return;
        await supabase.from('products').update({ category: bulkCategory }).in('id', Array.from(selectedIds));
        setProducts(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, category: bulkCategory } : p));
        setSelectedIds(new Set());
        setShowBulkModal(false);
        setBulkCategory('');
        onRefreshStats();
    };

    const handleBulkSubcategoryChange = async () => {
        if (!bulkSubcategory || selectedIds.size === 0) return;
        await supabase.from('products').update({ subcategory: bulkSubcategory }).in('id', Array.from(selectedIds));
        setProducts(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, subcategory: bulkSubcategory } : p));
        setSelectedIds(new Set());
        setShowBulkSubcategoryModal(false);
        setBulkSubcategory('');
        onRefreshStats();
    };

    const handleImageUpload = async (productId: string, file: File) => {
        setUploadingImage(productId);
        const ext = file.name.split('.').pop();
        const path = `products/${productId}.${ext}`;

        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
            await supabase.from('products').update({ image_url: publicUrl }).eq('id', productId);
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, image_url: publicUrl } : p));
        }
        setUploadingImage(null);
    };

    const handleInlineEdit = (id: string, field: 'name' | 'category' | 'subcategory', value: string) => {
        setInlineEdit({ id, field, value });
    };

    const handleInlineSave = async () => {
        if (!inlineEdit) return;
        setSavingInline(inlineEdit.id);
        await supabase.from('products').update({ [inlineEdit.field]: inlineEdit.value }).eq('id', inlineEdit.id);
        setProducts(prev => prev.map(p => p.id === inlineEdit.id ? { ...p, [inlineEdit.field]: inlineEdit.value } : p));
        setInlineEdit(null);
        setTimeout(() => setSavingInline(null), 1000);
    };

    const handleExportCSV = async () => {
        let allProducts: Product[] = [];
        let offset = 0;
        const limit = PAGE_SIZE.PRODUCTS_FETCH;

        while (true) {
            let queryBuilder = supabase
                .from('products')
                .select('sku, name, description, category, subcategory, image_url, specifications')
                .order('sku', { ascending: true })
                .range(offset, offset + limit - 1);

            if (categoryFilter) {
                queryBuilder = queryBuilder.eq('category', categoryFilter);
            }
            if (subcategoryFilter) {
                queryBuilder = queryBuilder.eq('subcategory', subcategoryFilter);
            }

            const { data } = await queryBuilder;
            if (!data || data.length === 0) break;
            allProducts = [...allProducts, ...(data as Product[])];
            offset += limit;
        }

        const headers = ['SKU', 'Name', 'Description', 'Category', 'Subcategory', 'Image URL', 'Parent SKU', 'Attributes'];
        const rows = allProducts.map(p => [
            p.sku,
            `"${(p.name || '').replace(/"/g, '""')}"`,
            `"${(p.description || '').replace(/"/g, '""')}"`,
            p.category,
            p.subcategory,
            p.image_url || '',
            p.specifications?.variant_of || '',
            JSON.stringify(p.specifications || {})
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSort = (column: SortColumn) => {
        if (sortBy === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === products.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(products.map(p => p.id)));
        }
    };

    // Search for potential parent products
    const searchParentProducts = async (query: string) => {
        if (!query.trim()) {
            setParentSearchResults([]);
            return;
        }
        setParentSearching(true);
        const { data } = await supabase
            .from('products')
            .select('id, sku, name, image_url')
            .or(`sku.ilike.%${query}%,name.ilike.%${query}%`)
            .neq('id', linkingProduct?.id || '')
            .limit(10);
        setParentSearchResults((data || []) as Product[]);
        setParentSearching(false);
    };

    // Link product as variant of parent
    const handleLinkVariant = async (parentSku: string) => {
        if (!linkingProduct) return;
        setLinkingSaving(true);

        const newSpecs = {
            ...(linkingProduct.specifications || {}),
            variant_of: parentSku
        };

        await supabase.from('products').update({
            specifications: newSpecs
        }).eq('id', linkingProduct.id);

        setProducts(prev => prev.map(p =>
            p.id === linkingProduct.id
                ? { ...p, specifications: newSpecs }
                : p
        ));

        setLinkingProduct(null);
        setParentSearchQuery('');
        setParentSearchResults([]);
        setLinkingSaving(false);
    };

    // Unlink product from its parent
    const handleUnlinkVariant = async (product: Product) => {
        if (!confirm(`Remove ${product.sku} from its variant group?`)) return;

        const newSpecs = { ...(product.specifications || {}) };
        delete newSpecs.variant_of;

        await supabase.from('products').update({
            specifications: Object.keys(newSpecs).length > 0 ? newSpecs : null
        }).eq('id', product.id);

        setProducts(prev => prev.map(p =>
            p.id === product.id
                ? { ...p, specifications: newSpecs }
                : p
        ));
    };

    const quickFilterOptions = [
        { id: 'all' as const, label: 'All Products', Icon: Package },
        { id: 'missing-images' as const, label: 'Missing Images', Icon: ImageOff },
        { id: 'missing-desc' as const, label: 'Missing Description', Icon: FileText },
        { id: 'uncategorized' as const, label: 'Uncategorized', Icon: AlertTriangle },
        { id: 'has-variants' as const, label: 'Has Variants', Icon: GitBranch },
    ];

    return (
        <div className="space-y-4">
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
                {quickFilterOptions.map(f => (
                    <button
                        key={f.id}
                        onClick={() => {
                            setQuickFilter(f.id);
                            setPage(0);
                            fetchProducts(searchQuery, categoryFilter, subcategoryFilter, 0, f.id);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${quickFilter === f.id
                            ? 'bg-brand-orange text-white shadow-md'
                            : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                            }`}
                    >
                        <f.Icon size={14} />
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 flex gap-2 min-w-[200px] flex-wrap">
                    <div className="relative flex-1 min-w-[150px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search SKU or name..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:!border-stone-400"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={e => {
                            setCategoryFilter(e.target.value);
                            setSubcategoryFilter('');
                            setPage(0);
                            fetchProducts(searchQuery, e.target.value, '', 0, quickFilter);
                        }}
                        className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none"
                    >
                        <option value="">All Categories</option>
                        {categoryStats.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    {categoryFilter && subcategoriesForCategory.length > 0 && (
                        <select
                            value={subcategoryFilter}
                            onChange={e => {
                                setSubcategoryFilter(e.target.value);
                                setPage(0);
                                fetchProducts(searchQuery, categoryFilter, e.target.value, 0, quickFilter);
                            }}
                            className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none"
                        >
                            <option value="">All Subcategories</option>
                            {subcategoriesForCategory.map(s => <option key={s.name} value={s.name}>{s.name} ({s.count})</option>)}
                        </select>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {canExport && (
                        <Button variant="outline" onClick={handleExportCSV}>
                            <Download size={16} className="mr-1" /> Export CSV
                        </Button>
                    )}
                    {canExport && (
                        <Button variant="outline" onClick={() => setShowImportModal(true)}>
                            <Upload size={16} className="mr-1" /> Import CSV
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => setShowAddModal(true)}>
                        <Plus size={16} className="mr-1" /> Add Product
                    </Button>
                    {selectedIds.size > 0 && (
                        <>
                            <Button variant="primary" onClick={() => setShowBulkModal(true)}>
                                Change Category ({selectedIds.size})
                            </Button>
                            <Button variant="outline" onClick={() => setShowBulkSubcategoryModal(true)}>
                                Change Subcategory ({selectedIds.size})
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {productsLoading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 border-b">
                                <tr>
                                    <th className="p-3 text-left w-10"></th>
                                    <th className="p-3 text-left">Image</th>
                                    <th className="p-3 text-left">SKU</th>
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Category</th>
                                    <th className="p-3 text-left">Subcategory</th>
                                    <th className="p-3 text-center">Variant</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(6)].map((_, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-3"><div className="w-5 h-5 bg-stone-200 rounded animate-pulse" /></td>
                                        <td className="p-3"><div className="w-10 h-10 bg-stone-200 rounded animate-pulse" /></td>
                                        <td className="p-3"><div className="w-20 h-4 bg-stone-200 rounded animate-pulse" /></td>
                                        <td className="p-3"><div className="w-32 h-4 bg-stone-200 rounded animate-pulse" /></td>
                                        <td className="p-3"><div className="w-24 h-4 bg-stone-200 rounded animate-pulse" /></td>
                                        <td className="p-3"><div className="w-20 h-4 bg-stone-200 rounded animate-pulse" /></td>
                                        <td className="p-3"><div className="w-16 h-4 bg-stone-200 rounded animate-pulse mx-auto" /></td>
                                        <td className="p-3"><div className="w-16 h-4 bg-stone-200 rounded animate-pulse ml-auto" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 border-b">
                                <tr>
                                    <th className="p-3 text-left">
                                        <button onClick={toggleSelectAll} className="text-stone-400 hover:text-brand-charcoal">
                                            {selectedIds.size === products.length ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </button>
                                    </th>
                                    <th className="p-3 text-left">Image</th>
                                    <th className="p-3 text-left">
                                        <button
                                            onClick={() => handleSort('sku')}
                                            className="flex items-center gap-1 hover:text-brand-orange"
                                        >
                                            SKU
                                            {sortBy === 'sku' && <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                                        </button>
                                    </th>
                                    <th className="p-3 text-left">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-1 hover:text-brand-orange"
                                        >
                                            Name
                                            {sortBy === 'name' && <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                                        </button>
                                    </th>
                                    <th className="p-3 text-left">
                                        <button
                                            onClick={() => handleSort('category')}
                                            className="flex items-center gap-1 hover:text-brand-orange"
                                        >
                                            Category
                                            {sortBy === 'category' && <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                                        </button>
                                    </th>
                                    <th className="p-3 text-left">Subcategory</th>
                                    <th className="p-3 text-center">Variant</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="border-b hover:bg-stone-50">
                                        <td className="p-3">
                                            <button onClick={() => toggleSelect(product.id)} className="text-stone-400 hover:text-brand-charcoal">
                                                {selectedIds.has(product.id) ? <CheckSquare size={18} className="text-brand-orange" /> : <Square size={18} />}
                                            </button>
                                        </td>
                                        <td className="p-3">
                                            <div
                                                className="w-10 h-10 bg-stone-100 rounded overflow-hidden relative group cursor-pointer"
                                                onClick={() => { setUploadingImage(product.id); fileInputRef.current?.click(); }}
                                            >
                                                {uploadingImage === product.id ? (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Loader2 size={16} className="animate-spin text-brand-orange" />
                                                    </div>
                                                ) : product.image_url ? (
                                                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                        <ImageOff size={16} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Upload size={14} className="text-white" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 font-mono text-brand-orange">{product.sku}</td>
                                        <td className="p-3 max-w-[200px]">
                                            {inlineEdit?.id === product.id && inlineEdit.field === 'name' ? (
                                                <input
                                                    autoFocus
                                                    value={inlineEdit.value}
                                                    onChange={e => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                                                    onBlur={handleInlineSave}
                                                    onKeyDown={e => e.key === 'Enter' && handleInlineSave()}
                                                    className="w-full px-2 py-1 border border-brand-orange rounded text-sm outline-none"
                                                />
                                            ) : (
                                                <span
                                                    onDoubleClick={() => handleInlineEdit(product.id, 'name', product.name)}
                                                    className="cursor-pointer hover:bg-stone-100 px-1 py-0.5 rounded truncate block"
                                                    title="Double-click to edit"
                                                >
                                                    {savingInline === product.id ? <Check size={14} className="inline text-green-500 mr-1" /> : null}
                                                    {product.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {inlineEdit?.id === product.id && inlineEdit.field === 'category' ? (
                                                <select
                                                    autoFocus
                                                    value={inlineEdit.value}
                                                    onChange={e => { setInlineEdit({ ...inlineEdit, value: e.target.value }); }}
                                                    onBlur={handleInlineSave}
                                                    className="px-2 py-1 border border-brand-orange rounded text-sm outline-none"
                                                >
                                                    {categoryStats.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                                </select>
                                            ) : (
                                                <span
                                                    onDoubleClick={() => handleInlineEdit(product.id, 'category', product.category)}
                                                    className="cursor-pointer hover:bg-stone-100 px-1 py-0.5 rounded text-stone-600"
                                                    title="Double-click to edit"
                                                >
                                                    {product.category}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3 text-stone-500">{product.subcategory}</td>
                                        <td className="p-3 text-center">
                                            {product.specifications?.variant_of && product.specifications?.variant_of !== product.sku ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                                                        <GitBranch size={12} className="inline mr-1" />
                                                        {product.specifications.variant_of}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUnlinkVariant(product)}
                                                        className="p-1 hover:bg-red-50 rounded text-stone-400 hover:text-red-500"
                                                        title="Unlink from parent"
                                                    >
                                                        <Unlink size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setLinkingProduct(product)}
                                                    className="px-2 py-0.5 bg-stone-100 hover:bg-indigo-50 text-stone-400 hover:text-indigo-600 text-xs rounded-full transition-colors"
                                                    title="Link as variant of another product"
                                                >
                                                    <Link2 size={12} className="inline mr-1" />
                                                    Link
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <a
                                                    href={`/product/${product.sku}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 hover:bg-stone-100 rounded"
                                                    title="View on site"
                                                >
                                                    <Eye size={14} className="text-stone-500" />
                                                </a>
                                                <button onClick={() => setEditingProduct(product)} className="p-1.5 hover:bg-stone-100 rounded" title="Edit">
                                                    <Edit size={14} className="text-stone-500" />
                                                </button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 hover:bg-red-50 rounded" title="Delete">
                                                    <Trash2 size={14} className="text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4 border-t flex justify-between items-center text-sm">
                    <span className="text-stone-500">Page {page + 1}</span>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setPage(p => p - 1); fetchProducts(searchQuery, categoryFilter, subcategoryFilter, page - 1, quickFilter); }} disabled={page === 0}>Prev</Button>
                        <Button variant="outline" onClick={() => { setPage(p => p + 1); fetchProducts(searchQuery, categoryFilter, subcategoryFilter, page + 1, quickFilter); }} disabled={products.length < pageSize}>Next</Button>
                    </div>
                </div>
            </div>

            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (file && uploadingImage) handleImageUpload(uploadingImage, file);
                    e.target.value = '';
                }}
            />

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Add New Product</h3>
                            <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
                        </div>
                        <div className="space-y-3">
                            <input placeholder="SKU *" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} className="w-full p-3 border rounded-lg" />
                            <input placeholder="Name *" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full p-3 border rounded-lg" />
                            <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full p-3 border rounded-lg h-24" />
                            <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full p-3 border rounded-lg" />
                            <input placeholder="Subcategory" value={newProduct.subcategory} onChange={e => setNewProduct({ ...newProduct, subcategory: e.target.value })} className="w-full p-3 border rounded-lg" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
                            <Button variant="primary" onClick={handleAddProduct} className="flex-1"><Plus size={16} className="mr-1" /> Add</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Edit Product</h3>
                            <button onClick={() => setEditingProduct(null)}><X size={20} /></button>
                        </div>
                        <div className="space-y-3">
                            <div><label className="text-xs text-stone-500">SKU</label><input value={editingProduct.sku} disabled className="w-full p-3 border rounded-lg bg-stone-50" /></div>
                            <div><label className="text-xs text-stone-500">Name</label><input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="text-xs text-stone-500">Description</label><textarea value={editingProduct.description || ''} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full p-3 border rounded-lg h-24" /></div>
                            <div><label className="text-xs text-stone-500">Category</label><input value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="text-xs text-stone-500">Subcategory</label><input value={editingProduct.subcategory} onChange={e => setEditingProduct({ ...editingProduct, subcategory: e.target.value })} className="w-full p-3 border rounded-lg" /></div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button variant="outline" onClick={() => setEditingProduct(null)} className="flex-1">Cancel</Button>
                            <Button variant="primary" onClick={handleSaveProduct} className="flex-1"><Save size={16} className="mr-1" /> Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Category Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Change Category for {selectedIds.size} Products</h3>
                            <button onClick={() => setShowBulkModal(false)}><X size={20} /></button>
                        </div>
                        <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)} className="w-full p-3 border rounded-lg mb-4">
                            <option value="">Select new category...</option>
                            {categoryStats.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowBulkModal(false)} className="flex-1">Cancel</Button>
                            <Button variant="primary" onClick={handleBulkCategoryChange} className="flex-1">Apply</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Subcategory Modal */}
            {showBulkSubcategoryModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Change Subcategory for {selectedIds.size} Products</h3>
                            <button onClick={() => setShowBulkSubcategoryModal(false)}><X size={20} /></button>
                        </div>
                        <input
                            placeholder="Enter new subcategory..."
                            value={bulkSubcategory}
                            onChange={e => setBulkSubcategory(e.target.value)}
                            className="w-full p-3 border rounded-lg mb-4"
                        />
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowBulkSubcategoryModal(false)} className="flex-1">Cancel</Button>
                            <Button variant="primary" onClick={handleBulkSubcategoryChange} className="flex-1">Apply</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Link as Variant Modal */}
            {linkingProduct && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg">
                        <div className="p-4 border-b flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-brand-charcoal">Link as Variant</h3>
                                <p className="text-sm text-stone-500 mt-1">
                                    Making <span className="font-mono text-brand-orange">{linkingProduct.sku}</span> a variant of...
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setLinkingProduct(null);
                                    setParentSearchQuery('');
                                    setParentSearchResults([]);
                                }}
                                className="p-1 hover:bg-stone-100 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search for parent product by SKU or name..."
                                    value={parentSearchQuery}
                                    onChange={e => {
                                        setParentSearchQuery(e.target.value);
                                        searchParentProducts(e.target.value);
                                    }}
                                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg outline-none focus:!border-stone-400"
                                    autoFocus
                                />
                                {parentSearching && (
                                    <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 animate-spin" />
                                )}
                            </div>

                            {/* Search Results */}
                            <div className="mt-4 max-h-[300px] overflow-y-auto">
                                {parentSearchResults.length === 0 && parentSearchQuery && !parentSearching ? (
                                    <div className="text-center py-8 text-stone-400">
                                        No products found matching "{parentSearchQuery}"
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {parentSearchResults.map(result => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleLinkVariant(result.sku)}
                                                disabled={linkingSaving}
                                                className="w-full flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:border-brand-orange hover:bg-brand-orange/5 transition-colors text-left disabled:opacity-50"
                                            >
                                                <div className="w-10 h-10 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                                                    {result.image_url ? (
                                                        <img src={result.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                            <Package size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-mono text-brand-orange text-sm">{result.sku}</p>
                                                    <p className="text-sm text-stone-600 truncate">{result.name}</p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {linkingSaving ? (
                                                        <Loader2 size={18} className="text-brand-orange animate-spin" />
                                                    ) : (
                                                        <Link2 size={18} className="text-stone-400" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Help Text */}
                            {parentSearchResults.length === 0 && !parentSearchQuery && (
                                <div className="text-center py-8 text-stone-400 text-sm">
                                    <GitBranch size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>Search for a product to make <strong>{linkingProduct.sku}</strong> its variant</p>
                                    <p className="text-xs mt-1">Variants share the same name but have different sizes/attributes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => {
                    fetchProducts(searchQuery, categoryFilter, subcategoryFilter, page, quickFilter);
                    onRefreshStats();
                }}
            />
        </div>
    );
};
