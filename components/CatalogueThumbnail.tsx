import React, { useState } from 'react';
import { Loader2, BookOpen } from 'lucide-react';

interface CatalogueThumbnailProps {
    url: string;
    title: string;
    thumbnailUrl?: string | null; // Pre-generated thumbnail
}

/**
 * Renders a catalogue cover image.
 *
 * Fast path: uses a pre-generated WebP thumbnail served from CDN.
 * Fallback:  shows a placeholder icon (no client-side PDF rendering).
 *
 * The old approach downloaded + rendered the full PDF in-browser via pdf.js
 * which loaded ~500 KB of JS + the entire multi-MB PDF file for every card.
 * Now all thumbnails are pre-generated WebP images (~20-60 KB each).
 */
export const CatalogueThumbnail: React.FC<CatalogueThumbnailProps> = ({ url, title, thumbnailUrl }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // ── Fast path: pre-generated thumbnail image ──
    if (thumbnailUrl && !error) {
        return (
            <div className="w-full h-full relative bg-stone-100 overflow-hidden">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    width={240}
                    height={340}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
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

    // ── Fallback: static placeholder (no PDF rendering) ──
    return (
        <div className="w-full h-full bg-stone-200 flex flex-col items-center justify-center text-stone-400 p-4 text-center">
            <BookOpen size={32} className="mb-2 opacity-50" />
            <span className="text-[10px] uppercase tracking-widest">{title}</span>
        </div>
    );
};
