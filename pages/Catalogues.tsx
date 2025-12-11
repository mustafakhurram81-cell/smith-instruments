import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { Section, Button, FadeIn, ParallaxHeader } from '../components/Shared';
import { Eye, Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getCatalogues, Catalogue } from '../lib/database';
import { CatalogueThumbnail } from '../components/CatalogueThumbnail';
import { SEO } from '../components/SEO';

// Lazy load FlipBookViewer to defer 507KB PDF library until needed
const FlipBookViewer = lazy(() => import('../components/FlipBookViewer').then(m => ({ default: m.FlipBookViewer })));

export const Catalogues: React.FC = () => {
  const navigate = useNavigate();
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatalogue, setSelectedCatalogue] = useState<Catalogue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch catalogues from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const catalogueData = await getCatalogues();
      setCatalogues(catalogueData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredCatalogues = useMemo(() => {
    return catalogues.filter((cat) => {
      const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      return matchesSearch;
    });
  }, [catalogues, searchQuery]);

  return (
    <div className="pt-20">
      <SEO
        title="Surgical Instrument Catalogues"
        description="Browse our comprehensive digital library of surgical instruments including General Surgery, Dental, Cardiovascular, and more."
        keywords="surgical catalogues, medical instruments, dental tools, cardiovascular instruments, neurosurgery tools"
      />
      {/* Header */}
      <ParallaxHeader
        title="Our Catalogues"
        description="Digital libraries of our comprehensive instrument ranges."
        image="/images/headers/catalogues-header.png"
      />

      {/* Search Bar */}
      <div className="container mx-auto px-6 mt-12 mb-12 max-w-2xl">
        <div className="bg-white p-2 rounded-full shadow-lg border border-stone-200 flex items-center gap-2">
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
      </div>

      {/* Grid of 3D Books */}
      <Section className="bg-white min-h-[600px]">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
            </div>
          ) : filteredCatalogues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {filteredCatalogues.map((cat, idx) => (
                <FadeIn key={cat.title} delay={idx * 0.1}>
                  <div className="group cursor-pointer" onClick={() => setSelectedCatalogue(cat)}>
                    {/* Book Container */}
                    <div className="relative w-[240px] h-[340px] mx-auto transition-transform duration-300 group-hover:-translate-y-2">

                      {/* Front Cover */}
                      <div className="absolute inset-0 bg-white rounded-r-md shadow-xl overflow-hidden border-l-[6px] border-stone-800">
                        <CatalogueThumbnail url={cat.pdf_url} title="" />

                        {/* Spine shadow */}
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent"></div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-brand-charcoal/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center gap-2 text-white font-medium">
                            <Eye size={18} />
                            View Catalogue
                          </div>
                        </div>
                      </div>

                      {/* Book Spine */}
                      <div className="absolute left-[-10px] top-1 bottom-1 w-[10px] bg-gradient-to-r from-stone-900 to-stone-700 rounded-l-sm shadow-lg"></div>

                      {/* Pages Effect */}
                      <div className="absolute right-0 top-2 bottom-2 w-3 bg-white border-r border-stone-200 translate-x-[2px] z-[-1]"></div>
                      <div className="absolute right-0 top-2 bottom-2 w-3 bg-stone-100 translate-x-[4px] z-[-2]"></div>

                      {/* Shadow */}
                      <div className="absolute -bottom-5 left-4 right-4 h-4 bg-black/20 blur-lg rounded-[100%] transition-all group-hover:bg-black/30"></div>
                    </div>

                    {/* Title Below */}
                    <div className="text-center mt-6">
                      <h3 className="font-serif text-lg text-brand-charcoal group-hover:text-brand-gold transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1">{cat.size}</p>
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
              <p className="text-stone-500">Try adjusting your search terms.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-brand-gold hover:underline font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* Custom Solution CTA */}
      <section className="py-24 bg-brand-gold/5 bg-noise">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6 text-brand-charcoal">Can't find what you need?</h2>
          <p className="mb-10 text-stone-500 font-light text-lg">We offer OEM manufacturing and custom instrument modification.</p>
          <Button variant="primary" onClick={() => navigate('/contact')}>
            Request Custom Solution
          </Button>
        </div>
      </section>

      {/* 3D FLIPBOOK MODAL */}
      <AnimatePresence>
        {selectedCatalogue && (
          <Suspense fallback={
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
            </div>
          }>
            <FlipBookViewer catalogue={selectedCatalogue} onClose={() => setSelectedCatalogue(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};