import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, BookOpen } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CatalogueThumbnailProps {
    url: string;
    title: string;
    thumbnailUrl?: string | null; // Pre-generated thumbnail
}

export const CatalogueThumbnail: React.FC<CatalogueThumbnailProps> = ({ url, title, thumbnailUrl }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Lazy load - only load when visible in viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Start loading 200px before visible
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // If we have a pre-generated thumbnail, use it (much faster!)
    if (thumbnailUrl) {
        return (
            <div ref={containerRef} className="w-full h-full relative bg-stone-100 overflow-hidden">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onLoad={() => setLoading(false)}
                    onError={() => setError(true)}
                />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                        <Loader2 className="animate-spin text-stone-300" size={24} />
                    </div>
                )}
            </div>
        );
    }

    // Fallback: Load PDF first page (only when visible)
    if (error || !isVisible) {
        return (
            <div ref={containerRef} className="w-full h-full bg-stone-200 flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                {!isVisible ? (
                    <Loader2 className="animate-spin text-stone-300" size={24} />
                ) : (
                    <>
                        <BookOpen size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] uppercase tracking-widest">Preview Unavailable</span>
                    </>
                )}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full relative bg-stone-100 overflow-hidden flex items-center justify-center">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Loader2 className="animate-spin text-stone-300" size={24} />
                </div>
            )}
            <Document
                file={url}
                className="w-full h-full flex items-center justify-center"
                loading={null}
                onLoadError={() => setError(true)}
            >
                <Page
                    pageNumber={1}
                    height={340}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onLoadSuccess={() => setLoading(false)}
                    className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                />
            </Document>
        </div>
    );
};
