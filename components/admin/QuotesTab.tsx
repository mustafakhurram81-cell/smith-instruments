import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Loader2, Mail, Phone, MapPin, Package, Clock, CheckCircle,
    MessageSquare, Archive, RefreshCw, ChevronDown, ChevronRight,
    ExternalLink, Search, Filter
} from 'lucide-react';
import { Button } from '../Shared';

interface QuoteRequest {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    customer_company: string | null;
    customer_country: string | null;
    products: Array<{ sku: string; name: string; quantity: number; image_url?: string }>;
    message: string | null;
    status: 'new' | 'read' | 'replied' | 'converted' | 'archived';
    created_at: string;
    updated_at: string;
    replied_at: string | null;
    notes: string | null;
}

const STATUS_CONFIG = {
    new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Mail },
    read: { label: 'Read', color: 'bg-yellow-100 text-yellow-700', icon: CheckCircle },
    replied: { label: 'Replied', color: 'bg-green-100 text-green-700', icon: MessageSquare },
    converted: { label: 'Converted', color: 'bg-purple-100 text-purple-700', icon: Package },
    archived: { label: 'Archived', color: 'bg-stone-100 text-stone-500', icon: Archive }
};

export const QuotesTab: React.FC = () => {
    const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchQuotes = async () => {
        setLoading(true);
        let query = supabase
            .from('quote_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        if (searchQuery) {
            query = query.or(`customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query.limit(100);

        if (error) {
            console.error('Error fetching quotes:', error);
        } else {
            setQuotes(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchQuotes();
    }, [statusFilter]);

    const updateStatus = async (id: string, newStatus: QuoteRequest['status']) => {
        setUpdatingId(id);
        const updates: any = { status: newStatus };

        if (newStatus === 'replied') {
            updates.replied_at = new Date().toISOString();
        }

        await supabase.from('quote_requests').update(updates).eq('id', id);

        setQuotes(prev => prev.map(q =>
            q.id === id ? { ...q, ...updates } : q
        ));
        setUpdatingId(null);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) {
            return 'Just now';
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const stats = {
        total: quotes.length,
        new: quotes.filter(q => q.status === 'new').length,
        pending: quotes.filter(q => q.status === 'read').length,
        replied: quotes.filter(q => q.status === 'replied').length
    };

    return (
        <div className="space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Quotes', value: stats.total, color: 'bg-stone-100' },
                    { label: 'New', value: stats.new, color: 'bg-blue-50' },
                    { label: 'Pending', value: stats.pending, color: 'bg-yellow-50' },
                    { label: 'Replied', value: stats.replied, color: 'bg-green-50' }
                ].map(stat => (
                    <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
                        <div className="text-2xl font-bold text-brand-charcoal">{stat.value}</div>
                        <div className="text-sm text-stone-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchQuotes()}
                        className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:!border-stone-400"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="converted">Converted</option>
                        <option value="archived">Archived</option>
                    </select>
                    <Button variant="outline" onClick={fetchQuotes}>
                        <RefreshCw size={16} className="mr-1" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Quotes List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto text-brand-orange" size={32} />
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="p-12 text-center text-stone-500">
                        <Mail size={48} className="mx-auto mb-4 text-stone-300" />
                        <p>No quote requests found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-stone-100">
                        {quotes.map(quote => {
                            const isExpanded = expandedId === quote.id;
                            const StatusIcon = STATUS_CONFIG[quote.status].icon;

                            return (
                                <div key={quote.id} className={`${quote.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                                    {/* Quote Header */}
                                    <div
                                        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-stone-50 transition-colors"
                                        onClick={() => {
                                            setExpandedId(isExpanded ? null : quote.id);
                                            if (quote.status === 'new') {
                                                updateStatus(quote.id, 'read');
                                            }
                                        }}
                                    >
                                        <div className="text-stone-400">
                                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-brand-charcoal truncate">
                                                    {quote.customer_name}
                                                </span>
                                                {quote.status === 'new' && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                )}
                                            </div>
                                            <div className="text-sm text-stone-500 truncate">
                                                {quote.customer_email}
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-lg font-bold text-brand-orange">{quote.products.length}</div>
                                            <div className="text-xs text-stone-400">items</div>
                                        </div>

                                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[quote.status].color}`}>
                                            {STATUS_CONFIG[quote.status].label}
                                        </div>

                                        <div className="text-sm text-stone-400 w-20 text-right">
                                            {formatDate(quote.created_at)}
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 bg-stone-50 border-t border-stone-100">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                                                {/* Customer Info */}
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-brand-charcoal text-sm">Customer Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2 text-stone-600">
                                                            <Mail size={14} className="text-stone-400" />
                                                            <a href={`mailto:${quote.customer_email}`} className="text-brand-orange hover:underline">
                                                                {quote.customer_email}
                                                            </a>
                                                        </div>
                                                        {quote.customer_phone && (
                                                            <div className="flex items-center gap-2 text-stone-600">
                                                                <Phone size={14} className="text-stone-400" />
                                                                {quote.customer_phone}
                                                            </div>
                                                        )}
                                                        {quote.customer_country && (
                                                            <div className="flex items-center gap-2 text-stone-600">
                                                                <MapPin size={14} className="text-stone-400" />
                                                                {quote.customer_country}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-stone-500">
                                                            <Clock size={14} className="text-stone-400" />
                                                            {new Date(quote.created_at).toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {quote.message && (
                                                        <div className="mt-4">
                                                            <h5 className="text-xs font-medium text-stone-500 mb-1">Message</h5>
                                                            <p className="text-sm text-stone-600 bg-white p-3 rounded border border-stone-200">
                                                                {quote.message}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Products */}
                                                <div className="lg:col-span-2">
                                                    <h4 className="font-medium text-brand-charcoal text-sm mb-3">Requested Products</h4>
                                                    <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
                                                        {quote.products.map((product, idx) => (
                                                            <div key={idx} className="p-3 flex items-center gap-3">
                                                                <div className="w-12 h-12 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                                                                    {product.image_url ? (
                                                                        <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                                            <Package size={20} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs text-brand-orange font-mono">{product.sku}</div>
                                                                    <div className="text-sm text-brand-charcoal truncate">{product.name}</div>
                                                                </div>
                                                                <div className="text-sm font-medium text-stone-600">
                                                                    Qty: {product.quantity}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200">
                                                <a
                                                    href={`mailto:${quote.customer_email}?subject=Quote Request - Smith Instruments`}
                                                    className="px-3 py-1.5 bg-brand-orange text-white text-sm rounded-lg hover:bg-brand-orange/90 transition-colors flex items-center gap-1"
                                                >
                                                    <Mail size={14} /> Reply via Email
                                                </a>
                                                {quote.status !== 'replied' && (
                                                    <button
                                                        onClick={() => updateStatus(quote.id, 'replied')}
                                                        disabled={updatingId === quote.id}
                                                        className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                                                    >
                                                        <CheckCircle size={14} /> Mark as Replied
                                                    </button>
                                                )}
                                                {quote.status !== 'converted' && (
                                                    <button
                                                        onClick={() => updateStatus(quote.id, 'converted')}
                                                        disabled={updatingId === quote.id}
                                                        className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1"
                                                    >
                                                        <Package size={14} /> Mark Converted
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => updateStatus(quote.id, 'archived')}
                                                    disabled={updatingId === quote.id}
                                                    className="px-3 py-1.5 bg-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-300 transition-colors flex items-center gap-1"
                                                >
                                                    <Archive size={14} /> Archive
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
