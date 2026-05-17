import React, { useState, useEffect } from 'react';
import { Button, FadeIn } from '../components/Shared';
import { SEO } from '../components/SEO';
import { Clock, ShieldCheck, Globe, Award, Settings, Package, Users, Scissors, HeartPulse, Brain, Bone, Stethoscope, Microscope, ArrowRight, MessageCircle, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import heroMethods from '../assets/hero-premium.png';
import legacyImg from '../assets/factory/legacy.jpeg';
import artisan1 from '../assets/factory/artisan-1.jpeg';
import workshopExtra from '../assets/factory/workshop-extra.jpeg';

// You can customize these if you get specific WHX Miami details
const WHX_WHATSAPP = CONTACT_INFO.phone.replace(/[^0-9]/g, '');
const WHX_EMAIL = CONTACT_INFO.email;
const TARGET_DATE = new Date('2026-06-17T09:00:00-04:00').getTime(); // June 17, 2026 Miami Time

export const WhxMiami: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="overflow-x-hidden bg-stone-50">
      <SEO
        title="WHX Miami 2026 | Snaa Industries (Smith Instruments)"
        description="Meet Snaa Industries (Smith Instruments) at WHX Miami 2026, Booth P55. Explore OEM manufacturing, private labeling, and premium surgical instruments. Book a meeting for free test samples."
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "WHX Miami 2026 - Snaa Industries Booth P55",
            "startDate": "2026-06-17",
            "endDate": "2026-06-19",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "Place",
              "name": "Miami Beach Convention Centre",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Miami Beach",
                "addressRegion": "FL",
                "addressCountry": "US"
              }
            },
            "description": "Snaa Industries (Smith Instruments) exhibiting premium surgical instruments and OEM capabilities at WHX Miami 2026."
          }
        ]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-brand-charcoal overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={heroMethods}
            alt="Surgical Instruments Background"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/80 via-brand-charcoal/60 to-brand-charcoal" />
        </div>

        <div className="container mx-auto px-6 relative z-10 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-sm font-semibold mb-8">
                <Package size={16} />
                <span>Free Test Samples Available for Distributors</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-white leading-tight mb-6">
                Meet Us at <span className="text-brand-orange">WHX Miami 2026</span>
              </h1>
              
              <p className="text-stone-300 text-lg md:text-xl font-light mb-8">
                Snaa Industries (Smith Instruments) • Booth P55<br />
                June 17–19 • Miami Beach Convention Centre
              </p>

              {/* Countdown Timer */}
              <div className="flex justify-center gap-3 md:gap-6 mb-10">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((unit, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mb-2">
                      <span className="font-heading text-2xl md:text-4xl text-white">{unit.value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs md:text-sm text-stone-400 uppercase tracking-wider">{unit.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={() => window.open(`https://wa.me/${WHX_WHATSAPP}?text=Hi, I'd like to book a meeting at WHX Miami (Booth P55) and claim my free test samples.`, '_blank')} 
                  variant="primary" 
                  className="px-8 py-4 text-base md:text-lg flex items-center justify-center shadow-lg shadow-brand-orange/20"
                >
                  <MessageCircle size={20} className="mr-2" />
                  WhatsApp Us
                </Button>
                <Button 
                  onClick={() => window.location.href = `mailto:${WHX_EMAIL}?subject=Meeting at WHX Miami 2026 - Booth P55`} 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-brand-charcoal px-8 py-4 text-base md:text-lg flex items-center justify-center"
                >
                  <Calendar size={20} className="mr-2" />
                  Book a Meeting
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {[
              { icon: Settings, text: "OEM Manufacturing" },
              { icon: Package, text: "Private Label" },
              { icon: Globe, text: "Global Export" },
              { icon: Award, text: "20+ Years" },
              { icon: ShieldCheck, text: "ISO Quality" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon size={20} className="text-brand-charcoal" />
                <span className="font-semibold text-brand-charcoal text-sm uppercase tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ABOUT / WHO WE ARE */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2 relative">
              <FadeIn>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src={legacyImg} alt="Sialkot Manufacturing Facility" className="w-full h-[500px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <p className="text-white text-lg font-medium">World-class manufacturing facilities in Sialkot, Pakistan</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="w-full md:w-1/2">
              <FadeIn delay={0.2}>
                <h2 className="font-heading text-3xl md:text-5xl text-brand-charcoal mb-6">
                  Snaa Industries <br />
                  <span className="text-stone-400 text-2xl md:text-4xl">a division of Smith Instruments</span>
                </h2>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-6">
                  With over two decades of expertise, we bring the world's finest surgical grade stainless steel instruments directly from the manufacturing capital of Sialkot, Pakistan, to global distributors and OEM buyers.
                </p>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-8">
                  Exhibiting under <strong className="font-semibold text-brand-charcoal">Snaa Industries</strong> at WHX Miami, we are actively looking for reliable partners, importers, and procurement managers seeking unparalleled quality, competitive pricing, and flexible customization.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Direct manufacturer pricing without middlemen",
                    "Customized product development capabilities",
                    "Rigorous quality control processes",
                    "Scalable production for bulk orders"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0" />
                      <span className="text-stone-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-4">Precision Product Range</h2>
            <p className="text-stone-500 text-lg">Explore a sample of the categories we'll be showcasing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Scissors, title: "Plastic Surgery", desc: "Delicate instruments for reconstructive procedures." },
              { icon: HeartPulse, title: "Cardiovascular", desc: "High-precision tools for cardiac care." },
              { icon: Brain, title: "Neurosurgery", desc: "Microsurgical instruments for complex operations." },
              { icon: Bone, title: "Orthopedics", desc: "Heavy-duty solutions for bone surgery." },
              { icon: Stethoscope, title: "ENT", desc: "Specialized tools for ear, nose, and throat." },
              { icon: Microscope, title: "General Surgery", desc: "Essential instruments for daily hospital use." }
            ].map((cat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-stone-50 border border-stone-100 p-8 rounded-2xl hover:border-brand-orange/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:text-brand-orange transition-colors">
                    <cat.icon size={28} className="text-stone-700 group-hover:text-brand-orange transition-colors" />
                  </div>
                  <h3 className="font-heading text-xl text-brand-charcoal mb-3">{cat.title}</h3>
                  <p className="text-stone-500 font-light leading-relaxed">{cat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OEM / PRIVATE LABEL */}
      <section className="py-20 md:py-32 bg-brand-charcoal relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <img src={artisan1} alt="Craftsmanship" className="w-full h-full object-cover mask-image-gradient" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-brand-orange font-bold text-xs tracking-widest uppercase mb-4 block">B2B Solutions</span>
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">OEM & Private Label Services</h2>
            <p className="text-stone-400 text-lg md:text-xl font-light leading-relaxed mb-10">
              Build your own brand with our manufacturing backbone. We offer comprehensive white-labeling solutions tailored for distributors and regional brands.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "Custom Logo Laser Engraving",
                "Bespoke Packaging Design",
                "New Product R&D",
                "Exclusive Regional Agreements"
              ].map((service, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <Settings className="w-5 h-5 text-brand-orange" />
                  <span className="text-white font-medium">{service}</span>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Button 
                onClick={() => window.open(`https://wa.me/${WHX_WHATSAPP}?text=I am interested in OEM/Private Label services. Let's discuss at WHX Miami.`, '_blank')} 
                variant="primary"
                className="px-8 py-4"
              >
                Discuss Private Labeling <ArrowRight size={18} className="ml-2 inline" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY VISIT BOOTH P55 */}
      <section className="py-20 bg-stone-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-4">Why Visit Booth P55?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Touch & Feel", desc: "Experience the weight, balance, and precision of our instruments firsthand." },
              { num: "02", title: "Free Samples", desc: "Select distributors can take home free test samples for quality evaluation." },
              { num: "03", title: "Meet Leadership", desc: "Speak directly with our technical directors and manufacturing heads." },
              { num: "04", title: "Event Pricing", desc: "Unlock exclusive volume pricing available only during WHX Miami 2026." }
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/50 relative overflow-hidden h-full">
                  <div className="text-7xl font-heading text-stone-100 absolute -top-4 -right-4 pointer-events-none select-none">{step.num}</div>
                  <h3 className="font-heading text-xl text-brand-charcoal mb-3 relative z-10">{step.title}</h3>
                  <p className="text-stone-500 relative z-10">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GALLERY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group overflow-hidden rounded-2xl h-[300px]">
              <img src={legacyImg} alt="Factory 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="group overflow-hidden rounded-2xl h-[300px]">
              <img src={artisan1} alt="Craftsmanship" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="group overflow-hidden rounded-2xl h-[300px]">
              <img src={workshopExtra} alt="Factory 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-24 bg-brand-orange text-white text-center px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full font-semibold tracking-wide uppercase text-sm mb-6 border border-white/30 backdrop-blur-sm">
              Limited Availability
            </span>
            <h2 className="font-heading text-4xl md:text-6xl mb-6">Secure Your Meeting Slot</h2>
            <p className="text-white/90 text-xl font-light mb-10 max-w-2xl mx-auto">
              Our schedule for WHX Miami 2026 is filling up fast. Book your meeting now to guarantee time with our team and claim your free test samples.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => window.open(`https://wa.me/${WHX_WHATSAPP}?text=Hi, I want to confirm a meeting slot for WHX Miami.`, '_blank')} 
                className="bg-white text-brand-orange hover:bg-stone-100 px-8 py-4 text-lg border-transparent shadow-xl"
              >
                <MessageCircle size={20} className="mr-2" />
                WhatsApp Us Now
              </Button>
              <Button 
                onClick={() => window.location.href = `mailto:${WHX_EMAIL}?subject=Urgent: Booking Meeting for WHX Miami`} 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-orange px-8 py-4 text-lg"
              >
                <Calendar size={20} className="mr-2" />
                Email Sales Team
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STICKY MOBILE CTA */}
      <div className={`fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 p-4 shadow-2xl transition-transform duration-300 z-50 md:hidden ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex gap-3">
          <Button 
            onClick={() => window.open(`https://wa.me/${WHX_WHATSAPP}?text=Hi, I'd like to book a meeting at WHX Miami.`, '_blank')} 
            variant="primary" 
            className="flex-1 py-3 px-2 flex justify-center items-center text-sm"
          >
            <MessageCircle size={16} className="mr-1" /> WhatsApp
          </Button>
          <Button 
            onClick={() => window.location.href = `mailto:${WHX_EMAIL}?subject=Meeting at WHX Miami 2026`} 
            variant="outline" 
            className="flex-1 py-3 px-2 flex justify-center items-center text-sm"
          >
            <Calendar size={16} className="mr-1" /> Email Us
          </Button>
        </div>
      </div>
    </div>
  );
};
