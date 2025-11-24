import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, BookOpen } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CatalogueThumbnailProps {
    url: string;
    color: string;
    title: string;
}

export const CatalogueThumbnail: React.FC<CatalogueThumbnailProps> = ({ url, color, title }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className="w-full h-full bg-stone-200 flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                <BookOpen size={32} className="mb-2 opacity-50" />
                <span className="text-[10px] uppercase tracking-widest">Preview Unavailable</span>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative bg-stone-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <Loader2 className="animate-spin text-stone-300" size={24} />
            </div>
            <Document
                file={url}
                className="w-full h-full"
                loading={null}
                onLoadError={() => setError(true)}
            >
                <Page
                    pageNumber={1}
                    width={260}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onLoadSuccess={() => setLoading(false)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                />
            </Document>
            {/* Overlay for Title if needed, or just rely on the PDF cover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                    <p className="font-serif text-lg">{title}</p>
                    <p className="text-xs uppercase tracking-widest opacity-80">View Catalogue</p>
                </div>
            </div>
        </div>
    );
};
