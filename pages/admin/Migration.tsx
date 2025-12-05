import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CloudDownload, Loader2, CheckCircle, AlertTriangle, Play, Database } from 'lucide-react';
import { Button } from '../../components/Shared';

export const Migration: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 50));

    const uploadImage = async (imageUrl: string, sku: string): Promise<string> => {
        try {
            // 1. Fetch the image blob
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            // 2. Upload to Supabase Storage
            const fileName = `${sku}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, blob, { upsert: true });

            if (uploadError) throw uploadError;

            // 3. Get Public URL
            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (e) {
            console.error("Image upload failed", e);
            return imageUrl; // Fallback to original URL if upload fails
        }
    };

    const startMigration = async () => {
        setStatus('running');
        setLogs([]);
        addLog("Starting migration from smithsurgical.uk...");

        try {
            // 1. Check Total Pages
            const initRes = await fetch('https://smithsurgical.uk/wp-json/wp/v2/product?per_page=100');
            const totalPages = parseInt(initRes.headers.get('X-WP-TotalPages') || '0');
            const totalItems = parseInt(initRes.headers.get('X-WP-Total') || '0');

            addLog(`Found ${totalItems} products across ${totalPages} pages.`);
            setProgress({ current: 0, total: totalItems });

            // Limit pages for demo if needed, but intended for full run
            const MAX_PAGES = totalPages;

            for (let page = 1; page <= MAX_PAGES; page++) {
                addLog(`Fetching page ${page}...`);

                const res = await fetch(`https://smithsurgical.uk/wp-json/wp/v2/product?per_page=100&page=${page}&_embed`);
                const data = await res.json();

                for (const item of data) {
                    const sku = item.slug || item.title.rendered;
                    let imageUrl = '';

                    if (item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0]) {
                        imageUrl = item._embedded['wp:featuredmedia'][0].source_url;
                    }

                    // Upload Image to Supabase
                    let storedImageUrl = imageUrl;
                    if (imageUrl) {
                        // addLog(`Uploading image for ${sku}...`);
                        storedImageUrl = await uploadImage(imageUrl, sku);
                    }

                    // Clean Data
                    const cleanName = item.title.rendered.trim();
                    const cleanDesc = item.content.rendered.replace(/<[^>]*>?/gm, '').trim();
                    let category = 'general';
                    let subcategory = 'uncategorized';

                    if (item._embedded && item._embedded['wp:term'] && item._embedded['wp:term'][0]) {
                        const cats = item._embedded['wp:term'][0];
                        if (cats.length > 0) category = cats[0].name.toLowerCase().trim().replace(/&amp;/g, '&').replace(/\s+/g, '-');
                        if (cats.length > 1) subcategory = cats[1].name.toLowerCase().trim().replace(/&amp;/g, '&').replace(/\s+/g, '-');
                    }

                    // Insert into Supabase DB
                    const { error } = await supabase.from('products').upsert({
                        sku,
                        name: cleanName,
                        description: cleanDesc,
                        category,
                        subcategory,
                        image_url: storedImageUrl,
                        specifications: { original_id: item.id }
                    }, { onConflict: 'sku' });

                    if (error) {
                        console.error('DB Insert Error', error);
                        addLog(`Error saving ${sku}: ${error.message}`);
                    }

                    setProgress(prev => ({ ...prev, current: prev.current + 1 }));
                }
            }

            addLog("Migration complete!");
            setStatus('complete');

        } catch (err) {
            console.error(err);
            addLog("Error during migration. Check console.");
            setStatus('error');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-serif text-brand-charcoal">Supabase Migration Tool</h2>
                <p className="text-stone-500 text-sm">Clone products & images from WordPress to Supabase.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-full">
                        <Database size={24} />
                    </div>
                    <div>
                        <h3 className="font-medium text-brand-charcoal">Destination: Supabase</h3>
                        <p className="text-xs text-stone-500">PostgreSQL + Storage Bucket</p>
                    </div>
                </div>

                {status === 'idle' && (
                    <div className="text-center py-8">
                        <Button variant="primary" onClick={startMigration} className="px-8 py-3">
                            <Play size={18} className="mr-2" /> Start Full Migration
                        </Button>
                        <p className="text-xs text-stone-400 mt-4">Make sure you have set up your Supabase Table & Bucket logic first.</p>
                    </div>
                )}

                {status === 'running' && (
                    <div className="space-y-6">
                        <div className="flex justify-between text-sm font-medium text-stone-600">
                            <span>Migrating... (Downloading & Uploading Images)</span>
                            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-brand-gold h-full transition-all duration-500"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Loader2 className="animate-spin text-brand-gold" />
                        </div>
                    </div>
                )}

                {/* Logs Console */}
                <div className="mt-8 bg-stone-900 rounded-lg p-4 font-mono text-xs text-green-400 h-64 overflow-y-auto">
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1">{'>'} {log}</div>
                    ))}
                    {logs.length === 0 && <span className="text-stone-600">Waiting to start...</span>}
                </div>
            </div>
        </div>
    );
};
