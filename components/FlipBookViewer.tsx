import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { Download, X, ChevronRight, ChevronLeft, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import { motion } from 'framer-motion';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipBookViewerProps {
    catalogue: any;
    onClose: () => void;
}

export const FlipBookViewer: React.FC<FlipBookViewerProps> = ({ catalogue, onClose }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [loadedPages, setLoadedPages] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [showControls, setShowControls] = useState(true);

    const book = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const controlsTimer = useRef<NodeJS.Timeout | null>(null);

    // Touch handling
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);

    // Calculate dimensions based on zoom
    const baseWidth = Math.min(500, window.innerWidth * 0.4);
    const baseHeight = baseWidth * 1.4;
    const bookWidth = baseWidth * zoom;
    const bookHeight = baseHeight * zoom;

    // Preload sound
    useEffect(() => {
        const audio = new Audio('/page-flip.mp3');
        audio.volume = 0.3;
        audio.preload = 'auto';
        audioRef.current = audio;
    }, []);

    const playSound = useCallback(() => {
        if (audioRef.current) {
            const sound = audioRef.current.cloneNode() as HTMLAudioElement;
            sound.volume = 0.3;
            sound.play().catch(() => { });
        }
    }, []);

    // Auto-hide controls
    const resetControlsTimer = useCallback(() => {
        setShowControls(true);
        if (controlsTimer.current) clearTimeout(controlsTimer.current);
        controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', resetControlsTimer);
        window.addEventListener('touchstart', resetControlsTimer);
        resetControlsTimer();
        return () => {
            window.removeEventListener('mousemove', resetControlsTimer);
            window.removeEventListener('touchstart', resetControlsTimer);
            if (controlsTimer.current) clearTimeout(controlsTimer.current);
        };
    }, [resetControlsTimer]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') { book.current?.pageFlip()?.flipNext(); playSound(); }
            if (e.key === 'ArrowLeft') { book.current?.pageFlip()?.flipPrev(); playSound(); }
            if (e.key === 'Escape') onClose();
            if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 0.2, 2));
            if (e.key === '-') setZoom(z => Math.max(z - 0.2, 0.6));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, playSound]);

    // Touch swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

        // Only trigger if horizontal swipe is stronger than vertical
        if (Math.abs(deltaX) > 50 && deltaY < 100) {
            if (deltaX > 0) {
                book.current?.pageFlip()?.flipPrev();
            } else {
                book.current?.pageFlip()?.flipNext();
            }
            playSound();
        }
    };

    // Fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
        setTimeout(() => setLoading(false), 500);
    };

    const onPageLoadSuccess = () => {
        setLoadedPages(prev => prev + 1);
    };

    const loadProgress = numPages > 0 ? Math.round((loadedPages / numPages) * 100) : 0;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[60] bg-stone-900 flex items-center justify-center select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Loading Overlay */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-stone-900 flex flex-col items-center justify-center"
                >
                    <div className="w-48 h-1 bg-stone-700 rounded-full overflow-hidden mb-4">
                        <motion.div
                            className="h-full bg-brand-gold"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-stone-400 text-sm">{loadProgress}% loaded</p>
                </motion.div>
            )}

            {/* PDF Styles */}
            <style>{`
                .react-pdf__Page { display: flex !important; align-items: center !important; justify-content: center !important; width: 100% !important; height: 100% !important; background: white !important; }
                .react-pdf__Page__canvas { max-width: 100% !important; max-height: 100% !important; width: auto !important; height: auto !important; object-fit: contain !important; }
            `}</style>

            {/* Top Controls */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
                className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"
            >
                <div className="pointer-events-auto" />
                <div className="flex items-center gap-2 pointer-events-auto">
                    {/* Zoom Controls */}
                    <button
                        onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-white/50 text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button
                        onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <ZoomIn size={20} />
                    </button>

                    <div className="w-px h-6 bg-white/20 mx-2" />

                    {/* Fullscreen */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>

                    {/* Download */}
                    <a
                        href={catalogue.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <Download size={20} />
                    </a>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all ml-2"
                    >
                        <X size={24} />
                    </button>
                </div>
            </motion.div>

            {/* Book Container */}
            <div className="flex items-center justify-center w-full h-full p-8">
                <Document
                    file={catalogue.pdf_url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(err) => { console.error(err); setError("Failed to load PDF"); setLoading(false); }}
                    loading={null}
                >
                    {!loading && !error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* @ts-ignore */}
                            <HTMLFlipBook
                                width={bookWidth}
                                height={bookHeight}
                                size="fixed"
                                minWidth={200}
                                maxWidth={2000}
                                minHeight={300}
                                maxHeight={2500}
                                maxShadowOpacity={0.4}
                                showCover={true}
                                mobileScrollSupport={false}
                                usePortrait={false}
                                autoSize={false}
                                onFlip={(e: any) => setCurrentPage(e.data)}
                                ref={book}
                                className="shadow-2xl"
                            >
                                {Array.from({ length: numPages }, (_, i) => (
                                    <div key={i} className="bg-white overflow-hidden">
                                        <Page
                                            pageNumber={i + 1}
                                            width={bookWidth}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            onLoadSuccess={onPageLoadSuccess}
                                            loading={
                                                <div className="w-full h-full bg-stone-100 animate-pulse" />
                                            }
                                        />
                                        {/* Page shadow effect */}
                                        <div className={`absolute top-0 bottom-0 w-8 pointer-events-none ${i % 2 === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent`} />
                                    </div>
                                ))}
                            </HTMLFlipBook>
                        </motion.div>
                    )}
                </Document>

                {error && (
                    <div className="text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button onClick={onClose} className="text-white underline">Close</button>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
                className="absolute bottom-0 left-0 right-0 p-6 flex justify-center z-40 pointer-events-none"
            >
                <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full pointer-events-auto">
                    <button
                        onClick={() => { book.current?.pageFlip()?.flipPrev(); playSound(); }}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <span className="text-white/70 text-sm font-medium min-w-[80px] text-center">
                        {currentPage + 1} / {numPages}
                    </span>

                    <button
                        onClick={() => { book.current?.pageFlip()?.flipNext(); playSound(); }}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
