import React, { useState, useEffect } from 'react';
import { Section, Button, FadeIn, AnimatedCounter } from '../components/Shared';
import { SEO } from '../components/SEO';
import { ArrowRight, ShieldCheck, Truck, CreditCard, PenTool, Scissors, HeartPulse, Brain, Bone, Stethoscope, Microscope, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroMethods from '../assets/hero-instruments.png';
import featureInstruments from '../assets/feature-instruments.png';

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

  // Carousel Logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const infiniteProducts = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
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

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="Home"
        description="Smith Instruments: Premium manufacturer of precision surgical instruments. ISO certified, global shipping, and custom OEM solutions for healthcare professionals."
      />
      {/* HERO */}
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img
            src={heroMethods}
            alt="Surgical Instruments Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-20 md:py-0">
          <div className="max-w-4xl">
            <FadeIn>
              <div className="inline-block border border-brand-charcoal/30 px-4 py-1 mb-6 md:mb-8 rounded-full backdrop-blur-sm bg-white/50">
                <span className="text-brand-charcoal text-xs tracking-[0.2em] uppercase font-bold">Premium Surgical Solutions</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-brand-charcoal leading-[1.1] mb-6 md:mb-8 drop-shadow-sm">
                We Mold the Metal <span className="block md:inline italic font-light text-brand-gold">to Serve Life.</span>
              </h1>
              <p className="max-w-xl text-stone-600 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 md:mb-12">
                Crafting precision surgical instruments with unwavering commitment to quality and innovation for healthcare professionals worldwide.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-6">
                <Button onClick={() => navigate('/catalogues')} variant="primary" className="shadow-lg shadow-brand-gold/20 px-6 sm:px-10 text-sm sm:text-base whitespace-nowrap">
                  Explore Catalogue <ArrowRight size={16} className="ml-2 flex-shrink-0" />
                </Button>
                <Button onClick={() => navigate('/about')} variant="outline" className="text-brand-charcoal border-brand-charcoal hover:bg-brand-charcoal hover:text-white px-6 sm:px-10 text-sm sm:text-base whitespace-nowrap">
                  Our Story
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 animate-pulse text-stone-400 flex items-center gap-4">
          <div className="w-12 h-[1px] bg-brand-charcoal/20"></div>
          <span className="text-xs uppercase tracking-widest text-brand-charcoal/50">Scroll</span>
        </div>
      </section>

      {/* IMPACT COUNTERS */}
      <section className="bg-stone-50 py-24 border-y border-stone-200/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-charcoal">Our Impact</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <FadeIn delay={0.1}>
              <div className="p-4">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-gold mb-2">
                  <AnimatedCounter to={20} />
                  <span>+</span>
                </div>
                <span className="text-sm uppercase tracking-widest text-brand-charcoal font-medium">Years of Experience</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="p-4">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-gold mb-2">
                  <AnimatedCounter to={20} />
                  <span>+</span>
                </div>
                <span className="text-sm uppercase tracking-widest text-brand-charcoal font-medium">Countries Served</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="p-4">
                <div className="flex items-center justify-center font-serif text-6xl md:text-7xl text-brand-gold mb-2">
                  <AnimatedCounter to={50} />
                  <span>+</span>
                </div>
                <span className="text-sm uppercase tracking-widest text-brand-charcoal font-medium">Global Clients</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <Section className="bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="font-serif text-4xl text-brand-charcoal mb-4">Why Choose Us?</h2>
            <p className="text-stone-500 font-light">Precision, reliability, and partnership in every instrument we create.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Medical-Grade Steel", desc: "Using only the highest quality materials for durability and performance." },
              { icon: PenTool, title: "Customizable", desc: "Tailored solutions to meet the specific needs of your surgical team." },
              { icon: CreditCard, title: "Payment After Delivery", desc: "Your satisfaction is our priority. Inspect your order before payment." },
              { icon: Truck, title: "Fast Delivery", desc: "Efficient logistics to ensure your instruments arrive on time, every time." }
            ].map((item, idx) => (
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

      {/* PRECISION ENGINEERING SHOWCASE */}
      <Section className="bg-stone-50 py-0 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative rounded-sm overflow-hidden shadow-2xl">
                <img
                  src={featureInstruments}
                  alt="Macro view of surgical instrument precision"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-brand-charcoal/10 mix-blend-multiply"></div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-brand-gold"></div>
                  <span className="text-brand-gold uppercase tracking-widest text-xs font-bold">Uncompromising Quality</span>
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl text-brand-charcoal mb-6 leading-tight">
                  Precision in <br />Every Micro-Detail.
                </h2>
                <p className="text-stone-600 font-light text-lg mb-6 leading-relaxed">
                  Our instruments are not just tools; they are extensions of the surgeon's hands. We use high-grade German Stainless Steel and Tungsten Carbide inserts to ensure longevity, perfect balance, and corrosion resistance.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Tungsten Carbide Inserts', 'German Stainless Steel (AISI 410/420)', 'Hand-Finished Calibration', 'Corrosion Resistant Coating'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-stone-700">
                      <ShieldCheck size={18} className="text-brand-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => navigate('/about')} variant="secondary" className="px-8">
                  Learn About Our Process
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* PRODUCTS CAROUSEL */}
      <Section className="bg-white overflow-hidden relative">
        <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl text-brand-charcoal mb-4">Our Products</h2>
            <p className="text-stone-500 font-light text-lg">A comprehensive range of instruments for every surgical specialty.</p>
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
                    <span className="mr-2">Explore Category</span>
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

      {/* ABOUT SECTION */}
      <Section className="bg-brand-charcoal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-800/20 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" alt="Surgical Team" className="rounded-sm shadow-2xl opacity-90" />
          </div>
          <div className="w-full md:w-1/2 text-stone-300">
            <h2 className="font-serif text-4xl text-white mb-6">American Craftsmanship, <br /><span className="text-brand-gold">Global Standards.</span></h2>
            <p className="font-light leading-relaxed mb-8 text-lg text-stone-400">
              Based in the USA, Smith Instruments has been a pillar of the medical device industry for over two decades. We blend traditional craftsmanship with modern technology to produce surgical instruments that are not only precise but also reliable and ergonomic.
            </p>
            <p className="font-light leading-relaxed mb-10 text-stone-400">
              Our mission is to support healthcare providers by giving them the tools they need to perform with confidence.
            </p>
            <Button variant="primary" onClick={() => navigate('/about')}>
              Learn More <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-charcoal mb-4">Trusted by Professionals</h2>
            <p className="text-stone-500 font-light">Hear from our partners in South America who rely on our quality and service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.id} delay={i * 0.2}>
                <div className="bg-white p-10 shadow-sm h-full flex flex-col justify-between rounded-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-stone-100">
                  <div className="absolute -top-4 -right-4 text-9xl font-serif text-stone-100 group-hover:text-brand-gold/10 transition-colors select-none pointer-events-none">
                    "
                  </div>

                  <div className="relative z-10">
                    <Quote size={24} className="text-brand-gold mb-6" />
                    <p className="font-serif text-brand-charcoal text-xl leading-relaxed mb-8">
                      {t.text}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-stone-50">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center font-serif font-bold text-xl text-brand-charcoal group-hover:bg-brand-gold group-hover:text-brand-charcoal transition-colors duration-500">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-brand-charcoal">{t.author}</p>
                      <p className="text-xs text-stone-500 uppercase tracking-wide font-medium">{t.role}</p>
                      <p className="text-xs text-brand-gold mt-1">{t.location}</p>
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