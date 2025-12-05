import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Globe, Database } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ products: 0, images: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
            // For bucket count we can't easily get it without edge function or simpler list, assuming proportional
            setStats({ products: count || 0, images: count || 0 });
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-serif text-brand-charcoal mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500">Total Products</p>
                            <h3 className="text-2xl font-bold text-brand-charcoal">{stats.products}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <Globe size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500">Live Status</p>
                            <h3 className="text-2xl font-bold text-brand-charcoal">Active</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Database size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500">Database</p>
                            <h3 className="text-2xl font-bold text-brand-charcoal">Supabase</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-8 bg-blue-50 border border-blue-100 rounded-xl">
                <h3 className="font-medium text-blue-900 mb-2">Next Step: Migration</h3>
                <p className="text-blue-700 mb-4">You have connected Supabase. Use the Migration tool to import your products from Smith Surgical.</p>
            </div>
        </div>
    );
};
