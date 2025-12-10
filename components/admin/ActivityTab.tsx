import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Loader2, Activity, Package, FolderOpen, Users, FileText, Download,
    Upload, RefreshCw, Clock, Search, Filter
} from 'lucide-react';
import { Button } from '../Shared';

interface LogEntry {
    id: string;
    user_id: string;
    user_email: string;
    action: string;
    entity_type: string;
    entity_id: string;
    entity_name: string;
    details: any;
    created_at: string;
}

const ACTION_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
    product_created: { label: 'Created Product', icon: Package, color: 'text-green-600 bg-green-50' },
    product_updated: { label: 'Updated Product', icon: Package, color: 'text-blue-600 bg-blue-50' },
    product_deleted: { label: 'Deleted Product', icon: Package, color: 'text-red-600 bg-red-50' },
    category_renamed: { label: 'Renamed Category', icon: FolderOpen, color: 'text-purple-600 bg-purple-50' },
    csv_exported: { label: 'Exported CSV', icon: Download, color: 'text-amber-600 bg-amber-50' },
    csv_imported: { label: 'Imported CSV', icon: Upload, color: 'text-indigo-600 bg-indigo-50' },
    role_changed: { label: 'Changed Role', icon: Users, color: 'text-orange-600 bg-orange-50' },
    quote_replied: { label: 'Replied to Quote', icon: FileText, color: 'text-teal-600 bg-teal-50' }
};

export const ActivityTab: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterAction, setFilterAction] = useState('all');

    const fetchLogs = async () => {
        setLoading(true);

        let query = supabase
            .from('activity_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (filterAction !== 'all') {
            query = query.eq('action', filterAction);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching activity log:', error);
        } else {
            setLogs(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, [filterAction]);

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionConfig = (action: string) => {
        return ACTION_CONFIG[action] || {
            label: action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            icon: Activity,
            color: 'text-stone-600 bg-stone-50'
        };
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-gold/10 rounded-lg">
                        <Activity size={20} className="text-brand-gold" />
                    </div>
                    <div>
                        <h2 className="font-medium text-brand-charcoal">Activity Log</h2>
                        <p className="text-xs text-stone-500">Recent admin actions</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterAction}
                        onChange={e => setFilterAction(e.target.value)}
                        className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none"
                    >
                        <option value="all">All Actions</option>
                        <option value="product_created">Product Created</option>
                        <option value="product_updated">Product Updated</option>
                        <option value="product_deleted">Product Deleted</option>
                        <option value="csv_exported">CSV Exported</option>
                        <option value="csv_imported">CSV Imported</option>
                        <option value="role_changed">Role Changed</option>
                    </select>
                    <Button variant="outline" onClick={fetchLogs}>
                        <RefreshCw size={16} className="mr-1" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Activity List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto text-brand-gold" size={32} />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-12 text-center text-stone-500">
                        <Activity size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No activity recorded yet</p>
                        <p className="text-xs mt-2">Actions like product edits and CSV exports will appear here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-stone-100">
                        {logs.map(log => {
                            const config = getActionConfig(log.action);
                            const Icon = config.icon;

                            return (
                                <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-stone-50 transition-colors">
                                    <div className={`p-2 rounded-lg ${config.color}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-brand-charcoal">
                                                {config.label}
                                            </span>
                                            {log.entity_name && (
                                                <span className="text-stone-500">
                                                    - {log.entity_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-stone-400 flex items-center gap-3">
                                            <span>{log.user_email || 'Unknown user'}</span>
                                            {log.entity_id && (
                                                <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded">
                                                    {log.entity_id}
                                                </span>
                                            )}
                                        </div>
                                        {log.details && Object.keys(log.details).length > 0 && (
                                            <div className="mt-2 text-xs text-stone-500 bg-stone-50 p-2 rounded">
                                                {JSON.stringify(log.details, null, 2).slice(0, 200)}
                                                {JSON.stringify(log.details).length > 200 && '...'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-stone-400 flex items-center gap-1 whitespace-nowrap">
                                        <Clock size={12} />
                                        {formatTime(log.created_at)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm text-stone-500">
                <p>
                    <strong>Note:</strong> Activity logging tracks major admin actions.
                    Run the <code className="bg-white px-1.5 py-0.5 rounded border">activity_log.sql</code> migration
                    in Supabase to enable this feature.
                </p>
            </div>
        </div>
    );
};
