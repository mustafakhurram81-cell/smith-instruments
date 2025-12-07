import React, { useState, useEffect } from 'react';
import { Section, Button, FadeIn, AnimatedCounter } from '../components/Shared';
import { SEO } from '../components/SEO';
import { ArrowRight, ShieldCheck, Truck, CreditCard, PenTool, Scissors, HeartPulse, Brain, Bone, Stethoscope, Microscope, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Product categories with translation keys
  const PRODUCTS = [
    { id: 1, name: t('products.plasticSurgery'), icon: Scissors, desc: t('products.plasticSurgeryDesc') },
    { id: 2, name: t('products.cardiovascular'), icon: HeartPulse, desc: t('products.cardiovascularDesc') },
    { id: 3, name: t('products.neurology'), icon: Brain, desc: t('products.neurologyDesc') },
    { id: 4, name: t('products.orthopedics'), icon: Bone, desc: t('products.orthopedicsDesc') },
    { id: 5, name: t('products.diagnostics'), icon: Stethoscope, desc: t('products.diagnosticsDesc') },
    { id: 6, name: t('products.laryngoscopes'), icon: Microscope, desc: t('products.laryngoscopesDesc') },
  ];

  const TESTIMONIALS = [
    { id: 1, text: "The precision of Smith Instruments matches the highest standards we require in reconstructive surgery.", author: "Dr. Almeida", location: "São Paulo, Brazil", role: "Chief Surgeon" },
    { id: 2, text: "Excellent delivery times and the payment-after-satisfaction policy gives us total peace of mind.", author: "Maria Gonzalez", location: "Buenos Aires, Argentina", role: "Procurement Director" },
    { id: 3, text: "We have partnered with them for 5 years. Their customized OEM solutions are impeccable.", author: "Dr. Silva", location: "Santiago, Chile", role: "Clinic Director" },
  ];

  // Carousel Logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const infiniteProducts = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS];

  // Responsive Check for Carousel
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % PRODUCTS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  };

  // Why Choose Us items with translations
  const whyChooseItems = [
    { icon: ShieldCheck, title: t('home.medicalGradeSteel'), desc: t('home.medicalGradeSteelDesc') },
    { icon: PenTool, title: t('home.customizable'), desc: t('home.customizableDesc') },
    { icon: CreditCard, title: t('home.paymentAfterDelivery'), desc: t('home.paymentAfterDeliveryDesc') },
    { icon: Truck, title: t('home.fastDelivery'), desc: t('home.fastDeliveryDesc') }
  ];

  return (
    <div className="overflow-x-hidden">
      <SEO
        title={t('nav.home')}
        description="Smith Instruments: Premium manufacturer of precision surgical instruments. ISO certified, global shipping, and custom OEM solutions for healthcare professionals."
      />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-charcoal">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?q=80&w=2070&auto=format&fit=crop"
            alt="Surgical Instruments Background"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-20 md:py-0">
          <div className="max-w-4xl">
            <FadeIn>
              <div className="inline-block border border-brand-gold/50 px-4 py-1 mb-6 md:mb-8 rounded-full backdrop-blur-sm">
                <span className="text-brand-gold text-xs tracking-[0.2em] uppercase font-bold">{t('home.badge')}</span>
              </div>
              {/* Fluid typography: clamp(min, preferred, max) */}
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.1] mb-6 md:mb-8 drop-shadow-lg">
                {t('home.title')} <span className="block md:inline italic font-light text-stone-300">{t('home.titleHighlight')}</span>
              </h1>
              <p className="max-w-xl text-stone-200 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 md:mb-12 drop-shadow-md">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-6">
                <Button onClick={() => navigate('/catalogues')} variant="primary" className="shadow-lg shadow-brand-gold/20 px-6 sm:px-10 text-sm sm:text-base whitespace-nowrap">
                  {t('home.exploreCatalogue')} <ArrowRight size={16} className="ml-2 flex-shrink-0" />
                </Button>
                <Button onClick={() => navigate('/about')} variant="outline" className="text-white border-white hover:bg-white hover:text-brand-charcoal px-6 sm:px-10 text-sm sm:text-base whitespace-nowrap">
                  {t('home.ourStory')}
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-10 animate-pulse text-stone-400 flex items-center gap-4">
          <div className="w-12 h-[1px] bg-stone-400/50"></div>
          <span className="text-xs uppercase tracking-widest">{t('home.scroll')}</span>
        </div>
      </section>

      {/* IMPACT COUNTERS */}
      <section className="bg-stone-50 py-24 border-y border-stone-200/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-charcoal">{t('home.ourImpact')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <FadeIn delay={0.1}>
              <div className="p-4">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-gold mb-2">
                  <AnimatedCounter to={20} />
                  <span>+</span>
                </div>
                <span className="text-sm uppercase tracking-widest text-brand-charcoal font-medium">{t('home.yearsExperience')}</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="p-4">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-gold mb-2">
                  <AnimatedCounter to={20} />
                  <span>+</span>
                </div>
                <span className="text-sm uppercase tracking-widest text-brand-charcoal font-medium">{t('home.countriesServed')}</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="p-4">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-gold mb-2">
                  <AnimatedCounter to={50} />
                  <span>+</span>
                </div>
                <span className="text-sm uppercase tracking-widest text-brand-charcoal font-medium">{t('home.globalClients')}</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <Section className="bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="font-serif text-4xl text-brand-charcoal mb-4">{t('home.whyChooseUs')}</h2>
            <p className="text-stone-500 font-light">{t('home.whySubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseItems.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group p-8 bg-stone-50 rounded-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full text-center border border-stone-100">
                  <div className="w-12 h-12 mx-auto bg-white border border-stone-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand-gold group-hover:border-brand-gold transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-brand-charcoal transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold mb-3 text-brand-charcoal">{item.title}</h3>
                  <p className="text-stone-500 font-light leading-relaxed text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* PRODUCTS CAROUSEL */}
      <Section className="bg-stone-50 overflow-hidden relative">
        <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl text-brand-charcoal mb-4">{t('home.ourProducts')}</h2>
            <p className="text-stone-500 font-light text-lg">{t('home.ourProductsSubtitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center hover:bg-brand-charcoal hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center hover:bg-brand-charcoal hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="container mx-auto px-6 overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(calc(-${currentSlide} * ${isMobile ? '(100% + 24px)' : '(350px + 24px)'}))`
            }}
          >
            {infiniteProducts.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className="min-w-[100%] md:min-w-[350px] shrink-0 group cursor-pointer"
                onClick={() => navigate('/catalogues')}
              >
                <div className="bg-white border border-stone-200 p-8 rounded-sm h-[320px] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-brand-gold relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-stone-50 rounded-full group-hover:bg-brand-gold/10 transition-colors duration-500"></div>

                  <div>
                    <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center mb-6 border border-stone-100 group-hover:border-brand-gold/30 group-hover:bg-brand-gold/10 transition-colors">
                      <product.icon size={28} className="text-brand-charcoal group-hover:text-brand-gold transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-brand-charcoal mb-2">{product.name}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{product.desc}</p>
                  </div>

                  <div className="flex items-center text-sm font-medium text-brand-charcoal mt-6 group-hover:text-brand-gold transition-colors">
                    <span className="mr-2">{t('home.exploreCategory')}</span>
                    <div className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                      <ArrowRight size={12} className="-ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ABOUT - CHARCOAL DARK THEME */}
      <Section className="bg-brand-charcoal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-800/20 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" alt="Surgical Team" className="rounded-sm shadow-2xl opacity-90" />
          </div>
          <div className="w-full md:w-1/2 text-stone-300">
            <h2 className="font-serif text-4xl text-white mb-6">{t('home.americanCraftsmanship')} <br /><span className="text-brand-gold">{t('home.globalStandards')}</span></h2>
            <p className="font-light leading-relaxed mb-8 text-lg text-stone-400">
              {t('home.aboutText1')}
            </p>
            <p className="font-light leading-relaxed mb-10 text-stone-400">
              {t('home.aboutText2')}
            </p>
            <Button variant="primary" onClick={() => navigate('/about')}>
              {t('home.learnMore')} <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-charcoal mb-4">{t('home.trustedByProfessionals')}</h2>
            <p className="text-stone-500 font-light">{t('home.testimonialsSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <FadeIn key={testimonial.id} delay={i * 0.2}>
                <div className="bg-white p-10 shadow-sm h-full flex flex-col justify-between rounded-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-stone-100">
                  <div className="absolute -top-4 -right-4 text-9xl font-serif text-stone-100 group-hover:text-brand-gold/10 transition-colors select-none pointer-events-none">
                    "
                  </div>

                  <div className="relative z-10">
                    <Quote size={24} className="text-brand-gold mb-6" />
                    <p className="font-serif text-brand-charcoal text-xl leading-relaxed mb-8">
                      {testimonial.text}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-stone-50">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center font-serif font-bold text-xl text-brand-charcoal group-hover:bg-brand-gold group-hover:text-brand-charcoal transition-colors duration-500">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-brand-charcoal">{testimonial.author}</p>
                      <p className="text-xs text-stone-500 uppercase tracking-wide font-medium">{testimonial.role}</p>
                      <p className="text-xs text-brand-gold mt-1">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};