import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, CloudDownload, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-stone-900 text-stone-100">
            {/* Sidebar */}
            <aside className="w-64 border-r border-stone-800 flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-serif text-brand-gold">Smith Admin</h1>
                    <p className="text-xs text-stone-500 mt-1">v2.0 (Supabase)</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-brand-gold text-brand-charcoal font-medium' : 'text-stone-300 hover:bg-stone-800'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/migrate"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/migrate') ? 'bg-brand-gold text-brand-charcoal font-medium' : 'text-stone-300 hover:bg-stone-800'
                            }`}
                    >
                        <CloudDownload size={20} />
                        Migration Tool
                    </Link>
                </nav>

                <div className="p-4 border-t border-stone-800">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-stone-50 text-stone-900">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
