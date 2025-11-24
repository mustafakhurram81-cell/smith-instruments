import React, { useState, useMemo } from 'react';
import { Section, Button, FadeIn } from '../components/Shared';
import { Eye, Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CATALOGUES } from '../data/catalogues';
import { CatalogueThumbnail } from '../components/CatalogueThumbnail';
import { FlipBookViewer } from '../components/FlipBookViewer';
import { SEO } from '../components/SEO';

export const Catalogues: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCatalogue, setSelectedCatalogue] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories from data (assuming titles imply categories or we add a category field later)
  // For now, we'll hardcode some logical categories based on current data
  const CATEGORIES = ['All', 'Surgery', 'Dental', 'Cardiovascular', 'Neuro', 'ENT'];

  const filteredCatalogues = useMemo(() => {
    return CATALOGUES.filter((cat) => {
      const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' ||
        cat.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Surgery' && cat.title.includes('Surgery')); // Simple matching logic

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="pt-20">
      <SEO
        title="Surgical Instrument Catalogues"
        description="Browse our comprehensive digital library of surgical instruments including General Surgery, Dental, Cardiovascular, and more."
        keywords="surgical catalogues, medical instruments, dental tools, cardiovascular instruments, neurosurgery tools"
      />
      {/* Header */}
      <div className="bg-stone-50 py-24 text-center relative overflow-hidden border-b border-stone-200">
        <h1 className="font-serif text-5xl md:text-6xl text-brand-charcoal relative z-10 mb-4">Our Catalogues</h1>
        <p className="text-stone-500 font-light max-w-xl mx-auto relative z-10 mb-8">Digital libraries of our comprehensive instrument ranges.</p>

        {/* Search & Filter Bar */}
        <div className="container mx-auto px-6 relative z-20 max-w-2xl">
          <div className="bg-white p-2 rounded-full shadow-lg border border-stone-100 flex items-center gap-2">
            <div className="pl-4 text-stone-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search catalogues..."
              className="flex-grow bg-transparent border-none outline-none text-brand-charcoal placeholder-stone-400 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-2 text-stone-400 hover:text-brand-charcoal">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-brand-charcoal text-white shadow-md'
                  : 'bg-white text-stone-500 border border-stone-200 hover:border-brand-gold hover:text-brand-gold'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 3D Books */}
      <Section className="bg-white min-h-[600px]">
        <div className="container mx-auto px-6">
          {filteredCatalogues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {filteredCatalogues.map((cat, idx) => (
                <FadeIn key={cat.title} delay={idx * 0.1}>
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
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-stone-400 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-serif text-brand-charcoal mb-2">No catalogues found</h3>
              <p className="text-stone-500">Try adjusting your search or filter criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 text-brand-gold hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
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