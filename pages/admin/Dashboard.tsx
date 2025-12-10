import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import {
    Package, Loader2, FolderOpen, Settings, Search, Edit, Trash2, X, Save,
    Plus, Upload, CheckSquare, Square, FolderEdit,
    Filter, ChevronRight, ChevronDown, BarChart3, AlertTriangle, ImageOff, FileText, RefreshCw,
    Download, ExternalLink, GitBranch, Layers, ArrowUpDown, Eye, Check, Link2, Unlink
} from 'lucide-react';
import { Button } from '../../components/Shared';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardHeader, OverviewTab, CategoriesTab, CataloguesTab, QuotesTab, UsersTab } from '../../components/admin';

interface VariantGroup {
    parent_sku: string;
    parent_name: string;
    variants: any[];
}

export const Dashboard: React.FC = () => {
    const { user, signOut, canExport, userRole } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        uncategorized: 0,
        missingImages: 0,
        missingDesc: 0,
        withVariants: 0,
        parentProducts: 0,
        missingAttributes: 0
    });
    const [products, setProducts] = useState<any[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [subcategoryFilter, setSubcategoryFilter] = useState('');
    const [sortBy, setSortBy] = useState<'sku' | 'name' | 'category'>('sku');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ sku: '', name: '', description: '', category: '', subcategory: '' });
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showBulkSubcategoryModal, setShowBulkSubcategoryModal] = useState(false);
    const [bulkCategory, setBulkCategory] = useState('');
    const [bulkSubcategory, setBulkSubcategory] = useState('');
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editingCategory, setEditingCategory] = useState<{ old: string; new: string } | null>(null);
    const pageSize = 50;

    // Quick Filters
    const [quickFilter, setQuickFilter] = useState<'all' | 'missing-images' | 'missing-desc' | 'uncategorized' | 'has-variants'>('all');

    // Inline Editing
    const [inlineEdit, setInlineEdit] = useState<{ id: string; field: 'name' | 'category' | 'subcategory'; value: string } | null>(null);
    const [savingInline, setSavingInline] = useState<string | null>(null);

    // Categories tab
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [statsTree, setStatsTree] = useState<{ name: string; count: number; subcategories: { name: string; count: number }[] }[]>([]);
    const categoryStats = statsTree;

    // Variants tab
    const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
    const [variantsLoading, setVariantsLoading] = useState(false);
    const [expandedVariantGroups, setExpandedVariantGroups] = useState<Set<string>>(new Set());
    const [variantSearchQuery, setVariantSearchQuery] = useState('');
    const [variantPage, setVariantPage] = useState(0);
    const [editingVariant, setEditingVariant] = useState<any>(null);

    // Settings / Password change
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Link as Variant
    const [linkingProduct, setLinkingProduct] = useState<any>(null);
    const [parentSearchQuery, setParentSearchQuery] = useState('');
    const [parentSearchResults, setParentSearchResults] = useState<any[]>([]);
    const [parentSearching, setParentSearching] = useState(false);
    const [linkingSaving, setLinkingSaving] = useState(false);

    // Get subcategories for selected category
    const subcategoriesForCategory = categoryFilter
        ? statsTree.find(c => c.name === categoryFilter)?.subcategories || []
        : [];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);

        const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: uncategorized } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category', 'Uncategorized');
        const { count: missingImages } = await supabase.from('products').select('*', { count: 'exact', head: true }).or('image_url.is.null,image_url.eq.');
        const { count: missingDesc } = await supabase.from('products').select('*', { count: 'exact', head: true }).or('description.is.null,description.eq.');

        // Paginate through ALL products to get accurate counts
        const pageSize = 1000;
        let allProducts: { category: string; subcategory: string; sku: string; specifications: any }[] = [];
        let page = 0;
        let hasMore = true;

        while (hasMore) {
            const { data } = await supabase
                .from('products')
                .select('category, subcategory, sku, specifications')
                .range(page * pageSize, (page + 1) * pageSize - 1);

            if (data && data.length > 0) {
                allProducts = [...allProducts, ...data];
                hasMore = data.length === pageSize;
                page++;
            } else {
                hasMore = false;
            }
        }

        // Calculate variant stats
        const parentSkus = new Set<string>();
        let productsWithVariants = 0;
        let missingAttributes = 0;

        allProducts.forEach(p => {
            const variantOf = p.specifications?.variant_of;
            if (variantOf && variantOf !== p.sku) {
                productsWithVariants++;
                parentSkus.add(variantOf);
            }
            if (!p.specifications || Object.keys(p.specifications || {}).length === 0) {
                missingAttributes++;
            }
        });

        const tree: Record<string, { count: number; subcategories: Record<string, number> }> = {};

        allProducts.forEach(p => {
            if (!tree[p.category]) {
                tree[p.category] = { count: 0, subcategories: {} };
            }
            tree[p.category].count++;

            const sub = p.subcategory || 'General';
            tree[p.category].subcategories[sub] = (tree[p.category].subcategories[sub] || 0) + 1;
        });

        const sortedTree = Object.entries(tree)
            .map(([name, data]) => ({
                name,
                count: data.count,
                subcategories: Object.entries(data.subcategories)
                    .map(([subName, subCount]) => ({ name: subName, count: subCount }))
                    .sort((a, b) => b.count - a.count)
            }))
            .sort((a, b) => b.count - a.count);

        setStatsTree(sortedTree);
        setStats({
            products: total || 0,
            categories: sortedTree.length,
            uncategorized: uncategorized || 0,
            missingImages: missingImages || 0,
            missingDesc: missingDesc || 0,
            withVariants: productsWithVariants,
            parentProducts: parentSkus.size,
            missingAttributes
        });
        setLoading(false);
    };

    // Variants tab methods
    const fetchVariantGroups = async (query: string = '', pageNum: number = 0) => {
        setVariantsLoading(true);

        // Get all products with specifications.variant_of
        let queryBuilder = supabase
            .from('products')
            .select('*')
            .not('specifications->variant_of', 'is', null)
            .order('sku', { ascending: true })
            .range(pageNum * 200, (pageNum + 1) * 200 - 1);

        if (query.trim()) {
            queryBuilder = queryBuilder.or(`sku.ilike.%${query}%,name.ilike.%${query}%`);
        }

        const { data } = await queryBuilder;

        // Group by variant_of (parent SKU)
        const groups: Record<string, VariantGroup> = {};
        (data || []).forEach(product => {
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
    };

    // Category methods
    const toggleExpand = (catName: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            next.has(catName) ? next.delete(catName) : next.add(catName);
            return next;
        });
    };

    const handleRenameSubcategory = async (category: string, oldSub: string, newSub: string) => {
        if (!newSub || newSub === oldSub) return;
        await supabase.from('products')
            .update({ subcategory: newSub })
            .eq('category', category)
            .eq('subcategory', oldSub);
        fetchStats();
    };

    const fetchProducts = async (query: string = '', category: string = '', subcategory: string = '', pageNum: number = 0, qFilter: typeof quickFilter = 'all') => {
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
        setProducts(data || []);
        setProductsLoading(false);
    };

    const handleSearch = () => {
        setPage(0);
        fetchProducts(searchQuery, categoryFilter, subcategoryFilter, 0);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        await supabase.from('products').delete().eq('id', id);
        setProducts(prev => prev.filter(p => p.id !== id));
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
            .neq('id', linkingProduct?.id) // Exclude the product being linked
            .limit(10);
        setParentSearchResults(data || []);
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

        // Update local state
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
    const handleUnlinkVariant = async (product: any) => {
        if (!confirm(`Remove ${product.sku} from its variant group?`)) return;

        const newSpecs = { ...(product.specifications || {}) };
        delete newSpecs.variant_of;

        await supabase.from('products').update({
            specifications: Object.keys(newSpecs).length > 0 ? newSpecs : null
        }).eq('id', product.id);

        // Update local state
        setProducts(prev => prev.map(p =>
            p.id === product.id
                ? { ...p, specifications: newSpecs }
                : p
        ));
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
            fetchProducts(searchQuery, categoryFilter, subcategoryFilter, page);
            fetchStats();
        }
    };

    const handleBulkCategoryChange = async () => {
        if (!bulkCategory || selectedIds.size === 0) return;
        await supabase.from('products').update({ category: bulkCategory }).in('id', Array.from(selectedIds));
        setProducts(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, category: bulkCategory } : p));
        setSelectedIds(new Set());
        setShowBulkModal(false);
        setBulkCategory('');
        fetchStats();
    };

    const handleBulkSubcategoryChange = async () => {
        if (!bulkSubcategory || selectedIds.size === 0) return;
        await supabase.from('products').update({ subcategory: bulkSubcategory }).in('id', Array.from(selectedIds));
        setProducts(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, subcategory: bulkSubcategory } : p));
        setSelectedIds(new Set());
        setShowBulkSubcategoryModal(false);
        setBulkSubcategory('');
        fetchStats();
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

    const handleRenameCategory = async () => {
        if (!editingCategory) return;
        await supabase.from('products').update({ category: editingCategory.new }).eq('category', editingCategory.old);
        setEditingCategory(null);
        fetchStats();
    };

    const handleDeleteCategory = async (category: string) => {
        if (!confirm(`Move all products in "${category}" to Uncategorized?`)) return;
        await supabase.from('products').update({ category: 'Uncategorized' }).eq('category', category);
        fetchStats();
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

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };

    // Inline editing
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

    // Export to CSV
    const handleExportCSV = async () => {
        // Fetch all products (or filtered)
        let allProducts: any[] = [];
        let offset = 0;
        const limit = 1000;

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
            allProducts = [...allProducts, ...data];
            offset += limit;
        }

        // Create CSV
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

    const handleSort = (column: 'sku' | 'name' | 'category') => {
        if (sortBy === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    useEffect(() => {
        if (activeTab === 'products') fetchProducts(searchQuery, categoryFilter, subcategoryFilter, 0);
    }, [activeTab, sortBy, sortOrder]);

    useEffect(() => {
        if (activeTab === 'variants') fetchVariantGroups('', 0);
    }, [activeTab]);

    // Get variant count for a product
    const getVariantCount = (product: any) => {
        const variantOf = product.specifications?.variant_of;
        if (!variantOf || variantOf === product.sku) return 0;
        return products.filter(p => p.specifications?.variant_of === variantOf).length;
    };

    return (
        <div className="min-h-screen bg-stone-100">
            <DashboardHeader
                userEmail={user?.email}
                userRole={userRole}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab as any)}
                onLogout={handleLogout}
            />

            <div className="max-w-7xl mx-auto px-6 pb-6">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <OverviewTab
                        stats={stats}
                        categoryStats={categoryStats}
                        loading={loading}
                        onRefresh={fetchStats}
                    />
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'all', label: 'All Products', icon: Package },
                                { id: 'missing-images', label: 'Missing Images', icon: ImageOff },
                                { id: 'missing-desc', label: 'Missing Description', icon: FileText },
                                { id: 'uncategorized', label: 'Uncategorized', icon: AlertTriangle },
                                { id: 'has-variants', label: 'Has Variants', icon: GitBranch },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => {
                                        setQuickFilter(f.id as typeof quickFilter);
                                        setPage(0);
                                        fetchProducts(searchQuery, categoryFilter, subcategoryFilter, 0, f.id as typeof quickFilter);
                                    }}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${quickFilter === f.id
                                        ? 'bg-brand-gold text-white shadow-md'
                                        : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                                        }`}
                                >
                                    <f.icon size={14} />
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
                                        className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-brand-gold"
                                    />
                                </div>
                                <select
                                    value={categoryFilter}
                                    onChange={e => {
                                        setCategoryFilter(e.target.value);
                                        setSubcategoryFilter('');
                                        setPage(0);
                                        fetchProducts(searchQuery, e.target.value, '', 0);
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
                                            fetchProducts(searchQuery, categoryFilter, e.target.value, 0);
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
                                                        className="flex items-center gap-1 hover:text-brand-gold"
                                                    >
                                                        SKU
                                                        {sortBy === 'sku' && <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                                                    </button>
                                                </th>
                                                <th className="p-3 text-left">
                                                    <button
                                                        onClick={() => handleSort('name')}
                                                        className="flex items-center gap-1 hover:text-brand-gold"
                                                    >
                                                        Name
                                                        {sortBy === 'name' && <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                                                    </button>
                                                </th>
                                                <th className="p-3 text-left">
                                                    <button
                                                        onClick={() => handleSort('category')}
                                                        className="flex items-center gap-1 hover:text-brand-gold"
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
                                                            {selectedIds.has(product.id) ? <CheckSquare size={18} className="text-brand-gold" /> : <Square size={18} />}
                                                        </button>
                                                    </td>
                                                    <td className="p-3">
                                                        <div
                                                            className="w-10 h-10 bg-stone-100 rounded overflow-hidden relative group cursor-pointer"
                                                            onClick={() => { setUploadingImage(product.id); fileInputRef.current?.click(); }}
                                                        >
                                                            {uploadingImage === product.id ? (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Loader2 size={16} className="animate-spin text-brand-gold" />
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
                                                    <td className="p-3 font-mono text-brand-gold">{product.sku}</td>
                                                    <td className="p-3 max-w-[200px]">
                                                        {inlineEdit?.id === product.id && inlineEdit.field === 'name' ? (
                                                            <input
                                                                autoFocus
                                                                value={inlineEdit.value}
                                                                onChange={e => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                                                                onBlur={handleInlineSave}
                                                                onKeyDown={e => e.key === 'Enter' && handleInlineSave()}
                                                                className="w-full px-2 py-1 border border-brand-gold rounded text-sm outline-none"
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
                                                                className="px-2 py-1 border border-brand-gold rounded text-sm outline-none"
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
                                                                href={`/#/product/${product.sku}`}
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
                                    <Button variant="outline" onClick={() => { setPage(p => p - 1); fetchProducts(searchQuery, categoryFilter, subcategoryFilter, page - 1); }} disabled={page === 0}>Prev</Button>
                                    <Button variant="outline" onClick={() => { setPage(p => p + 1); fetchProducts(searchQuery, categoryFilter, subcategoryFilter, page + 1); }} disabled={products.length < pageSize}>Next</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
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
                                    className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-brand-gold"
                                />
                            </div>
                            <Button variant="outline" onClick={() => fetchVariantGroups(variantSearchQuery, 0)}>
                                <RefreshCw size={16} className="mr-1" /> Refresh
                            </Button>
                        </div>

                        {/* Variant Groups */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {variantsLoading ? (
                                <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-brand-gold" size={32} /></div>
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
                                                        <Layers size={18} className="text-brand-gold" />
                                                        <span className="font-mono text-brand-gold">{group.parent_sku}</span>
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
                                                                        <td className="p-3 pl-12 font-mono text-brand-gold">{variant.sku}</td>
                                                                        <td className="p-3 text-stone-600 max-w-[200px] truncate">{variant.description}</td>
                                                                        <td className="p-3 text-stone-500">{variant.specifications?.fig || variant.specifications?.figure || '—'}</td>
                                                                        <td className="p-3 text-stone-500">{variant.specifications?.length || '—'}</td>
                                                                        <td className="p-3 text-stone-500">{variant.specifications?.blade || '—'}</td>
                                                                        <td className="p-3 text-stone-500">{variant.specifications?.size || '—'}</td>
                                                                        <td className="p-3 text-right">
                                                                            <div className="flex justify-end gap-1">
                                                                                <a
                                                                                    href={`/#/product/${variant.sku}`}
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
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-medium text-brand-charcoal">Manage Categories & Subcategories</h2>
                            <Button variant="outline" onClick={fetchStats} className="text-xs">
                                <RefreshCw size={14} className="mr-2" /> Refresh
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {statsTree.map(cat => {
                                const isExpanded = expandedCategories.has(cat.name);
                                return (
                                    <div key={cat.name} className="border border-stone-200 rounded-lg overflow-hidden">
                                        <div className="flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 transition-colors">
                                            <div
                                                className="flex items-center gap-3 cursor-pointer select-none flex-1"
                                                onClick={() => toggleExpand(cat.name)}
                                            >
                                                {isExpanded ? <ChevronDown size={18} className="text-stone-400" /> : <ChevronRight size={18} className="text-stone-400" />}
                                                <FolderOpen size={18} className="text-brand-gold" />
                                                <span className="font-medium">{cat.name}</span>
                                                <span className="text-xs px-2 py-0.5 bg-white border border-stone-200 rounded-full text-stone-500">
                                                    {cat.count} total
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingCategory({ old: cat.name, new: cat.name })}
                                                    className="p-2 hover:bg-stone-200 rounded text-stone-500"
                                                    title="Rename Category"
                                                >
                                                    <FolderEdit size={16} />
                                                </button>
                                                {cat.name !== 'Uncategorized' && (
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat.name)}
                                                        className="p-2 hover:bg-red-50 rounded text-red-400"
                                                        title="Delete Category"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="bg-white border-t border-stone-200 divide-y divide-stone-100">
                                                {cat.subcategories.map(sub => (
                                                    <div key={sub.name} className="flex items-center justify-between p-3 pl-12 hover:bg-stone-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                                                            <span className="text-sm text-stone-700">{sub.name}</span>
                                                            <span className="text-xs text-stone-400">({sub.count})</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    const newName = prompt('Rename subcategory to:', sub.name);
                                                                    if (newName) handleRenameSubcategory(cat.name, sub.name, newName);
                                                                }}
                                                                className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-brand-gold"
                                                                title="Rename Subcategory"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {cat.subcategories.length === 0 && (
                                                    <div className="p-3 pl-12 text-sm text-stone-400 italic">No subcategories</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Catalogues Tab */}
                {activeTab === 'catalogues' && (
                    <CataloguesTab onRefresh={fetchStats} />
                )}

                {/* Quotes Tab */}
                {activeTab === 'quotes' && (
                    <QuotesTab />
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <UsersTab />
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-xl bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-medium text-brand-charcoal mb-6">Account Settings</h2>

                        {/* Change Password Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-stone-600 border-b pb-2">Change Password</h3>

                            {passwordMessage && (
                                <div className={`p-3 rounded-lg text-sm ${passwordMessage.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {passwordMessage.text}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-stone-500 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-stone-500 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold"
                                />
                            </div>

                            <button
                                onClick={async () => {
                                    if (passwordData.newPassword.length < 6) {
                                        setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
                                        return;
                                    }
                                    if (passwordData.newPassword !== passwordData.confirmPassword) {
                                        setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
                                        return;
                                    }

                                    setPasswordSaving(true);
                                    setPasswordMessage(null);

                                    const { error } = await supabase.auth.updateUser({
                                        password: passwordData.newPassword
                                    });

                                    if (error) {
                                        setPasswordMessage({ type: 'error', text: error.message });
                                    } else {
                                        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
                                        setPasswordData({ newPassword: '', confirmPassword: '' });
                                    }

                                    setPasswordSaving(false);
                                }}
                                disabled={passwordSaving || !passwordData.newPassword}
                                className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {passwordSaving && <Loader2 size={16} className="animate-spin" />}
                                Update Password
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="border-t my-6"></div>

                        {/* Logout Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-stone-600 border-b pb-2">Session</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-stone-600">Logged in as</p>
                                    <p className="text-xs text-stone-400">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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

            {/* Rename Category Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Rename Category</h3>
                            <button onClick={() => setEditingCategory(null)}><X size={20} /></button>
                        </div>
                        <input
                            value={editingCategory.new}
                            onChange={e => setEditingCategory({ ...editingCategory, new: e.target.value })}
                            className="w-full p-3 border rounded-lg mb-4"
                            placeholder="New category name"
                        />
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setEditingCategory(null)} className="flex-1">Cancel</Button>
                            <Button variant="primary" onClick={handleRenameCategory} className="flex-1">Rename</Button>
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
                                    Making <span className="font-mono text-brand-gold">{linkingProduct.sku}</span> a variant of...
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
                                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg outline-none focus:border-brand-gold"
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
                                                className="w-full flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:border-brand-gold hover:bg-brand-gold/5 transition-colors text-left disabled:opacity-50"
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
                                                    <p className="font-mono text-brand-gold text-sm">{result.sku}</p>
                                                    <p className="text-sm text-stone-600 truncate">{result.name}</p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {linkingSaving ? (
                                                        <Loader2 size={18} className="text-brand-gold animate-spin" />
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
        </div>
    );
};
