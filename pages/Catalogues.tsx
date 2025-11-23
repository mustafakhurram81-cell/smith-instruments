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
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

  return (
    <div className="w-full h-full relative bg-stone-100 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <Loader2 className="animate-spin text-stone-300" size={24} />
      </div>
      <Document file={url} className="w-full h-full" loading={null}>
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
const FlipBookViewer: React.FC<{ catalogue: any; onClose: () => void }> = ({ catalogue, onClose }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const book = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') book.current?.pageFlip()?.flipNext();
      if (e.key === 'ArrowLeft') book.current?.pageFlip()?.flipPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-brand-charcoal/95 backdrop-blur-xl overflow-hidden"
      onClick={onClose}
    >
      {/* Viewer Header */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center text-white z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
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
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden Document Loader to get page count */}
        <div className="hidden">
          <Document file={catalogue.pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(error) => console.error("PDF Load Error:", error)}>
          </Document>
        </div>

        {loading ? (
          <div className="text-white flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-brand-gold" size={48} />
            <p>Loading Catalogue...</p>
          </div>
        ) : (
          <div className="relative shadow-2xl w-full max-w-[85vw] h-[80vh] flex items-center justify-center">
            {/* @ts-ignore - React PageFlip types are sometimes loose */}
            <HTMLFlipBook
              width={500} // Slightly reduced base width
              height={707} // Slightly reduced base height (maintaining A4 ratio)
              size="stretch"
              minWidth={300}
              maxWidth={800} // Cap max width to prevent it getting huge
              minHeight={400}
              maxHeight={1200} // Cap max height
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              usePortrait={false} // Force landscape/spread view on desktop
              startZIndex={0}
              autoSize={true}
              onFlip={onFlip}
              ref={book}
              className="flip-book"
              style={{ margin: '0 auto' }}
            >
              {/* Generate Pages */}
              {Array.from(new Array(numPages), (el, index) => (
                <div key={index} className="bg-white overflow-hidden shadow-inner border-r border-stone-100">
                  <div className="w-full h-full relative">
                    <Document file={catalogue.pdfUrl} loading={<div className="w-full h-full bg-stone-50 animate-pulse" />}>
                      <Page
                        pageNumber={index + 1}
                        width={600} // Render slightly larger for quality
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="w-full h-full object-contain"
                      />
                    </Document>
                    {/* Shadow Gradient for Spine */}
                    <div className={`absolute top-0 bottom-0 w-8 pointer-events-none z-20 ${index % 2 === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent`}></div>
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        )}

        {/* Navigation Controls (Floating Bottom) */}
        {!loading && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 text-white z-50 pointer-events-none">
            <div className="flex items-center gap-6 bg-brand-charcoal/90 backdrop-blur-md px-8 py-3 rounded-full pointer-events-auto border border-stone-600 shadow-2xl transition-transform hover:scale-105">
              <button
                onClick={(e) => { e.stopPropagation(); book.current?.pageFlip()?.flipPrev(); }}
                className="p-2 rounded-full hover:bg-brand-gold hover:text-brand-charcoal transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft size={28} />
              </button>

              <span className="text-sm font-medium tracking-widest text-stone-200 select-none min-w-[100px] text-center font-serif">
                {currentPage + 1} <span className="text-stone-500 mx-1">/</span> {numPages}
              </span>

              <button
                onClick={(e) => { e.stopPropagation(); book.current?.pageFlip()?.flipNext(); }}
                className="p-2 rounded-full hover:bg-brand-gold hover:text-brand-charcoal transition-all"
                aria-label="Next Page"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}
      </div>
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