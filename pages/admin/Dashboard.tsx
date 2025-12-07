import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Package, Loader2, FolderOpen, Settings, Search, Edit, Trash2, X, Save,
    Plus, Upload, CheckSquare, Square, FolderEdit,
    Filter, ChevronRight, ChevronDown
} from 'lucide-react';
import { Button } from '../../components/Shared';
import { StatsOverview, CategoryBreakdown } from '../../components/admin';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ products: 0, categories: 0, uncategorized: 0, missingImages: 0, missingDesc: 0 });
    const [products, setProducts] = useState<any[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ sku: '', name: '', description: '', category: '', subcategory: '' });
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkCategory, setBulkCategory] = useState('');
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editingCategory, setEditingCategory] = useState<{ old: string; new: string } | null>(null);
    const pageSize = 50;

    // Categories tab
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [statsTree, setStatsTree] = useState<{ name: string; count: number; subcategories: { name: string; count: number }[] }[]>([]);
    const categoryStats = statsTree;

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);

        const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: uncategorized } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category', 'Uncategorized');
        const { count: missingImages } = await supabase.from('products').select('*', { count: 'exact', head: true }).or('image_url.is.null,image_url.eq.');
        const { count: missingDesc } = await supabase.from('products').select('*', { count: 'exact', head: true }).or('description.is.null,description.eq.');

        const { data: allProducts } = await supabase.from('products').select('category, subcategory');

        const tree: Record<string, { count: number; subcategories: Record<string, number> }> = {};

        allProducts?.forEach(p => {
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
            missingDesc: missingDesc || 0
        });
        setLoading(false);
    };

    // ... (keep fetchProducts, handleSearch, methods)

    // New Category methods
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

    // ... (keep other handlers)

    // RENDER SECTION UPDATE FOR CATEGORIES TAB



    const fetchProducts = async (query: string = '', category: string = '', pageNum: number = 0) => {
        setProductsLoading(true);
        setSelectedIds(new Set());

        let queryBuilder = supabase
            .from('products')
            .select('id, sku, name, description, category, subcategory, image_url')
            .order('sku', { ascending: true })
            .range(pageNum * pageSize, (pageNum + 1) * pageSize - 1);

        if (query.trim()) {
            queryBuilder = queryBuilder.or(`sku.ilike.%${query}%,name.ilike.%${query}%`);
        }
        if (category) {
            queryBuilder = queryBuilder.eq('category', category);
        }

        const { data } = await queryBuilder;
        setProducts(data || []);
        setProductsLoading(false);
    };

    const handleSearch = () => {
        setPage(0);
        fetchProducts(searchQuery, categoryFilter, 0);
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
            fetchProducts(searchQuery, categoryFilter, page);
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

    const handleLogout = () => {
        localStorage.removeItem('admin_authenticated');
        window.location.href = '/#/admin/login';
    };

    useEffect(() => {
        if (activeTab === 'products') fetchProducts('', '', 0);
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-stone-100">
            {/* Header */}
            <div className="bg-brand-charcoal text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-serif">Smith Instruments Admin</h1>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm text-stone-400 hover:text-white">← Back to Site</Link>
                        <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-stone-300 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'products', label: 'Products', icon: Package },
                        { id: 'categories', label: 'Categories', icon: FolderOpen },
                        { id: 'settings', label: 'Settings', icon: Settings }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-brand-gold text-brand-charcoal' : 'border-transparent text-stone-500 hover:text-brand-charcoal'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { label: 'Total Products', value: stats.products, color: 'blue', icon: Package },
                                { label: 'Categories', value: stats.categories, color: 'green', icon: FolderOpen },
                                { label: 'Uncategorized', value: stats.uncategorized, color: 'amber', icon: AlertTriangle },
                                { label: 'Missing Images', value: stats.missingImages, color: 'red', icon: ImageOff },
                                { label: 'Missing Description', value: stats.missingDesc, color: 'purple', icon: FileText },
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
                                <button onClick={fetchStats} className="text-brand-gold text-sm hover:underline flex items-center gap-1">
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
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        {/* Toolbar */}
                        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-center">
                            <div className="flex-1 flex gap-2 min-w-[200px]">
                                <div className="relative flex-1">
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
                                    onChange={e => { setCategoryFilter(e.target.value); setPage(0); fetchProducts(searchQuery, e.target.value, 0); }}
                                    className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none"
                                >
                                    <option value="">All Categories</option>
                                    {categoryStats.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setShowAddModal(true)}>
                                    <Plus size={16} className="mr-1" /> Add Product
                                </Button>
                                {selectedIds.size > 0 && (
                                    <Button variant="primary" onClick={() => setShowBulkModal(true)}>
                                        Change Category ({selectedIds.size})
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {productsLoading ? (
                                <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-brand-gold" size={32} /></div>
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
                                                <th className="p-3 text-left">SKU</th>
                                                <th className="p-3 text-left">Name</th>
                                                <th className="p-3 text-left">Category</th>
                                                <th className="p-3 text-left">Subcategory</th>
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
                                                    <td className="p-3 max-w-[200px] truncate">{product.name}</td>
                                                    <td className="p-3 text-stone-600">{product.category}</td>
                                                    <td className="p-3 text-stone-500">{product.subcategory}</td>
                                                    <td className="p-3 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <button onClick={() => setEditingProduct(product)} className="p-1.5 hover:bg-stone-100 rounded">
                                                                <Edit size={14} className="text-stone-500" />
                                                            </button>
                                                            <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 hover:bg-red-50 rounded">
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
                                    <Button variant="outline" onClick={() => { setPage(p => p - 1); fetchProducts(searchQuery, categoryFilter, page - 1); }} disabled={page === 0}>Prev</Button>
                                    <Button variant="outline" onClick={() => { setPage(p => p + 1); fetchProducts(searchQuery, categoryFilter, page + 1); }} disabled={products.length < pageSize}>Next</Button>
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

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-xl bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-medium text-brand-charcoal mb-4">Settings</h2>
                        <div className="space-y-4">
                            <p className="text-sm text-stone-500">Admin password is set in Login.tsx (currently: smith123)</p>
                            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Logout</button>
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
        </div>
    );
};
