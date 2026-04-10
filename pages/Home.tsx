import React, { useState, useEffect, useRef } from 'react';
import { Section, Button, FadeIn, AnimatedCounter } from '../components/Shared';

import { SEO } from '../components/SEO';
import { ArrowRight, ShieldCheck, PenTool, CreditCard, Truck, Star, Quote, Scissors, HeartPulse, Brain, Bone, Stethoscope, Microscope } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import heroMethods from '../assets/hero-premium.png';
import manufacturingImg from '../assets/manufacturing-workshop.png';

const PRODUCTS = [
  { id: 1, name: "Plastic Surgery", icon: Scissors, desc: "Precision instruments for reconstruction" },
  { id: 2, name: "Cardiovascular", icon: HeartPulse, desc: "Advanced tools for cardiac procedures" },
  { id: 3, name: "Neurology", icon: Brain, desc: "Microsurgical instruments for neurosurgery" },
  { id: 4, name: "Orthopedics", icon: Bone, desc: "Heavy-duty solutions for bone surgery" },
  { id: 5, name: "Diagnostics", icon: Stethoscope, desc: "Essential diagnostic equipment" },
  { id: 6, name: "Laryngoscopes", icon: Microscope, desc: "High-visibility optical instruments" },
];

const TESTIMONIALS = [
  { id: 1, text: "The precision of Smith Instruments matches the highest standards we require in reconstructive surgery.", author: "Dr. Almeida", location: "São Paulo, Brazil", role: "Chief Surgeon" },
  { id: 2, text: "Excellent delivery times and the payment-after-satisfaction policy gives us total peace of mind.", author: "Maria Gonzalez", location: "Buenos Aires, Argentina", role: "Procurement Director" },
  { id: 3, text: "We have partnered with them for 5 years. Their customized OEM solutions are impeccable.", author: "Dr. Silva", location: "Santiago, Chile", role: "Clinic Director" },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Professional Infinite Carousel Logic
  const [isPaused, setIsPaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const animationStartTime = useRef(Date.now());
  const pausedTime = useRef(0);

  // Duplicate products for seamless loop (we need 2 copies for the infinite effect)
  const duplicatedProducts = [...PRODUCTS, ...PRODUCTS];

  // Animation duration: 30s total, divided by number of products = time per slide
  const ANIMATION_DURATION = 30000; // 30 seconds
  const TIME_PER_SLIDE = ANIMATION_DURATION / PRODUCTS.length;

  // Lightweight time-based slide tracking (optimized for Chrome)
  useEffect(() => {
    const updateActiveSlide = () => {
      if (!isPaused) {
        const elapsed = Date.now() - animationStartTime.current - pausedTime.current;
        const currentSlide = Math.floor((elapsed % ANIMATION_DURATION) / TIME_PER_SLIDE) % PRODUCTS.length;
        setActiveSlide(currentSlide);
      }
    };

    // Update every 500ms instead of every frame for better performance
    const intervalId = setInterval(updateActiveSlide, 500);
    return () => clearInterval(intervalId);
  }, [isPaused]);

  // Track paused duration for accurate slide position
  const pauseStartTime = useRef(0);

  const handleMouseEnter = () => {
    setIsPaused(true);
    pauseStartTime.current = Date.now();
  };

  const handleMouseLeave = () => {
    if (pauseStartTime.current > 0) {
      pausedTime.current += Date.now() - pauseStartTime.current;
    }
    setIsPaused(false);
  };

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="Home"
        description="Smith Instruments: Premium manufacturer of precision surgical instruments. ISO certified, global shipping, and custom OEM solutions for healthcare professionals."
        keywords="surgical instruments manufacturer, precision medical tools, German stainless steel instruments, plastic surgery instruments, cardiovascular surgical tools, custom OEM surgical instruments, buy surgical instruments"
      />
      {/* HERO */}
      <section className="relative h-screen flex items-center bg-brand-charcoal">
        <div className="absolute inset-0 z-0">
          <img
            src={heroMethods}
            alt="Surgical Instruments Background"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            width="1920"
            height="1080"
          />
          {/* Subtle overlay for extra contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/60 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-2xl">
            <FadeIn>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 md:mb-8">
                We Mold the Metal <span className="block md:inline italic font-light text-brand-orange">to Serve Life.</span>
              </h1>
              <p className="max-w-xl text-stone-300 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 md:mb-12">
                Crafting precision surgical instruments with unwavering commitment to quality and innovation for healthcare professionals worldwide.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-6">
                <Button onClick={() => navigate('/catalogues')} variant="primary" className="px-6 sm:px-10 text-sm sm:text-base whitespace-nowrap">
                  Explore Catalogue <ArrowRight size={16} className="ml-2 flex-shrink-0" />
                </Button>
                <Button onClick={() => navigate('/about')} variant="outline" className="text-white border-white hover:bg-white hover:text-brand-charcoal px-6 sm:px-10 text-sm sm:text-base whitespace-nowrap">
                  Our Story
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 flex items-center gap-4">
          <div className="w-12 h-[1px] bg-white/30" />
          <span className="text-xs uppercase tracking-widest text-white/50">Scroll</span>
        </div>
      </section>



      {/* IMPACT COUNTERS - GRID STYLE */}
      <section className="bg-white border-y border-stone-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200">
            <FadeIn delay={0.1}>
              <div className="py-16 px-8 text-center bg-white hover:bg-stone-50 transition-colors duration-500">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-charcoal mb-4">
                  <AnimatedCounter to={20} />
                  <span className="text-brand-orange">+</span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">Years of Experience</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="py-16 px-8 text-center bg-white hover:bg-stone-50 transition-colors duration-500">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-charcoal mb-4">
                  <AnimatedCounter to={20} />
                  <span className="text-brand-orange">+</span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">Countries Served</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="py-16 px-8 text-center bg-white hover:bg-stone-50 transition-colors duration-500">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-charcoal mb-4">
                  <AnimatedCounter to={50} />
                  <span className="text-brand-orange">+</span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">Global Clients</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - GRID CARD STYLE */}
      <Section className="bg-stone-50 relative border-b border-stone-200">
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-20 max-w-2xl">
            <span className="text-brand-orange font-bold text-xs tracking-widest uppercase mb-3 block">Why Choose Us</span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-6 text-balance">Precision Engineering, <br />Human Connection.</h2>
            <p className="text-stone-500 text-lg font-light leading-relaxed">
              We combine the scalability of a global manufacturer with the personalized attention of a boutique partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Medical-Grade Steel", desc: "Using only the highest quality materials for durability and performance." },
              { icon: PenTool, title: "Customizable", desc: "Tailored solutions to meet the specific needs of your surgical team." },
              { icon: CreditCard, title: "Payment After Delivery", desc: "Your satisfaction is our priority. Inspect your order before payment." },
              { icon: Truck, title: "Fast Delivery", desc: "Efficient logistics to ensure your instruments arrive on time, every time." }
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group h-full bg-white p-8 rounded-lg border border-stone-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-brand-charcoal">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* PRODUCTS CAROUSEL - Professional Infinite Loop */}
      <Section className="bg-white overflow-hidden relative border-b border-stone-200">
        <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-orange font-bold text-xs tracking-widest uppercase mb-3 block">Our Specialties</span>
            <h2 className="font-serif text-4xl text-brand-charcoal mb-4">Explore Our Products</h2>
            <p className="text-stone-500 font-light text-lg">A comprehensive range of instruments for every surgical specialty.</p>
          </div>
        </div>

        {/* Infinite Carousel Container */}
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Gradient fade masks for professional look */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div
            className="flex gap-6 py-4"
            style={{
              animation: `scroll 30s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
              width: 'max-content'
            }}
          >
            {duplicatedProducts.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className="w-[280px] md:w-[350px] shrink-0 group cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="bg-white rounded-lg border border-stone-200 p-8 h-[320px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-brand-orange/30">
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 flex items-center justify-center mb-6 group-hover:from-brand-orange/20 group-hover:to-brand-orange/10 transition-all duration-300">
                      <product.icon size={28} className="text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-brand-charcoal mb-2 group-hover:text-brand-orange transition-colors duration-300">{product.name}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{product.desc}</p>
                  </div>

                  <div className="flex items-center text-sm font-medium text-stone-500 mt-6 group-hover:text-brand-orange transition-colors">
                    <span className="mr-2">Explore</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {PRODUCTS.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSlide === idx
                ? 'bg-brand-orange w-6'
                : 'bg-stone-300 hover:bg-stone-400'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* CSS Keyframes for infinite scroll animation */}
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </Section>

      {/* ABOUT SECTION */}
      <Section className="bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-100/50 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2">
            <img
              src={manufacturingImg}
              alt="Precision Instrument Manufacturing"
              className="rounded-md shadow-lg"
              loading="lazy"
              width="600"
              height="400"
            />
          </div>
          <div className="w-full md:w-1/2 text-stone-600">
            <h2 className="font-serif text-4xl text-brand-charcoal mb-6">Our Legacy, <br /><span className="text-brand-orange">Your Trust.</span></h2>
            <p className="font-light leading-relaxed mb-6 text-lg text-stone-500">
              Headquartered in the United States and powered by world-class manufacturing facilities in Pakistan, Smith Instruments combines the best of both worlds: American quality standards with skilled craftsmanship honed over generations in one of the world's premier surgical instrument manufacturing hubs.
            </p>
            <p className="font-light leading-relaxed mb-10 text-lg text-stone-500">
              For over two decades, we've partnered with healthcare professionals across 20+ countries, delivering precision instruments that surgeons trust in the most critical moments. Our commitment: uncompromising quality, competitive pricing, and a satisfaction-first approach.
            </p>
            <Button variant="primary" onClick={() => navigate('/about')}>
              Learn More <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </Section >

      {/* TESTIMONIALS */}
      < Section className="bg-stone-50" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-charcoal mb-4">Trusted by Professionals</h2>
            <p className="text-stone-500 font-light">Hear from our partners in South America who rely on our quality and service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.id} delay={i * 0.2}>
                <div className="bg-white p-8 rounded-lg border border-stone-200 hover:border-brand-orange/30 transition-all relative">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} className="text-brand-orange fill-brand-orange" />
                    ))}
                  </div>
                  <p className="text-stone-600 italic mb-6 leading-relaxed relative z-10">"{t.text}"</p>
                  <div className="mt-auto">
                    <h4 className="font-serif text-brand-charcoal text-lg">{t.author}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-brand-orange font-bold uppercase tracking-wider">{t.role}</p>
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        <ShieldCheck size={10} /> Verified
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section >
    </div >
  );
};