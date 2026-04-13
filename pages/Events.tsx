import React, { useState } from 'react';
import { Section, FadeIn, ParallaxHeader } from '../components/Shared';
import { SEO } from '../components/SEO';
import { Calendar, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * PLACEHOLDER DATA — Replace with your real exhibition photos and event details.
 * Each event should have:
 *   - name: Event name
 *   - location: City, Country
 *   - year: Year of the event
 *   - description: Brief description
 *   - coverImage: URL to the main event photo
 *   - photos: Array of URLs for the photo gallery
 */
const EVENTS = [
  {
    id: 1,
    name: 'Arab Health',
    location: 'Dubai, UAE',
    year: '2024',
    description: 'One of the largest healthcare exhibitions in the Middle East. We showcased our complete range of surgical instruments and connected with distributors from across the GCC.',
    coverImage: '/images/headers/events-header.webp', // PLACEHOLDER — Replace with real photo
    photos: [
      '/images/headers/events-header.webp', // PLACEHOLDER
      '/images/headers/about-header.webp',  // PLACEHOLDER
      '/images/headers/products-header.webp', // PLACEHOLDER
    ]
  },
  {
    id: 2,
    name: 'Medica',
    location: 'Düsseldorf, Germany',
    year: '2023',
    description: 'The world\'s largest medical trade fair. Smith Instruments presented our latest innovations in plastic surgery and cardiovascular instruments to a global audience.',
    coverImage: '/images/headers/about-header.webp', // PLACEHOLDER
    photos: [
      '/images/headers/about-header.webp',  // PLACEHOLDER
      '/images/headers/events-header.webp', // PLACEHOLDER
    ]
  },
  {
    id: 3,
    name: 'FIME',
    location: 'Miami, USA',
    year: '2024',
    description: 'Florida International Medical Expo — the leading trade show for the Americas market. We strengthened our partnerships across Latin America.',
    coverImage: '/images/headers/contact-header.webp', // PLACEHOLDER
    photos: [
      '/images/headers/contact-header.webp', // PLACEHOLDER
      '/images/headers/products-header.webp', // PLACEHOLDER
    ]
  },
  {
    id: 4,
    name: 'Surgical Instruments Expo',
    location: 'Sialkot, Pakistan',
    year: '2023',
    description: 'Annual expo at the heart of surgical instrument manufacturing. We showcased our production capabilities and precision craftsmanship.',
    coverImage: '/images/headers/catalogues-header.webp', // PLACEHOLDER
    photos: [
      '/images/headers/catalogues-header.webp', // PLACEHOLDER
      '/images/headers/about-header.webp', // PLACEHOLDER
    ]
  }
];

// Lightbox component for photo gallery
const Lightbox: React.FC<{
  photos: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  eventName: string;
}> = ({ photos, currentIndex, onClose, onNext, onPrev, eventName }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-50 p-2"
            aria-label="Previous photo"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-50 p-2"
            aria-label="Next photo"
          >
            <ChevronRight size={36} />
          </button>
        </>
      )}

      {/* Image */}
      <div className="max-w-5xl w-full px-4 md:px-12" onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          src={photos[currentIndex]}
          alt={`${eventName} - Photo ${currentIndex + 1}`}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
        <p className="text-white/60 text-sm text-center mt-4">
          {eventName} — {currentIndex + 1} of {photos.length}
        </p>
      </div>
    </motion.div>
  );
};

export const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (event: typeof EVENTS[0], photoIdx: number) => {
    setSelectedEvent(event);
    setLightboxIndex(photoIdx);
  };

  const closeLightbox = () => {
    setSelectedEvent(null);
  };

  const nextPhoto = () => {
    if (selectedEvent) {
      setLightboxIndex((prev) => (prev + 1) % selectedEvent.photos.length);
    }
  };

  const prevPhoto = () => {
    if (selectedEvent) {
      setLightboxIndex((prev) => (prev - 1 + selectedEvent.photos.length) % selectedEvent.photos.length);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="Events & Exhibitions"
        description="Explore Smith Instruments' presence at international medical trade shows and exhibitions. See our team, products, and booths at Arab Health, Medica, FIME, and more."
        keywords="surgical instruments exhibitions, medical trade shows, Smith Instruments events, Arab Health, Medica, FIME, medical device expo"
      />

      {/* HERO */}
      <ParallaxHeader
        title="Events & Exhibitions"
        description="Where precision meets the world. Explore our presence at leading international medical exhibitions."
        image="/images/headers/events-header.webp"
        breadcrumbs={<span className="text-brand-orange uppercase tracking-[0.3em] text-sm font-bold block">Global Presence</span>}
      />

      {/* EVENTS GRID */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <span className="text-brand-orange font-bold text-xs tracking-widest uppercase mb-3 block">Our Exhibitions</span>
            <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-6 text-balance">
              Showcasing Precision <span className="text-brand-orange">Worldwide.</span>
            </h2>
            <p className="text-stone-500 text-lg font-light leading-relaxed">
              We participate in the world's most prestigious medical exhibitions to showcase our instruments, connect with partners, and stay at the forefront of surgical innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EVENTS.map((event, idx) => (
              <FadeIn key={event.id} delay={idx * 0.1}>
                <div className="group bg-white rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-xl hover:border-brand-orange/20 transition-all duration-300">
                  {/* Cover Image */}
                  <div
                    className="relative h-56 md:h-64 overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(event, 0)}
                  >
                    <img
                      src={event.coverImage}
                      alt={`${event.name} ${event.year}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent" />

                    {/* Photo count badge */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-brand-charcoal text-xs font-medium px-3 py-1.5 rounded-full">
                      {event.photos.length} Photos
                    </div>

                    {/* Year badge */}
                    <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {event.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <h3 className="font-heading text-2xl text-brand-charcoal mb-2 group-hover:text-brand-orange transition-colors">
                      {event.name}
                    </h3>

                    <div className="flex items-center gap-4 mb-4 text-sm text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-brand-orange" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-brand-orange" />
                        {event.year}
                      </span>
                    </div>

                    <p className="text-stone-500 text-sm leading-relaxed">{event.description}</p>

                    {/* Photo thumbnails */}
                    <div className="flex gap-2 mt-6">
                      {event.photos.slice(0, 4).map((photo, photoIdx) => (
                        <button
                          key={photoIdx}
                          onClick={() => openLightbox(event, photoIdx)}
                          className="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-orange transition-colors flex-shrink-0"
                        >
                          <img
                            src={photo}
                            alt={`${event.name} thumbnail ${photoIdx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                      {event.photos.length > 4 && (
                        <button
                          onClick={() => openLightbox(event, 4)}
                          className="w-16 h-16 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 text-xs font-medium hover:bg-stone-200 transition-colors flex-shrink-0"
                        >
                          +{event.photos.length - 4}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS / CTA */}
      <section className="py-16 md:py-20 bg-white border-t border-stone-200/50">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <Calendar className="w-12 h-12 text-brand-orange mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-heading text-3xl md:text-4xl text-brand-charcoal mb-4">Want to Meet Us?</h2>
            <p className="text-stone-500 font-light text-lg max-w-2xl mx-auto mb-8">
              We exhibit at major medical trade shows throughout the year. Contact us to schedule a meeting at an upcoming event or visit our manufacturing facility.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-brand-orange text-white font-semibold rounded-md hover:bg-[#E54D20] transition-colors"
            >
              Schedule a Meeting <Calendar size={16} className="ml-2" />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedEvent && (
          <Lightbox
            photos={selectedEvent.photos}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextPhoto}
            onPrev={prevPhoto}
            eventName={selectedEvent.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
