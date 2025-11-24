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
// --- 3D FLIPBOOK COMPONENT ---
const FlipBookViewer: React.FC<{ catalogue: any; onClose: () => void }> = ({ catalogue, onClose }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const book = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

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

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-brand-charcoal/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 text-white bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <h2 className="font-serif text-xl">{catalogue.title}</h2>
          <span className="text-white/50 text-sm hidden md:inline-block">|</span>
          <span className="text-white/50 text-sm hidden md:inline-block">Use Arrow Keys to Navigate</span>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <Button variant="primary" className="py-2 px-4 text-xs" onClick={() => window.open(catalogue.pdfUrl, '_blank')}>
            <Download size={14} className="mr-2" /> Download
          </Button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Book Container */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <Document
          file={catalogue.pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex flex-col items-center gap-4 text-white">
              <Loader2 size={40} className="animate-spin text-brand-gold" />
              <p className="font-light tracking-widest uppercase text-sm">Loading Catalogue...</p>
            </div>
          }
          className="flex items-center justify-center"
        >
          {numPages > 0 && (
            <HTMLFlipBook
              width={450}
              height={636} // A4 Ratio approx
              size="stretch"
              minWidth={300}
              maxWidth={600}
              minHeight={400}
              maxHeight={800}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              ref={book}
              onFlip={onFlip}
              className="shadow-2xl"
              style={{ margin: '0 auto' }}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div key={index} className="bg-white flex items-center justify-center overflow-hidden shadow-inner relative">
                  {/* Page Content */}
                  <div className="w-full h-full flex items-center justify-center bg-white">
                    <Page
                      pageNumber={index + 1}
                      width={450} // Match flipbook page width
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-sm !bg-white"
                      loading={<div className="w-full h-full bg-stone-50 animate-pulse" />}
                    />
                  </div>

                  {/* Page Number */}
                  <div className="absolute bottom-4 text-[10px] text-stone-400 font-serif z-10">
                    {index + 1}
                  </div>

                  {/* Spine Shadow Gradient */}
                  <div className={`absolute top-0 bottom-0 w-6 pointer-events-none z-20 ${index % 2 === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/5 to-transparent`}></div>
                </div>
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 flex items-center gap-8 z-50 pointer-events-auto">
        <button
          onClick={() => book.current?.pageFlip()?.flipPrev()}
          className="p-3 rounded-full bg-white/10 hover:bg-brand-gold hover:text-brand-charcoal text-white transition-all backdrop-blur-md border border-white/10"
        >
          <ChevronLeft size={24} />
        </button>

        <span className="text-white font-serif text-lg tracking-widest select-none">
          {currentPage + 1} / {numPages}
        </span>

        <button
          onClick={() => book.current?.pageFlip()?.flipNext()}
          className="p-3 rounded-full bg-white/10 hover:bg-brand-gold hover:text-brand-charcoal text-white transition-all backdrop-blur-md border border-white/10"
        >
          <ChevronRight size={24} />
        </button>
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