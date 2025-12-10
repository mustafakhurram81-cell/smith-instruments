import React, { useState, useEffect } from 'react';
import {
    Plus, Edit, Trash2, Save, X, Loader2, Eye, EyeOff,
    GripVertical, BookOpen, Search
} from 'lucide-react';
import { Button } from '../Shared';
import {
    getAllCatalogues,
    createCatalogue,
    updateCatalogue,
    deleteCatalogue,
    Catalogue
} from '../../lib/database';

interface CataloguesTabProps {
    onRefresh?: () => void;
}

export const CataloguesTab: React.FC<CataloguesTabProps> = ({ onRefresh }) => {
    const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCatalogue, setEditingCatalogue] = useState<Catalogue | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        size: '',
        color: '#262626',
        pdf_url: '',
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        fetchCatalogues();
    }, []);

    const fetchCatalogues = async () => {
        setLoading(true);
        const data = await getAllCatalogues();
        setCatalogues(data);
        setLoading(false);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            size: '',
            color: '#262626',
            pdf_url: '',
            display_order: catalogues.length + 1,
            is_active: true
        });
    };

    const handleAdd = () => {
        resetForm();
        setFormData(prev => ({ ...prev, display_order: catalogues.length + 1 }));
        setShowAddModal(true);
    };

    const handleEdit = (catalogue: Catalogue) => {
        setFormData({
            title: catalogue.title,
            description: catalogue.description || '',
            category: catalogue.category || '',
            size: catalogue.size || '',
            color: catalogue.color || '#262626',
            pdf_url: catalogue.pdf_url,
            display_order: catalogue.display_order,
            is_active: catalogue.is_active
        });
        setEditingCatalogue(catalogue);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.pdf_url) {
            alert('Title and PDF URL are required');
            return;
        }

        setSaving(true);

        if (editingCatalogue) {
            // Update existing
            const updated = await updateCatalogue(editingCatalogue.id, formData);
            if (updated) {
                setCatalogues(prev => prev.map(c => c.id === editingCatalogue.id ? updated : c));
            }
            setEditingCatalogue(null);
        } else {
            // Create new
            const newCatalogue = await createCatalogue({
                ...formData,
                thumbnail_url: null
            });
            if (newCatalogue) {
                setCatalogues(prev => [...prev, newCatalogue]);
            }
            setShowAddModal(false);
        }

        resetForm();
        setSaving(false);
        onRefresh?.();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this catalogue?')) return;

        const success = await deleteCatalogue(id);
        if (success) {
            setCatalogues(prev => prev.filter(c => c.id !== id));
            onRefresh?.();
        }
    };

    const handleToggleActive = async (catalogue: Catalogue) => {
        const updated = await updateCatalogue(catalogue.id, { is_active: !catalogue.is_active });
        if (updated) {
            setCatalogues(prev => prev.map(c => c.id === catalogue.id ? updated : c));
        }
    };

    const filteredCatalogues = catalogues.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const CATEGORY_OPTIONS = ['Surgery', 'Dental', 'Cardiovascular', 'Neuro', 'ENT', 'General'];

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search catalogues..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-brand-gold w-64"
                        />
                    </div>
                    <span className="text-sm text-stone-500">
                        {catalogues.length} catalogue{catalogues.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <Button variant="primary" onClick={handleAdd}>
                    <Plus size={16} className="mr-1" /> Add Catalogue
                </Button>
            </div>

            {/* Catalogues List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                    </div>
                ) : filteredCatalogues.length === 0 ? (
                    <div className="p-8 text-center text-stone-500">
                        <BookOpen size={48} className="mx-auto mb-4 text-stone-300" />
                        <p>No catalogues found</p>
                        <button onClick={handleAdd} className="mt-2 text-brand-gold hover:underline">
                            Add your first catalogue
                        </button>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-stone-50 border-b">
                            <tr>
                                <th className="p-3 text-left w-12">#</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Size</th>
                                <th className="p-3 text-left">PDF Path</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCatalogues.map((catalogue, idx) => (
                                <tr key={catalogue.id} className="border-b hover:bg-stone-50">
                                    <td className="p-3 text-stone-400">{catalogue.display_order}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded"
                                                style={{ backgroundColor: catalogue.color || '#262626' }}
                                            />
                                            <span className="font-medium text-brand-charcoal">{catalogue.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-stone-500">{catalogue.category || '—'}</td>
                                    <td className="p-3 text-stone-500">{catalogue.size || '—'}</td>
                                    <td className="p-3 text-stone-400 font-mono text-xs truncate max-w-[200px]">
                                        {catalogue.pdf_url}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleToggleActive(catalogue)}
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${catalogue.is_active
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-stone-100 text-stone-400'
                                                }`}
                                        >
                                            {catalogue.is_active ? 'Active' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-end gap-1">
                                            <a
                                                href={catalogue.pdf_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 hover:bg-stone-100 rounded"
                                                title="View PDF"
                                            >
                                                <Eye size={14} className="text-stone-500" />
                                            </a>
                                            <button
                                                onClick={() => handleEdit(catalogue)}
                                                className="p-1.5 hover:bg-stone-100 rounded"
                                            >
                                                <Edit size={14} className="text-stone-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(catalogue.id)}
                                                className="p-1.5 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={14} className="text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingCatalogue) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-brand-charcoal">
                                {editingCatalogue ? 'Edit Catalogue' : 'Add Catalogue'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingCatalogue(null);
                                    resetForm();
                                }}
                                className="p-1 hover:bg-stone-100 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Plastic Surgery"
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description..."
                                    rows={2}
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold"
                                />
                            </div>

                            {/* Category & Size */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold"
                                    >
                                        <option value="">Select category</option>
                                        {CATEGORY_OPTIONS.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">
                                        File Size
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                                        placeholder="e.g., 8MB"
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold"
                                    />
                                </div>
                            </div>

                            {/* PDF URL */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1">
                                    PDF Path *
                                </label>
                                <input
                                    type="text"
                                    value={formData.pdf_url}
                                    onChange={e => setFormData({ ...formData, pdf_url: e.target.value })}
                                    placeholder="/catalogues/your-file.pdf"
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold font-mono text-sm"
                                />
                                <p className="text-xs text-stone-400 mt-1">
                                    Place PDF in public/catalogues/ folder, then enter path like /catalogues/filename.pdf
                                </p>
                            </div>

                            {/* Color & Order */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">
                                        Cover Color
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            className="w-10 h-10 rounded border border-stone-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            className="flex-1 px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-gold"
                                    />
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 accent-brand-gold"
                                />
                                <label htmlFor="is_active" className="text-sm text-stone-600">
                                    Active (visible on website)
                                </label>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingCatalogue(null);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <Loader2 size={16} className="animate-spin mr-1" />
                                ) : (
                                    <Save size={16} className="mr-1" />
                                )}
                                {editingCatalogue ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
