import React, { useEffect, useState } from 'react';
import { Package, FolderOpen, Layers, GitBranch, AlertTriangle, ImageOff, FileText, RefreshCw, Inbox, TrendingUp, Clock, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

interface QuoteStats {
    total: number;
    thisWeek: number;
    thisMonth: number;
    newCount: number;
    dailyCounts: { date: string; count: number }[];
    recentQuotes: Array<{
        id: string;
        customer_name: string;
        customer_email: string;
        products: any[];
        status: string;
        created_at: string;
    }>;
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
    const [quoteStats, setQuoteStats] = useState<QuoteStats>({
        total: 0,
        thisWeek: 0,
        thisMonth: 0,
        newCount: 0,
        dailyCounts: [],
        recentQuotes: []
    });
    const [loadingQuotes, setLoadingQuotes] = useState(true);

    useEffect(() => {
        fetchQuoteStats();
    }, []);

    const fetchQuoteStats = async () => {
        setLoadingQuotes(true);
        try {
            // Fetch all quotes
            const { data: quotes, error } = await supabase
                .from('quote_requests')
                .select('id, customer_name, customer_email, products, status, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            // Calculate stats
            const thisWeek = quotes?.filter(q => new Date(q.created_at) > weekAgo).length || 0;
            const thisMonth = quotes?.filter(q => new Date(q.created_at) > monthAgo).length || 0;
            const newCount = quotes?.filter(q => q.status === 'new').length || 0;

            // Calculate daily counts for last 7 days
            const dailyCounts: { date: string; count: number }[] = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split('T')[0];
                const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
                const count = quotes?.filter(q => q.created_at.startsWith(dateStr)).length || 0;
                dailyCounts.push({ date: dayLabel, count });
            }

            setQuoteStats({
                total: quotes?.length || 0,
                thisWeek,
                thisMonth,
                newCount,
                dailyCounts,
                recentQuotes: quotes?.slice(0, 5) || []
            });
        } catch (err) {
            console.warn('Could not fetch quote stats:', err);
        }
        setLoadingQuotes(false);
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const maxDailyCount = Math.max(...quoteStats.dailyCounts.map(d => d.count), 1);

    return (
        <div className="space-y-6">
            {/* Product Stats Row 1 */}
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

            {/* Product Stats Row 2 (Issues) */}
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

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quote Requests Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-medium text-brand-charcoal">Quote Requests</h2>
                            <p className="text-xs text-stone-400">Last 7 days</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-brand-orange">{quoteStats.thisWeek}</div>
                                <div className="text-xs text-stone-400">This Week</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-stone-600">{quoteStats.thisMonth}</div>
                                <div className="text-xs text-stone-400">This Month</div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="flex items-end gap-2 h-32 mt-4">
                        {quoteStats.dailyCounts.map((day, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                <div className="text-xs font-medium text-stone-500">{day.count}</div>
                                <div
                                    className="w-full bg-brand-orange/20 rounded-t transition-all hover:bg-brand-orange/40"
                                    style={{
                                        height: `${(day.count / maxDailyCount) * 100}%`,
                                        minHeight: day.count > 0 ? '8px' : '2px',
                                        backgroundColor: day.count > 0 ? undefined : '#e7e5e4'
                                    }}
                                >
                                    <div
                                        className="w-full h-full bg-brand-orange rounded-t"
                                        style={{ opacity: day.count > 0 ? 1 : 0 }}
                                    />
                                </div>
                                <div className="text-xs text-stone-400">{day.date}</div>
                            </div>
                        ))}
                    </div>

                    {quoteStats.newCount > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                            <Inbox size={18} className="text-blue-500" />
                            <span className="text-sm text-blue-700">
                                <strong>{quoteStats.newCount}</strong> new quote{quoteStats.newCount !== 1 ? 's' : ''} awaiting response
                            </span>
                        </div>
                    )}
                </div>

                {/* Recent Quotes */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-medium text-brand-charcoal">Recent Quotes</h2>
                        <a href="#" onClick={() => {/* navigate to quotes tab */ }} className="text-xs text-brand-orange hover:underline">
                            View All →
                        </a>
                    </div>

                    {loadingQuotes ? (
                        <div className="text-center py-8 text-stone-400">Loading...</div>
                    ) : quoteStats.recentQuotes.length === 0 ? (
                        <div className="text-center py-8 text-stone-400">
                            <Mail size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No quote requests yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {quoteStats.recentQuotes.map(quote => (
                                <div
                                    key={quote.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${quote.status === 'new'
                                            ? 'bg-blue-50/50 border-blue-200'
                                            : 'bg-stone-50 border-stone-100'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${quote.status === 'new' ? 'bg-blue-500 animate-pulse' :
                                            quote.status === 'replied' ? 'bg-green-500' :
                                                'bg-stone-300'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-brand-charcoal text-sm truncate">
                                            {quote.customer_name}
                                        </div>
                                        <div className="text-xs text-stone-400 truncate">
                                            {quote.products.length} item{quote.products.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <div className="text-xs text-stone-400 flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatTimeAgo(quote.created_at)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-brand-charcoal">Category Breakdown</h2>
                    <button onClick={onRefresh} className="text-brand-orange text-sm hover:underline flex items-center gap-1">
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 max-h-80 overflow-y-auto">
                    {categoryStats.map(cat => (
                        <div key={cat.name} className="flex items-center gap-3">
                            <div className="w-28 text-sm truncate" title={cat.name}>{cat.name}</div>
                            <div className="flex-1 h-5 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-brand-orange to-brand-orange/70 rounded-full transition-all"
                                    style={{ width: `${Math.max((cat.count / stats.products) * 100, 2)}%` }}
                                />
                            </div>
                            <div className="w-12 text-right text-sm font-medium text-stone-600">{cat.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
