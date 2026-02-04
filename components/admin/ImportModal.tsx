import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../Shared';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface PreviewRow {
    sku: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    image_url: string;
    isNew: boolean;
    hasError: boolean;
    errorMsg?: string;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<PreviewRow[]>([]);
    const [importing, setImporting] = useState(false);
    const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'done'>('upload');
    const [results, setResults] = useState({ inserted: 0, updated: 0, errors: 0 });

    const parseCSV = (text: string): string[][] => {
        const lines: string[][] = [];
        let current = '';
        let inQuotes = false;
        let row: string[] = [];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
                row.push(current.trim());
                if (row.some(cell => cell)) lines.push(row);
                row = [];
                current = '';
                if (char === '\r') i++;
            } else {
                current += char;
            }
        }
        if (current || row.length) {
            row.push(current.trim());
            if (row.some(cell => cell)) lines.push(row);
        }
        return lines;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        const text = await selectedFile.text();
        const rows = parseCSV(text);

        if (rows.length < 2) {
            alert('CSV file must have at least a header row and one data row');
            return;
        }

        const headers = rows[0].map(h => h.toLowerCase().trim());
        const skuIdx = headers.findIndex(h => h === 'sku');
        const nameIdx = headers.findIndex(h => h === 'name');
        const descIdx = headers.findIndex(h => h === 'description' || h === 'desc');
        const catIdx = headers.findIndex(h => h === 'category');
        const subIdx = headers.findIndex(h => h === 'subcategory');
        const imgIdx = headers.findIndex(h => h === 'image_url' || h === 'image' || h === 'imageurl');

        if (skuIdx === -1 || nameIdx === -1) {
            alert('CSV must have at least SKU and Name columns');
            return;
        }

        // Fetch existing SKUs
        const { data: existingProducts } = await supabase
            .from('products')
            .select('sku');
        const existingSKUs = new Set(existingProducts?.map(p => p.sku) || []);

        const previewData: PreviewRow[] = [];
        for (let i = 1; i < rows.length && i <= 100; i++) {
            const row = rows[i];
            const sku = row[skuIdx] || '';
            const name = row[nameIdx] || '';

            if (!sku) continue;

            const hasError = !name;
            previewData.push({
                sku,
                name,
                description: descIdx >= 0 ? row[descIdx] || '' : '',
                category: catIdx >= 0 ? row[catIdx] || 'Uncategorized' : 'Uncategorized',
                subcategory: subIdx >= 0 ? row[subIdx] || 'General' : 'General',
                image_url: imgIdx >= 0 ? row[imgIdx] || '' : '',
                isNew: !existingSKUs.has(sku),
                hasError,
                errorMsg: hasError ? 'Missing name' : undefined
            });
        }

        setPreview(previewData);
        setStep('preview');
    };

    const handleImport = async () => {
        setImporting(true);
        setStep('importing');

        let inserted = 0;
        let updated = 0;
        let errors = 0;

        for (const row of preview) {
            if (row.hasError) {
                errors++;
                continue;
            }

            try {
                if (row.isNew) {
                    const { error } = await supabase.from('products').insert({
                        sku: row.sku,
                        name: row.name,
                        description: row.description || null,
                        category: row.category,
                        subcategory: row.subcategory,
                        image_url: row.image_url || null
                    });
                    if (error) throw error;
                    inserted++;
                } else {
                    const { error } = await supabase.from('products')
                        .update({
                            name: row.name,
                            description: row.description || null,
                            category: row.category,
                            subcategory: row.subcategory,
                            image_url: row.image_url || null
                        })
                        .eq('sku', row.sku);
                    if (error) throw error;
                    updated++;
                }
            } catch (err) {
                console.error('Import error for SKU:', row.sku, err);
                errors++;
            }
        }

        setResults({ inserted, updated, errors });
        setStep('done');
        setImporting(false);
    };

    const handleClose = () => {
        setFile(null);
        setPreview([]);
        setStep('upload');
        setResults({ inserted: 0, updated: 0, errors: 0 });
        if (step === 'done') {
            onSuccess();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-medium text-brand-charcoal">Import Products from CSV</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-stone-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {step === 'upload' && (
                        <div className="text-center py-12">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".csv"
                                className="hidden"
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-stone-300 rounded-xl p-12 cursor-pointer hover:border-brand-orange hover:bg-stone-50 transition-colors"
                            >
                                <Upload size={48} className="mx-auto mb-4 text-stone-400" />
                                <p className="text-lg font-medium text-brand-charcoal mb-2">
                                    Click to upload CSV file
                                </p>
                                <p className="text-sm text-stone-500">
                                    Required columns: SKU, Name<br />
                                    Optional: Description, Category, Subcategory, Image URL
                                </p>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
                                <h3 className="font-medium text-blue-800 mb-2">CSV Format Example</h3>
                                <code className="text-xs text-blue-600 block bg-white p-3 rounded border border-blue-200">
                                    SKU,Name,Description,Category,Subcategory,Image URL<br />
                                    ABC-001,"Scissors 5 inch","Stainless steel",General Surgery,Scissors,https://...<br />
                                    ABC-002,"Forceps 6 inch","German steel",General Surgery,Forceps,
                                </code>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <FileText size={20} className="text-brand-orange" />
                                    <span className="font-medium">{file?.name}</span>
                                    <span className="text-sm text-stone-500">
                                        {preview.length} products to import
                                    </span>
                                </div>
                                <div className="flex gap-2 text-sm">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                        {preview.filter(p => p.isNew).length} new
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                        {preview.filter(p => !p.isNew).length} updates
                                    </span>
                                    {preview.some(p => p.hasError) && (
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                                            {preview.filter(p => p.hasError).length} errors
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-stone-50">
                                        <tr>
                                            <th className="p-2 text-left">Status</th>
                                            <th className="p-2 text-left">SKU</th>
                                            <th className="p-2 text-left">Name</th>
                                            <th className="p-2 text-left">Category</th>
                                            <th className="p-2 text-left">Subcategory</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {preview.slice(0, 50).map((row, idx) => (
                                            <tr key={idx} className={row.hasError ? 'bg-red-50' : ''}>
                                                <td className="p-2">
                                                    {row.hasError ? (
                                                        <span className="text-red-500 flex items-center gap-1">
                                                            <AlertTriangle size={14} />
                                                            {row.errorMsg}
                                                        </span>
                                                    ) : row.isNew ? (
                                                        <span className="text-green-600">New</span>
                                                    ) : (
                                                        <span className="text-blue-600">Update</span>
                                                    )}
                                                </td>
                                                <td className="p-2 font-mono text-xs">{row.sku}</td>
                                                <td className="p-2 truncate max-w-[200px]">{row.name}</td>
                                                <td className="p-2 text-stone-500">{row.category}</td>
                                                <td className="p-2 text-stone-500">{row.subcategory}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {preview.length > 50 && (
                                    <div className="p-2 text-center text-sm text-stone-500 bg-stone-50">
                                        + {preview.length - 50} more rows
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'importing' && (
                        <div className="text-center py-12">
                            <Loader2 size={48} className="mx-auto mb-4 animate-spin text-brand-orange" />
                            <p className="text-lg font-medium text-brand-charcoal">Importing products...</p>
                            <p className="text-sm text-stone-500">Please wait, this may take a moment.</p>
                        </div>
                    )}

                    {step === 'done' && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-medium text-brand-charcoal mb-4">Import Complete!</h3>
                            <div className="flex justify-center gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{results.inserted}</div>
                                    <div className="text-sm text-stone-500">New Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{results.updated}</div>
                                    <div className="text-sm text-stone-500">Updated</div>
                                </div>
                                {results.errors > 0 && (
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">{results.errors}</div>
                                        <div className="text-sm text-stone-500">Errors</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t bg-stone-50">
                    {step === 'upload' && (
                        <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    )}
                    {step === 'preview' && (
                        <>
                            <Button variant="outline" onClick={() => { setStep('upload'); setPreview([]); setFile(null); }}>
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleImport}
                                disabled={preview.every(p => p.hasError)}
                            >
                                <Upload size={16} className="mr-1" />
                                Import {preview.filter(p => !p.hasError).length} Products
                            </Button>
                        </>
                    )}
                    {step === 'done' && (
                        <Button variant="primary" onClick={handleClose}>Done</Button>
                    )}
                </div>
            </div>
        </div>
    );
};
