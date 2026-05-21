import React, { useState, useEffect, useCallback } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { Button, FadeIn } from '../components/Shared';
import { SEO } from '../components/SEO';
import { ShieldCheck, Globe, Award, Settings, Scissors, HeartPulse, Brain, Bone, Stethoscope, Microscope, ArrowRight, MessageCircle, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import smithLogo from '../assets/smith instruments logo.png';
import manufacturingImg from '../assets/factory/manufacturing.jpeg';

// WHX Miami details
const WHX_WHATSAPP = CONTACT_INFO.phone.replace(/[^0-9]/g, '');
const WHX_EMAIL = CONTACT_INFO.email;
const TARGET_DATE = new Date('2026-06-17T09:00:00-04:00').getTime(); // June 17, 2026 Miami Time

const CAL_NAMESPACE = "snaa-whx";
const CAL_LINK = "mustafakhurram/snaa-whx";

export const WhxMiami: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showSticky, setShowSticky] = useState(false);

  // Initialize Cal.com embed via official React package
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#FF5E00" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

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

  // Track Meta Pixel Lead event on any booking button click
  const trackLead = useCallback(() => {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Lead');
    }
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#0A0A0A] text-stone-300">
      <SEO
        title="WHX Miami 2026 | The Future of Surgical Precision"
        description="Join Smith Instruments (Snaa Industries) at WHX Miami 2026, Booth P55. Witness the pinnacle of OEM manufacturing and premium surgical craftsmanship."
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "WHX Miami 2026 - Smith Instruments Booth P55",
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
            "description": "Smith Instruments exhibiting premium surgical instruments and OEM capabilities at WHX Miami 2026."
          }
        ]}
      />

      {/* 1. CINEMATIC HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/exhibition/DSC_0166.JPG"
            alt="Exhibition Excellence"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black/90" />
        </div>

        <div className="container mx-auto px-6 relative z-10 py-20 text-center flex flex-col items-center">
          <FadeIn>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12 shadow-[0_0_30px_rgba(255,94,0,0.15)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
              </span>
              <span className="text-white text-sm font-medium tracking-widest uppercase">Booth P55 • June 17-19 • Miami</span>
            </div>
            
            <h1 className="font-heading text-6xl md:text-8xl lg:text-[7rem] text-white leading-[0.9] mb-8 tracking-tight">
              PRECISION <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-[#FF8A3D] font-light italic">REDEFINED.</span>
            </h1>
            
            <p className="text-stone-400 text-xl md:text-2xl font-light mb-16 max-w-2xl mx-auto leading-relaxed">
              Experience top-quality surgical manufacturing with <span className="text-white">Snaa Industries</span> at WHX Miami 2026.
            </p>

            {/* Premium Minimalist Countdown */}
            <div className="flex justify-center gap-6 md:gap-12 mb-10">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="font-heading text-4xl md:text-6xl text-white font-light tracking-tighter mb-2">
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  <div className="w-8 h-[1px] bg-brand-orange/50 mb-3" />
                  <span className="text-xs md:text-sm text-stone-500 uppercase tracking-[0.2em]">{unit.label}</span>
                </div>
              ))}
            </div>

            {/* Urgency indicator — shows when within 14 days */}
            {timeLeft.days <= 14 && timeLeft.days > 0 && (
              <div className="flex items-center justify-center gap-2 mb-10 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-pulse">
                <Clock size={14} />
                <span>Limited meeting slots remaining — book now</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
              <button 
                onClick={trackLead}
                data-cal-link={CAL_LINK}
                data-cal-namespace={CAL_NAMESPACE}
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                className="group relative px-8 py-4 bg-brand-orange text-white text-lg font-medium overflow-hidden rounded-md transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center justify-center">
                  <Calendar size={20} className="mr-2" /> Book Exclusive Meeting
                </span>
              </button>
              <button
                onClick={() => window.open(`https://wa.me/${WHX_WHATSAPP}?text=Hi, I'd like to ask a quick question about SNAA Industries at WHX Miami.`, '_blank')}
                className="group relative px-8 py-4 bg-white/5 border border-white/10 hover:border-brand-orange/30 text-white text-lg font-medium overflow-hidden rounded-md transition-transform hover:scale-105"
              >
                <span className="relative flex items-center justify-center text-stone-200 hover:text-white">
                  <MessageCircle size={20} className="mr-2 text-green-500" /> Chat on WhatsApp
                </span>
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. STATS & TRUST BAR */}
      <div className="bg-[#111111] border-y border-white/5 py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { number: "5,000+", label: "Instruments", icon: Settings },
              { number: "40+", label: "Countries Served", icon: Globe },
              { number: "20+", label: "Years Experience", icon: Award },
              { number: "ISO 9001", label: "Certified Quality", icon: ShieldCheck }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <stat.icon size={18} className="text-brand-orange mb-3" />
                <div className="font-heading text-2xl md:text-3xl text-white font-medium tracking-tight">{stat.number}</div>
                <span className="text-stone-500 text-xs uppercase tracking-[0.15em] mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BRAND & HERITAGE (Split Layout) */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <h2 className="font-heading text-4xl md:text-5xl text-white mb-8 leading-tight">
                  Two Decades of <br/>
                  <span className="text-brand-orange">Uncompromising Quality.</span>
                </h2>
                <div className="w-16 h-1 bg-brand-orange mb-8" />
                <p className="text-stone-400 text-lg md:text-xl font-light leading-relaxed mb-8">
                  Exhibiting proudly under our manufacturing parent company, <strong className="text-white font-medium">Snaa Industries</strong>, Smith Instruments brings the world's finest surgical grade stainless steel directly from Sialkot to the global stage.
                </p>
                <ul className="space-y-6">
                  {[
                    "Direct manufacturer pricing without middlemen",
                    "Customized product development capabilities",
                    "Rigorous ISO-certified quality control",
                    "Scalable production for global brands"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                      </div>
                      <span className="text-stone-300 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <FadeIn delay={0.2}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img src="/images/exhibition/DSC_0161.JPG" alt="Exhibition Setup" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
                </div>
                {/* Floating Logo Badge */}
                <div className="absolute -bottom-10 -left-10 bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                  <img src={smithLogo} alt="Smith Instruments" className="h-12 w-auto brightness-0 invert opacity-80" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAPABILITIES GRID (Dark Glassmorphism) */}
      <section className="py-24 bg-[#111111] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-brand-orange text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Our Expertise</span>
            <h2 className="font-heading text-4xl md:text-5xl text-white">Mastering Every Discipline</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Scissors, title: "Plastic Surgery", desc: "Delicate instruments crafted for intricate reconstructive procedures." },
              { icon: HeartPulse, title: "Cardiovascular", desc: "High-precision tools engineered for critical cardiac care." },
              { icon: Brain, title: "Neurosurgery", desc: "Microsurgical instruments with zero tolerance for error." },
              { icon: Bone, title: "Orthopedics", desc: "Heavy-duty, perfectly balanced solutions for bone surgery." },
              { icon: Stethoscope, title: "ENT", desc: "Specialized, precision tools for ear, nose, and throat procedures." },
              { icon: Microscope, title: "Custom Development", desc: "From concept to prototype to mass production." }
            ].map((cat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group bg-white/5 border border-white/5 hover:border-brand-orange/30 p-10 rounded-2xl transition-all duration-500 hover:bg-white/10 backdrop-blur-sm h-full">
                  <cat.icon size={32} className="text-stone-500 group-hover:text-brand-orange transition-colors mb-6" strokeWidth={1} />
                  <h3 className="font-heading text-2xl text-white mb-4">{cat.title}</h3>
                  <p className="text-stone-400 font-light leading-relaxed">{cat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OEM & B2B SOLUTIONS */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <span className="text-brand-orange text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Manufacturing Partners</span>
              <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">OEM & Private Label Services</h2>
              <p className="text-stone-400 text-lg md:text-xl font-light leading-relaxed mb-10">
                Build your own brand with our manufacturing backbone. We offer comprehensive white-labeling solutions tailored for distributors and regional brands.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Custom Logo Laser Engraving",
                  "Bespoke Packaging Design",
                  "New Product R&D",
                  "Exclusive Regional Agreements"
                ].map((service, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-sm">
                    <Settings className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="text-stone-300 font-medium text-sm sm:text-base">{service}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <button 
                  onClick={trackLead}
                  data-cal-link={CAL_LINK}
                  data-cal-namespace={CAL_NAMESPACE}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0A0A0A] hover:bg-stone-200 border-transparent shadow-xl rounded-md font-semibold text-lg transition-colors"
                >
                  Discuss Private Labeling <ArrowRight size={18} className="ml-2 inline" />
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <FadeIn delay={0.2}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                  <img src={manufacturingImg} alt="OEM Manufacturing Facility" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY VISIT BOOTH P55 */}
      <section className="py-24 bg-[#111111] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">Why Visit Booth P55?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Touch & Feel", desc: "Experience the weight, balance, and precision of our instruments firsthand." },
              { num: "02", title: "Evaluation Samples", desc: "Select distributors may secure complimentary test samples for hands-on quality assessment." },
              { num: "03", title: "Meet Leadership", desc: "Speak directly with our technical directors and manufacturing heads." },
              { num: "04", title: "Event Pricing", desc: "Unlock exclusive volume pricing available only during WHX Miami 2026." }
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative overflow-hidden h-full hover:bg-white/10 transition-colors flex flex-col justify-between">
                  <div className="text-8xl font-heading text-white/[0.03] absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none select-none font-bold">{step.num}</div>
                  <div>
                    <h3 className="font-heading text-xl text-white mb-3 relative z-10">{step.title}</h3>
                    <p className="text-stone-400 relative z-10 font-light">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. IMMERSIVE GALLERY */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">A Glimpse of the Standard</h2>
            <p className="text-stone-400 text-lg">Highlights from our previous global exhibitions.</p>
          </div>
          <div className="hidden md:flex gap-8 text-stone-500 text-sm uppercase tracking-widest font-semibold mt-6 md:mt-0">
            <span className="flex items-center gap-2"><Globe size={16}/> Global</span>
            <span className="flex items-center gap-2"><Award size={16}/> Certified</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="w-full px-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 aspect-[16/10] overflow-hidden rounded-xl group relative">
            <img src="/images/exhibition/DSC_0165.JPG" alt="SNAA Industries exhibition booth" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="aspect-[4/5] md:aspect-auto overflow-hidden rounded-xl group relative">
            <img src="/images/exhibition/DSC_0226.JPG" alt="Surgical instruments on display" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="aspect-[4/5] md:aspect-auto overflow-hidden rounded-xl group relative">
            <img src="/images/exhibition/DSC_0232.JPG" alt="Client engagement at booth" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>
      </section>

      {/* 8. THE FINAL INVITATION */}
      <section className="py-32 bg-brand-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/exhibition/DSC_0234.JPG')] bg-cover bg-center mix-blend-multiply opacity-20" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <h2 className="font-heading text-5xl md:text-7xl text-white mb-8 tracking-tight">Claim Your Time.</h2>
            <p className="text-white/90 text-xl md:text-2xl font-light mb-12 max-w-3xl mx-auto leading-relaxed">
              Our calendar for WHX Miami 2026 is strictly limited. Book a dedicated slot to explore private labeling, discuss bulk pricing, and you may secure your evaluation samples.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={trackLead}
                data-cal-link={CAL_LINK}
                data-cal-namespace={CAL_NAMESPACE}
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                className="inline-flex items-center justify-center bg-white text-brand-orange hover:bg-stone-100 px-10 py-5 text-lg font-bold rounded-md transition-colors"
              >
                <Calendar size={24} className="mr-3" />
                Book Meeting Calendar
              </button>
              <button 
                onClick={() => {
                  if (typeof (window as any).fbq === 'function') {
                    (window as any).fbq('track', 'Lead');
                  }
                  window.open(`https://wa.me/${WHX_WHATSAPP}?text=Hi, I want to confirm a meeting slot for WHX Miami.`, '_blank');
                }} 
                className="inline-flex items-center justify-center bg-transparent border border-white/50 text-white hover:bg-white/10 hover:border-white px-10 py-5 text-lg font-bold rounded-md transition-colors"
              >
                <MessageCircle size={24} className="mr-3" />
                Connect on WhatsApp
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* GLASSY STICKY MOBILE CTA */}
      <div className={`fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 shadow-2xl transition-transform duration-500 z-50 md:hidden ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (typeof (window as any).fbq === 'function') {
                (window as any).fbq('track', 'Lead');
              }
              window.open(`https://wa.me/${WHX_WHATSAPP}?text=Hi, I'd like to book a meeting at WHX Miami.`, '_blank');
            }} 
            className="flex-grow bg-brand-orange text-white py-3 px-2 flex justify-center items-center text-sm font-semibold rounded-md"
          >
            <MessageCircle size={16} className="mr-2" /> WhatsApp
          </button>
          <button 
            onClick={trackLead}
            data-cal-link={CAL_LINK}
            data-cal-namespace={CAL_NAMESPACE}
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="flex-grow bg-white/10 text-white border border-white/20 py-3 px-2 flex justify-center items-center text-sm font-semibold rounded-md"
          >
            <Calendar size={16} className="mr-2" /> Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};
