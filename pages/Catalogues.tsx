import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Section, Button, FadeIn } from '../components/Shared';
import { Download, Eye, X, ChevronRight, ChevronLeft, BookOpen, Layers, Keyboard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CATALOGUES = [
  {
    title: "General Surgery",
    size: "12MB",
    color: "#262626",
    desc: "Comprehensive guide for general procedures.",
    pdfUrl: "/catalogues/general-surgery.pdf"
  },
  {
    title: "Plastic & Aesthetic",
    size: "8MB",
    color: "#C5B495",
    desc: "Instruments for reconstruction and cosmetics.",
    pdfUrl: "/catalogues/plastic-surgery.pdf"
  },
  {
    title: "Cardiovascular",
    size: "15MB",
    color: "#262626",
    desc: "High precision tools for heart surgery.",
    pdfUrl: "/catalogues/cardiovascular.pdf"
  },
  {
    title: "Neuro & Spine",
    size: "10MB",
    color: "#C5B495",
    desc: "Microsurgical solutions for nervous systems.",
    pdfUrl: "/catalogues/neuro-spine.pdf"
  },
  {
    title: "ENT & Diagnostics",
    size: "9MB",
    color: "#262626",
    desc: "Tools for ear, nose, and throat specialists.",
    pdfUrl: "/catalogues/ent-diagnostics.pdf"
  },
  {
    title: "Dental Instruments",
    size: "11MB",
    color: "#C5B495",
    desc: "Complete range for dental professionals.",
    pdfUrl: "/catalogues/dental.pdf"
  },
];

// --- THUMBNAIL COMPONENT ---
const CatalogueThumbnail: React.FC<{ url: string; color: string; title: string }> = ({ url, color, title }) => {
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

// --- 3D FLIPBOOK COMPONENT ---
// --- 3D FLIPBOOK COMPONENT ---
// --- 3D FLIPBOOK COMPONENT ---
// --- 3D FLIPBOOK COMPONENT ---
// --- 3D FLIPBOOK COMPONENT ---
const FlipBookViewer: React.FC<{ catalogue: any; onClose: () => void }> = ({ catalogue, onClose }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookDimensions, setBookDimensions] = useState({ width: 450, height: 600 }); // Default init
  const [maxDimensions, setMaxDimensions] = useState({ width: 600, height: 800 }); // Responsive constraints
  const book = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Sound Effect - Optimized for low latency
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audio
    const audio = new Audio('/page-flip.mp3');
    audio.volume = 0.4;
    audio.preload = 'auto';
    audioRef.current = audio;
  }, []);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      // Clone node to allow overlapping sounds for rapid flipping
      const sound = audioRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 0.4;
      sound.play().catch(() => { });
    }
  }, []);

  // Handle Window Resize for Responsiveness
  useEffect(() => {
    const updateDimensions = () => {
      // Calculate available space with safe margins
      const marginX = 40;
      const marginY = 100; // Header/Footer space

      const maxWidth = window.innerWidth - marginX;
      const maxHeight = window.innerHeight - marginY;

      // We need to fit a 2-page spread (width * 2) into maxWidth
      // So single page width limit is maxWidth / 2
      const maxPageWidth = maxWidth / 2;

      // Current aspect ratio of the book (default A4-ish)
      const currentRatio = bookDimensions.width / bookDimensions.height;

      // Calculate dimensions that fit within BOTH width and height constraints
      let finalHeight = maxHeight;
      let finalWidth = finalHeight * currentRatio;

      // If width is still too big, scale down by width
      if (finalWidth > maxPageWidth) {
        finalWidth = maxPageWidth;
        finalHeight = finalWidth / currentRatio;
      }

      setBookDimensions({ width: finalWidth, height: finalHeight });
    };

    window.addEventListener('resize', updateDimensions);
    // Call once on mount (and when bookDimensions changes to refine it)
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, [bookDimensions.width, bookDimensions.height]); // Re-run if base ratio changes

  function onDocumentLoadSuccess(pdf: any) {
    console.log("PDF Loaded Successfully:", pdf.numPages);
    setNumPages(pdf.numPages);

    // Calculate aspect ratio from the first page
    pdf.getPage(1).then((page: any) => {
      const viewport = page.getViewport({ scale: 1 });
      const ratio = viewport.width / viewport.height;

      // Set initial base dimensions
      const isMobile = window.innerWidth < 768;
      const targetHeight = isMobile ? 800 : 1000;

      setBookDimensions({ width: targetHeight * ratio, height: targetHeight });

      // SAFETY FALLBACK: Force loading to false after a short delay
      // This ensures that even if onRenderSuccess fails to fire, the book will show.
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }).catch(err => {
      console.error("Error getting page 1:", err);
      setLoading(false); // Ensure we don't get stuck
    });
  }

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
    // Sound is now triggered by interaction events for zero latency
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        book.current?.pageFlip()?.flipNext();
        playSound();
      }
      if (e.key === 'ArrowLeft') {
        book.current?.pageFlip()?.flipPrev();
        playSound();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, playSound]);

  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 3000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer(); // Start timer on mount
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-brand-charcoal/95 backdrop-blur-xl overflow-hidden select-none"
    >
      {/* Backdrop Click Layer - Handles closing when clicking outside */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-label="Close Viewer" />

      {/* CSS Overrides for Strict Scaling */}
      <style>{`
        .react-pdf__Page {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
          background-color: transparent !important;
        }
        .react-pdf__Page__canvas {
          margin: 0 auto !important;
          display: block !important;
          max-width: 100% !important;
          max-height: 100% !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
        }
        .react-pdf__Document {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      `}</style>

      {/* Viewer Header - Auto Hides */}
      <div className={`absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center text-white z-50 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 ${isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-3 pointer-events-auto">
          <BookOpen className="text-brand-gold" />
          <div>
            <h3 className="font-serif text-lg leading-none">{catalogue.title}</h3>
            <p className="text-xs text-stone-400 mt-1">Interactive 3D Preview</p>
          </div>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 mr-4 border border-stone-700 px-3 py-1 rounded-full">
            <Keyboard size={12} /> Arrow Keys
          </div>
          <Button variant="primary" className="py-2 px-6 text-xs" onClick={(e) => { e.stopPropagation(); window.open(catalogue.pdfUrl, '_blank'); }}>
            <Download size={14} className="mr-2" /> Download PDF
          </Button>
          <button onClick={onClose} className="hover:text-brand-gold transition-colors p-2">
            <X size={32} />
          </button>
        </div>
      </div>

      {/* 3D SCENE CONTAINER */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-10 overflow-hidden pointer-events-none">
        {/* Hidden Document Loader to get page count and dimensions */}
        <div className="hidden">
          <Document
            file={catalogue.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => {
              console.error("PDF Load Error:", err);
              setLoading(false);
              setError("Failed to load PDF. Please check if the file exists.");
            }}
          >
          </Document>
        </div>

        {loading ? (
          <div className="text-white flex flex-col items-center gap-4 animate-in fade-in duration-500">
            <Loader2 className="animate-spin text-brand-gold" size={48} />
            <p className="text-stone-300 tracking-widest uppercase text-sm">Loading Catalogue...</p>
          </div>
        ) : error ? (
          <div className="text-white flex flex-col items-center gap-4 animate-in fade-in duration-500 pointer-events-auto">
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
              <p className="text-red-200 font-medium mb-2">Error Loading Catalogue</p>
              <p className="text-sm text-red-300/80">{error}</p>
            </div>
            <Button variant="secondary" className="mt-4" onClick={onClose}>Close Viewer</Button>
          </div>
        ) : (
          <div
            className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-500 pointer-events-auto"
          >
            {/* @ts-ignore - React PageFlip types are sometimes loose */}
            <HTMLFlipBook
              width={bookDimensions.width}
              height={bookDimensions.height}
              size="fixed" // Use fixed size calculated by JS
              minWidth={200}
              maxWidth={2000}
              minHeight={300}
              maxHeight={2500}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              usePortrait={false}
              startZIndex={0}
              autoSize={false} // Disable autoSize to respect our strict dimensions
              onFlip={onFlip}
              ref={book}
              className="flip-book shadow-2xl"
              style={{ margin: '0 auto' }}
            >
              {/* Generate Pages */}
              {Array.from(new Array(numPages), (el, index) => (
                <div key={index} className={`bg-white overflow-hidden shadow-inner border-r border-stone-100 flex items-center justify-center ${index === 0 ? 'border-l-4 border-stone-300' : ''}`}>
                  <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden relative">
                    <Document
                      file={catalogue.pdfUrl}
                      loading={<div className="w-full h-full bg-stone-50 animate-pulse" />}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Page
                        pageNumber={index + 1}
                        width={bookDimensions.width}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-sm flex items-center justify-center"
                        loading={
                          <div className="w-full h-full flex items-center justify-center bg-stone-50">
                            <Loader2 className="animate-spin text-stone-200" size={32} />
                          </div>
                        }
                      />
                    </Document>

                    {/* Enhanced Spine/Shadow Effects */}
                    {index === 0 ? (
                      // HARD COVER EFFECT
                      <>
                        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 pointer-events-none z-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30 mix-blend-multiply"></div>
                      </>
                    ) : (
                      // Standard Page Spine Shadow
                      <div className={`absolute top-0 bottom-0 w-8 pointer-events-none z-20 ${index % 2 === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent`}></div>
                    )}
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        )}
      </div>

      {/* Navigation Controls - Auto Hides */}
      {!loading && (
        <div className={`absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 text-white z-50 transition-opacity duration-500 ${isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center gap-6 bg-brand-charcoal/90 backdrop-blur-md px-8 py-3 rounded-full pointer-events-auto border border-stone-600 shadow-2xl transition-transform hover:scale-105">
            <button
              onClick={(e) => {
                e.stopPropagation();
                book.current?.pageFlip()?.flipPrev();
                playSound();
              }}
              className="p-2 rounded-full hover:bg-brand-gold hover:text-brand-charcoal transition-all"
              aria-label="Previous Page"
            >
              <ChevronLeft size={24} />
            </button>

            <span className="text-sm font-medium tracking-widest text-stone-200 select-none min-w-[100px] text-center font-serif">
              {currentPage + 1} <span className="text-stone-500 mx-1">/</span> {numPages}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                book.current?.pageFlip()?.flipNext();
                playSound();
              }}
              className="p-2 rounded-full hover:bg-brand-gold hover:text-brand-charcoal transition-all"
              aria-label="Next Page"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Catalogues: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCatalogue, setSelectedCatalogue] = useState<any | null>(null);

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-stone-50 py-24 text-center relative overflow-hidden border-b border-stone-200">
        <h1 className="font-serif text-5xl md:text-6xl text-brand-charcoal relative z-10 mb-4">Our Catalogues</h1>
        <p className="text-stone-500 font-light max-w-xl mx-auto relative z-10">Digital libraries of our comprehensive instrument ranges.</p>
      </div>

      {/* Grid of 3D Books */}
      <Section className="bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {CATALOGUES.map((cat, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group cursor-pointer relative" onClick={() => setSelectedCatalogue(cat)}>
                  {/* Book Container */}
                  <div className="relative w-[260px] h-[360px] mx-auto transition-transform duration-500 ease-out group-hover:-translate-y-2">

                    {/* Front Cover */}
                    <div className="absolute inset-0 bg-white rounded-r-md shadow-xl overflow-hidden flex flex-col border-l-4 border-stone-700">
                      <div className="h-full relative">
                        <CatalogueThumbnail url={cat.pdfUrl} color={cat.color} title={cat.title} />

                        {/* Spine Shadow */}
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-10"></div>
                      </div>

                      {/* Info Overlay on Hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-stone-100 z-20">
                        <h3 className="font-serif text-lg text-brand-charcoal leading-tight mb-1">{cat.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-stone-500 font-medium">{cat.size} PDF</span>
                          <Eye size={16} className="text-brand-gold" />
                        </div>
                      </div>
                    </div>

                    {/* Book Spine Effect (Left side) */}
                    <div className="absolute left-[-12px] top-1 bottom-1 w-3 bg-stone-800 rounded-l-sm shadow-lg"></div>

                    {/* Pages Effect (Right side) */}
                    <div className="absolute right-0 top-2 bottom-2 w-3 bg-white border-r border-stone-200 shadow-sm translate-x-[2px] z-[-1]"></div>
                    <div className="absolute right-0 top-2 bottom-2 w-3 bg-stone-100 border-r border-stone-200 shadow-sm translate-x-[4px] z-[-2]"></div>

                    {/* Shadow under book */}
                    <div className="absolute -bottom-6 left-4 right-4 h-4 bg-black/20 blur-lg rounded-[100%] transition-all duration-500 group-hover:scale-x-110 group-hover:bg-black/30"></div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Custom Solution CTA */}
      <section className="py-24 bg-brand-charcoal text-stone-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6 text-white">Can't find what you need?</h2>
          <p className="mb-10 text-stone-400 font-light text-lg">We offer OEM manufacturing and custom instrument modification.</p>
          <Button variant="secondary" className="text-brand-gold border-brand-gold border hover:bg-brand-gold hover:text-brand-charcoal" onClick={() => navigate('/contact')}>
            Request Custom Solution
          </Button>
        </div>
      </section>

      {/* 3D FLIPBOOK MODAL */}
      <AnimatePresence>
        {selectedCatalogue && (
          <FlipBookViewer catalogue={selectedCatalogue} onClose={() => setSelectedCatalogue(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};