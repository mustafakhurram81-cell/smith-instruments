import React, { useState } from 'react';
import { Section, Button, FadeIn } from '../components/Shared';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CATALOGUES } from '../data/catalogues';
import { CatalogueThumbnail } from '../components/CatalogueThumbnail';
import { FlipBookViewer } from '../components/FlipBookViewer';

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