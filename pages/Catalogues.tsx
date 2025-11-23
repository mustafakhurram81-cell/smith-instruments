import React, { useState, useEffect } from 'react';
import { Section, Button, FadeIn } from '../components/Shared';
import { Download, Eye, X, ChevronRight, ChevronLeft, BookOpen, Layers, Keyboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const CATALOGUES = [
  { 
    title: "General Surgery", 
    size: "12MB", 
    color: "#262626",
    desc: "Comprehensive guide for general procedures.",
    img: "https://images.unsplash.com/photo-1584515933487-9d1009c24027?auto=format&fit=crop&q=80&w=500"
  },
  { 
    title: "Plastic & Aesthetic", 
    size: "8MB", 
    color: "#C5B495",
    desc: "Instruments for reconstruction and cosmetics.",
    img: "https://images.unsplash.com/photo-1606166325683-e6deb697d301?auto=format&fit=crop&q=80&w=500"
  },
  { 
    title: "Cardiovascular", 
    size: "15MB", 
    color: "#262626",
    desc: "High precision tools for heart surgery.",
    img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=500"
  },
  { 
    title: "Neuro & Spine", 
    size: "10MB", 
    color: "#C5B495",
    desc: "Microsurgical solutions for nervous systems.",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=500"
  },
  { 
    title: "ENT & Diagnostics", 
    size: "9MB", 
    color: "#262626",
    desc: "Tools for ear, nose, and throat specialists.",
    img: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=500"
  },
  { 
    title: "Dental Instruments", 
    size: "11MB", 
    color: "#C5B495",
    desc: "Complete range for dental professionals.",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=500"
  },
];

// Mock PDF Pages for the 3D effect - Simulating a real catalogue
const DEMO_PAGES = [
  { type: 'cover', img: "https://images.unsplash.com/photo-1584515933487-9d1009c24027?q=80&w=1200&auto=format&fit=crop", title: "Surgical Excellence" },
  { type: 'intro', img: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop", title: "Our Heritage" },
  { type: 'products', img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200&auto=format&fit=crop", title: "Precision Tools" },
  { type: 'detail', img: "https://images.unsplash.com/photo-1583912267653-90b82b78e97d?q=80&w=1200&auto=format&fit=crop", title: "Micro Details" },
  { type: 'specs', img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop", title: "Specifications" },
  { type: 'back', img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200&auto=format&fit=crop", title: "Contact Us" },
];

// --- 3D FLIPBOOK COMPONENT ---
const FlipBookViewer: React.FC<{ catalogue: any; onClose: () => void }> = ({ catalogue, onClose }) => {
  // We manage "Sheets". Each sheet has a Front (odd index) and Back (even index).
  const sheets = [];
  for (let i = 0; i < DEMO_PAGES.length; i += 2) {
    sheets.push({
      front: DEMO_PAGES[i],
      back: DEMO_PAGES[i + 1] || { type: 'blank', img: '', title: '' }
    });
  }

  const [flippedIndex, setFlippedIndex] = useState(-1); // -1 means book is closed (cover visible).

  const handleNext = () => {
    if (flippedIndex < sheets.length - 1) {
      setFlippedIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (flippedIndex >= -1) {
      setFlippedIndex(prev => prev - 1);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flippedIndex, onClose]);

  return (
    <div 
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-brand-charcoal/98 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      {/* Viewer Header */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center text-white z-50 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
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
           <Button variant="primary" className="py-2 px-6 text-xs" onClick={(e) => { e.stopPropagation(); alert("Downloading PDF..."); }}>
              <Download size={14} className="mr-2" /> Download PDF
           </Button>
           <button onClick={onClose} className="hover:text-brand-gold transition-colors p-2">
             <X size={32} />
           </button>
        </div>
      </div>

      {/* 3D SCENE CONTAINER */}
      <div 
        className="relative w-full h-full flex items-center justify-center perspective-[2000px] py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOOK WRAPPER - MAXIMIZED SIZE */}
        <div className="relative w-[95vw] md:w-auto md:h-[85vh] md:aspect-[1.6] max-h-[900px] bg-transparent transition-all duration-300">
          
          {/* Static Back Cover (Left Side - visible when pages flip) */}
          <div className="absolute left-0 top-0 w-1/2 h-full bg-white rounded-l-md border border-stone-200 shadow-2xl z-0 flex items-center justify-center overflow-hidden">
             {/* This simulates the 'previous' page lying flat on the left */}
             <div className="w-full h-full p-8 bg-stone-50 flex flex-col justify-between text-stone-400 relative">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
                
                <div className="text-sm uppercase tracking-widest relative z-10">Smith Instruments</div>
                <div className="text-center opacity-20 relative z-10">
                   <Layers size={120} className="mx-auto mb-4" />
                   <p className="text-2xl">Page {flippedIndex >= 0 ? (flippedIndex * 2) + 2 : 0}</p>
                </div>
                <div className="text-xs relative z-10">www.smithinstruments.com</div>
             </div>
          </div>

          {/* Static Right Base (Right Side) */}
           <div className="absolute right-0 top-0 w-1/2 h-full bg-white rounded-r-md border border-stone-200 shadow-2xl z-0 flex items-center justify-center overflow-hidden">
             <div className="w-full h-full p-8 bg-stone-50 flex flex-col justify-between text-stone-400 relative">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                <div className="text-sm uppercase tracking-widest text-right relative z-10">Catalogue 2024</div>
                <div className="text-center opacity-20 relative z-10">
                   <Layers size={120} className="mx-auto mb-4" />
                   <p className="text-2xl">Page {flippedIndex < sheets.length - 1 ? (flippedIndex * 2) + 5 : 'End'}</p>
                </div>
                <div className="text-xs text-right relative z-10">Confidential</div>
             </div>
          </div>

          {/* SHEETS */}
          {sheets.map((sheet, index) => {
            // Z-Index Logic
            const isFlipped = index <= flippedIndex;
            let zIndex = 0;
            if (isFlipped) {
               zIndex = index + 10; // Top of left stack
            } else {
               zIndex = (sheets.length - index) + 10; // Top of right stack
            }

            return (
              <div
                key={index}
                className="absolute right-0 top-0 w-1/2 h-full transition-all duration-700 ease-in-out transform-style-3d origin-left cursor-pointer"
                style={{
                  zIndex: zIndex,
                  transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                }}
                onClick={(e) => { e.stopPropagation(); isFlipped ? handlePrev() : handleNext(); }}
              >
                {/* FRONT FACE (Visible when on RIGHT) */}
                <div 
                   className="absolute inset-0 w-full h-full bg-white rounded-r-md overflow-hidden backface-hidden shadow-md border-l border-stone-100"
                   style={{ backfaceVisibility: 'hidden' }}
                >
                   {/* Paper Texture */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-30 pointer-events-none mix-blend-multiply z-20"></div>
                   
                   <img src={sheet.front.img} alt="Page" className="w-full h-full object-cover" />
                   <div className="absolute bottom-6 right-6 bg-white/90 px-4 py-2 text-sm font-serif shadow-sm backdrop-blur-sm z-30 text-brand-charcoal">
                      {sheet.front.title} &middot; p.{index * 2 + 1}
                   </div>
                   {/* Gradient for spine shadow */}
                   <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-20"></div>
                </div>

                {/* BACK FACE (Visible when on LEFT) */}
                <div 
                   className="absolute inset-0 w-full h-full bg-white rounded-l-md overflow-hidden backface-hidden shadow-md border-r border-stone-100"
                   style={{ 
                     backfaceVisibility: 'hidden', 
                     transform: 'rotateY(180deg)' 
                   }}
                >
                   {/* Paper Texture */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-30 pointer-events-none mix-blend-multiply z-20"></div>

                   <img src={sheet.back.img} alt="Page" className="w-full h-full object-cover" />
                   <div className="absolute bottom-6 left-6 bg-white/90 px-4 py-2 text-sm font-serif shadow-sm backdrop-blur-sm z-30 text-brand-charcoal">
                      {sheet.back.title} &middot; p.{index * 2 + 2}
                   </div>
                   {/* Gradient for spine shadow */}
                   <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-20"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls (Floating Bottom) */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 text-white z-50 pointer-events-none">
           <div className="flex items-center gap-6 bg-brand-charcoal/80 backdrop-blur-md px-8 py-3 rounded-full pointer-events-auto border border-stone-700 shadow-2xl">
             <button 
               onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
               disabled={flippedIndex === -1}
               className="p-2 rounded-full hover:bg-brand-gold hover:text-brand-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
               aria-label="Previous Page"
             >
               <ChevronLeft size={28} />
             </button>
             
             <span className="text-sm font-medium tracking-widest text-stone-200 select-none min-w-[100px] text-center">
               {flippedIndex + 2} <span className="text-stone-500 mx-1">/</span> {sheets.length + 1}
             </span>
             
             <button 
               onClick={(e) => { e.stopPropagation(); handleNext(); }} 
               disabled={flippedIndex === sheets.length - 1}
               className="p-2 rounded-full hover:bg-brand-gold hover:text-brand-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
               aria-label="Next Page"
             >
               <ChevronRight size={28} />
             </button>
           </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 perspective-[1000px]">
            {CATALOGUES.map((cat, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group cursor-pointer relative" onClick={() => setSelectedCatalogue(cat)}>
                  {/* 3D Book Container */}
                  <div className="relative w-[260px] h-[360px] mx-auto transition-transform duration-500 ease-out transform-style-3d group-hover:rotate-y-[-15deg] group-hover:translate-x-4">
                    
                    {/* Front Cover */}
                    <div className="absolute inset-0 bg-brand-charcoal rounded-r-md shadow-xl overflow-hidden flex flex-col border-l-4 border-stone-700"
                         style={{ backgroundColor: cat.color }}>
                        <div className="h-2/3 relative">
                           {/* Removed grayscale classes to always show color */}
                           <img src={cat.img} alt={cat.title} className="w-full h-full object-cover opacity-90 transition-all duration-500" />
                           <div className="absolute inset-0 bg-black/20"></div>
                           <div className="absolute top-4 right-4 w-8 h-8 border border-white/50 rounded-full flex items-center justify-center">
                             <span className="text-white text-[10px] font-serif font-bold">SI</span>
                           </div>
                        </div>
                        <div className="h-1/3 p-6 flex flex-col justify-between bg-white">
                            <div>
                                <h3 className="font-serif text-xl text-brand-charcoal leading-tight">{cat.title}</h3>
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Edition 2024</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-stone-500 font-medium">{cat.size} PDF</span>
                                <Eye size={16} className="text-brand-gold" />
                            </div>
                        </div>
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>

                    {/* Book Spine Effect (Left side) */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-stone-800 origin-left rotate-y-90"></div>
                    
                    {/* Pages Effect (Right side) */}
                    <div className="absolute right-0 top-2 bottom-2 w-3 bg-white origin-right rotate-y-90 translate-z-[-2px] shadow-inner"></div>
                    <div className="absolute right-0 top-2 bottom-2 w-3 bg-stone-200 origin-right rotate-y-90 translate-z-[-4px]"></div>

                    {/* Shadow under book */}
                    <div className="absolute -bottom-8 left-4 right-4 h-4 bg-black/20 blur-lg rounded-[100%] transition-all duration-500 group-hover:scale-x-110 group-hover:bg-black/30"></div>
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