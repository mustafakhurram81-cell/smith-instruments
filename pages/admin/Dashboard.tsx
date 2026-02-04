import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import {
    Loader2, FolderOpen, ChevronRight, ChevronDown, Trash2, FolderEdit, RefreshCw, X
} from 'lucide-react';
import { Button } from '../../components/Shared';
import { useNavigate } from 'react-router-dom';
import {
    DashboardHeader,
    OverviewTab,
    CataloguesTab,
    QuotesTab,
    UsersTab,
    ActivityTab,
    ProductsTab,
    VariantsTab
} from '../../components/admin';
import type { DashboardStats, CategoryStats, CategoryEditState } from '../../types';

export const Dashboard: React.FC = () => {
    const { user, signOut, userRole } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        products: 0,
        categories: 0,
        uncategorized: 0,
        missingImages: 0,
        missingDesc: 0,
        withVariants: 0,
        parentProducts: 0,
        missingAttributes: 0
    });
    const [statsTree, setStatsTree] = useState<CategoryStats[]>([]);
    const categoryStats = statsTree;

    // Categories tab state
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [editingCategory, setEditingCategory] = useState<CategoryEditState | null>(null);

    // Settings state
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        let allProducts: { category: string; subcategory: string; sku: string; specifications: { variant_of?: string } | null }[] = [];
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

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const handlePasswordChange = async () => {
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
    };

    return (
        <div className="min-h-screen bg-stone-100">
            <DashboardHeader
                userEmail={user?.email}
                userRole={userRole}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
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
                    <ProductsTab
                        categoryStats={categoryStats}
                        onRefreshStats={fetchStats}
                    />
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                    <VariantsTab onRefreshStats={fetchStats} />
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
                                                <FolderOpen size={18} className="text-brand-orange" />
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
                                                                className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-brand-orange"
                                                                title="Rename Subcategory"
                                                            >
                                                                <FolderEdit size={14} />
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

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                    <ActivityTab />
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
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:!border-stone-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-stone-500 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:!border-stone-400"
                                />
                            </div>

                            <button
                                onClick={handlePasswordChange}
                                disabled={passwordSaving || !passwordData.newPassword}
                                className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
