import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Play, Database, StopCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/Shared';

export const Migration: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error' | 'paused'>('idle');
    const [progress, setProgress] = useState({ current: 0, total: 0, failed: 0, success: 0 });
    const [logs, setLogs] = useState<string[]>([]);
    const abortController = useRef<AbortController | null>(null);

    const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') => {
        const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : type === 'success' ? '✅' : '→';
        setLogs(prev => [`${prefix} ${msg}`, ...prev].slice(0, 100));
    };

    // Image upload with 10 second timeout
    const uploadImage = async (originalImageUrl: string, sku: string): Promise<string> => {
        try {
            const timeoutController = new AbortController();
            const timeoutId = setTimeout(() => timeoutController.abort(), 10000);

            const imageUrl = `https://images.weserv.nl/?url=${originalImageUrl}`;
            const response = await fetch(imageUrl, { signal: timeoutController.signal });
            clearTimeout(timeoutId);

            if (!response.ok) return '';
            const blob = await response.blob();
            if (blob.size < 1000) return '';

            const cleanSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
            const fileName = `${cleanSku}.jpg`;

            const { error } = await supabase.storage
                .from('product-images')
                .upload(fileName, blob, { upsert: true, contentType: 'image/jpeg' });

            if (error) {
                addLog(`Upload error: ${error.message}`, 'error');
                return '';
            }

            const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
            return data.publicUrl;
        } catch (e: any) {
            if (e.name === 'AbortError') {
                addLog(`Image timeout for ${sku}`, 'warn');
            }
            return '';
        }
    };

    const startMigration = async () => {
        setStatus('running');
        setLogs([]);
        setProgress({ current: 0, total: 3800, failed: 0, success: 0 });
        abortController.current = new AbortController();

        addLog("Starting migration...", 'info');

        const proxyBase = 'https://corsproxy.io/?';
        const wpBase = 'https://smithsurgical.uk/wp-json/wp/v2/product';

        try {
            let page = 1;
            let hasMore = true;

            while (hasMore && page <= 50) {
                if (abortController.current.signal.aborted) {
                    setStatus('paused');
                    return;
                }

                addLog(`Fetching page ${page}...`, 'info');

                // Add delay between pages (2 seconds) to avoid rate limiting
                if (page > 1) {
                    await new Promise(r => setTimeout(r, 2000));
                }

                try {
                    const res = await fetch(
                        `${proxyBase}${encodeURIComponent(`${wpBase}?per_page=100&page=${page}&_embed`)}`,
                        { signal: abortController.current.signal }
                    );

                    if (!res.ok) {
                        if (res.status === 400 || res.status === 404) {
                            hasMore = false;
                            break;
                        }
                        // Wait and retry once
                        await new Promise(r => setTimeout(r, 5000));
                        addLog(`Retrying page ${page}...`, 'warn');
                        continue;
                    }

                    const products = await res.json();

                    if (!Array.isArray(products) || products.length === 0) {
                        hasMore = false;
                        break;
                    }

                    addLog(`Processing ${products.length} products...`, 'info');

                    // Process in batches of 5
                    for (let i = 0; i < products.length; i += 5) {
                        if (abortController.current.signal.aborted) break;

                        const batch = products.slice(i, i + 5);

                        await Promise.all(batch.map(async (item: any) => {
                            try {
                                const rawTitle = item.title?.rendered?.trim() || '';
                                const sku = item.slug || rawTitle;
                                if (!sku) return;

                                // Clean description
                                const cleanDesc = (item.content?.rendered || '')
                                    .replace(/<[^>]*>?/gm, '')
                                    .replace(/&amp;/g, '&')
                                    .trim();

                                // Extract name
                                let cleanName = rawTitle;
                                const isSkuLike = /^[\d-]+$/.test(rawTitle) || (rawTitle.length < 12 && /\d/.test(rawTitle));

                                if (isSkuLike && cleanDesc.length > 5) {
                                    const firstComma = cleanDesc.indexOf(',');
                                    const firstPeriod = cleanDesc.indexOf('.');

                                    if (firstComma !== -1 && (firstComma < firstPeriod || firstPeriod === -1)) {
                                        cleanName = cleanDesc.substring(0, firstComma).trim();
                                    } else if (firstPeriod !== -1) {
                                        cleanName = cleanDesc.substring(0, firstPeriod).trim();
                                    } else {
                                        cleanName = cleanDesc.substring(0, 60);
                                    }
                                }

                                // Upload image
                                let storedImageUrl = '';
                                if (item._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
                                    storedImageUrl = await uploadImage(
                                        item._embedded['wp:featuredmedia'][0].source_url,
                                        sku
                                    );
                                }

                                // Categories
                                let category = 'Uncategorized';
                                let subcategory = 'General';

                                if (item._embedded?.['wp:term']?.[0]) {
                                    const cats = item._embedded['wp:term'][0]
                                        .filter((c: any) => c.slug !== 'uncategorized')
                                        .sort((a: any, b: any) => a.id - b.id);

                                    if (cats.length > 0) {
                                        category = cats[0].name.trim();
                                        if (cats.length > 1) subcategory = cats[1].name.trim();
                                    }
                                }

                                // Save to DB
                                const { error } = await supabase.from('products').upsert({
                                    sku,
                                    name: cleanName,
                                    description: cleanDesc,
                                    category,
                                    subcategory,
                                    image_url: storedImageUrl,
                                    specifications: { original_id: item.id }
                                }, { onConflict: 'sku' });

                                if (error) throw error;

                                setProgress(prev => ({
                                    ...prev,
                                    current: prev.current + 1,
                                    success: prev.success + 1
                                }));

                            } catch (e) {
                                setProgress(prev => ({
                                    ...prev,
                                    current: prev.current + 1,
                                    failed: prev.failed + 1
                                }));
                            }
                        }));
                    }

                    page++;

                } catch (pageErr: any) {
                    if (pageErr.name === 'AbortError') break;
                    addLog(`Page ${page} error: ${pageErr.message}. Waiting 5s...`, 'error');
                    await new Promise(r => setTimeout(r, 5000));
                }
            }

            setProgress(prev => ({ ...prev, total: prev.current }));
            addLog("Migration complete!", 'success');
            setStatus('complete');

        } catch (err: any) {
            addLog(`Error: ${err.message}`, 'error');
            setStatus('error');
        }
    };

    const stopMigration = () => {
        abortController.current?.abort();
        setStatus('paused');
    };

    const resetMigration = () => {
        setStatus('idle');
        setProgress({ current: 0, total: 0, failed: 0, success: 0 });
        setLogs([]);
    };

    const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-serif text-brand-charcoal">Migration Tool</h2>
                <p className="text-stone-500 text-sm">Clone products from WordPress to Supabase.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-full">
                        <Database size={24} />
                    </div>
                    <div>
                        <h3 className="font-medium text-brand-charcoal">Supabase</h3>
                        <p className="text-xs text-stone-500">PostgreSQL + Storage</p>
                    </div>
                </div>

                {status !== 'idle' && (
                    <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                        <div className="bg-stone-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold">{progress.current}</div>
                            <div className="text-xs text-stone-500">Done</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{progress.success}</div>
                            <div className="text-xs text-stone-500">Success</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
                            <div className="text-xs text-stone-500">Failed</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{pct}%</div>
                            <div className="text-xs text-stone-500">Progress</div>
                        </div>
                    </div>
                )}

                {status === 'idle' && (
                    <div className="text-center py-8">
                        <Button variant="primary" onClick={startMigration} className="px-8 py-3">
                            <Play size={18} className="mr-2" /> Start Migration
                        </Button>
                    </div>
                )}

                {status === 'running' && (
                    <div className="space-y-6">
                        <div className="w-full bg-stone-100 rounded-full h-3">
                            <div className="bg-brand-gold h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-center">
                            <Button variant="outline" onClick={stopMigration}>
                                <StopCircle size={16} className="mr-2" /> Stop
                            </Button>
                        </div>
                    </div>
                )}

                {(status === 'complete' || status === 'paused' || status === 'error') && (
                    <div className="text-center py-6">
                        <p className={`text-lg font-medium mb-4 ${status === 'complete' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {status === 'complete' ? '✅ Complete!' : '⏸️ Paused'}
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="primary" onClick={startMigration}>
                                <RefreshCw size={16} className="mr-2" /> Continue
                            </Button>
                            <Button variant="outline" onClick={resetMigration}>Reset</Button>
                        </div>
                    </div>
                )}

                <div className="mt-8 bg-stone-900 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
                    {logs.map((log, i) => (
                        <div key={i} className={`mb-1 ${log.startsWith('❌') ? 'text-red-400' :
                                log.startsWith('⚠️') ? 'text-yellow-400' :
                                    log.startsWith('✅') ? 'text-green-400' :
                                        'text-stone-300'
                            }`}>{log}</div>
                    ))}
                    {logs.length === 0 && <span className="text-stone-600">Ready...</span>}
                </div>
            </div>
        </div>
    );
};
