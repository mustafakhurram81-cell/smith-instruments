import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, FolderOpen, Settings, BarChart3, GitBranch, BookOpen, Inbox, Users, History, LucideIcon } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface DashboardHeaderProps {
    userEmail?: string;
    userRole?: 'admin' | 'manager' | null;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'variants', label: 'Variants', icon: GitBranch },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'catalogues', label: 'Catalogues', icon: BookOpen },
    { id: 'quotes', label: 'Quotes', icon: Inbox },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    userEmail,
    userRole,
    activeTab,
    onTabChange,
    onLogout
}) => {
    return (
        <>
            {/* Header */}
            <div className="bg-brand-charcoal text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-heading">Smith Instruments Admin</h1>
                    <div className="flex items-center gap-4">
                        {userEmail && <span className="text-xs text-stone-400">{userEmail}</span>}
                        {userRole && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${userRole === 'admin'
                                ? 'bg-brand-orange text-brand-charcoal'
                                : 'bg-stone-600 text-stone-300'
                                }`}>
                                {userRole === 'admin' ? 'Admin' : 'Manager'}
                            </span>
                        )}
                        <Link to="/" className="text-sm text-stone-400 hover:text-white">← Back to Site</Link>
                        <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <div className="flex gap-2 mb-6 border-b border-stone-300 overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-brand-orange text-brand-charcoal' : 'border-transparent text-stone-500 hover:text-brand-charcoal'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};
