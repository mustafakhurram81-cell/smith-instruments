import React from 'react';
import { SEO } from '../components/SEO';
import { FadeIn, Button } from '../components/Shared';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MessageCircle, Mail, MapPin, 
  Settings, Award, Globe, Scissors, Activity,
  Stethoscope, Shield, PenTool, Factory, Box, CheckCircle2, Search, ArrowRight
} from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '../constants';

// Images
import heroMethods from '../assets/hero-premium.png';
import legacyImg from '../assets/factory/legacy.jpeg';
import artisan1 from '../assets/factory/artisan-1.jpeg';
import workshopExtra from '../assets/factory/workshop-extra.jpeg';

const CATEGORIES = [
  { id: 1, name: "Plastic Surgery", icon: Scissors, desc: "Precision instruments for reconstructive and aesthetic procedures." },
  { id: 2, name: "General Surgery", icon: Activity, desc: "Essential, high-durability tools for daily operating room needs." },
  { id: 3, name: "Orthopedic", icon: Settings, desc: "Heavy-duty, precision-engineered solutions for bone surgery." },
  { id: 4, name: "ENT", icon: Stethoscope, desc: "Delicate instruments designed for ear, nose, and throat specialists." },
  { id: 5, name: "Dental", icon: Search, desc: "Premium dental extraction, diagnostic, and surgical tools." },
  { id: 6, name: "Beauty Instruments", icon: SparklesIcon, desc: "Professional-grade tools for clinical beauty and aesthetic practices." },
];

function SparklesIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
    );
}

export const WhxMiami: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="font-opensans bg-white text-gray-800">
      <SEO
        title="Meet Us at WHX Miami 2026 | Smith Instruments"
        description="Join Smith Instruments (exhibiting as Snaa Industries) at WHX Miami. We manufacture precision surgical instruments, offering OEM, private label, and custom solutions for global healthcare markets."
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-gray-50 overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <img
            src={heroMethods}
            alt="Premium Surgical Instruments Manufacturing"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-semibold tracking-wide mb-6 border border-brand-orange/20 backdrop-blur-md">
                <MapPin size={16} /> WHX Miami 2026 — Exhibiting as Snaa Industries
              </div>
              <h1 className="font-montserrat text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
                Precision-Crafted <br/> <span className="text-brand-orange">Surgical Excellence</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-4">
                Meet Smith Instruments at WHX Miami 2026.
              </p>
              <p className="text-lg text-gray-500 mb-10 font-medium">
                OEM • Private Label • Custom Manufacturing
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#book-meeting" className="inline-flex items-center justify-center px-8 py-4 bg-brand-orange text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-[0_4px_20px_rgba(255,107,0,0.3)] hover:shadow-[0_8px_30px_rgba(255,107,0,0.4)] hover:-translate-y-1">
                  <Calendar size={20} className="mr-2" /> Book a Meeting
                </a>
                <a href={`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 border border-gray-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                  <MessageCircle size={20} className="mr-2 text-green-500" /> WhatsApp Us
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-[20%] w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-white border-y border-gray-100 py-8 relative z-20 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4 text-gray-500 font-medium text-sm md:text-base">
            <div className="flex items-center gap-2"><Factory size={20} className="text-brand-orange" /> OEM Manufacturing</div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2"><Shield size={20} className="text-brand-orange" /> Private Label</div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2"><Globe size={20} className="text-brand-orange" /> Global Export</div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2"><Settings size={20} className="text-brand-orange" /> Precision Engineering</div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-brand-orange" /> Quality Control</div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT COMPANY SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-orange/10 translate-x-4 translate-y-4 rounded-3xl" />
                  <img src={artisan1} alt="Manufacturing Facility" className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-xl" />
                  
                  {/* Floating glassmorphism card */}
                  <div className="absolute -bottom-8 -left-8 z-20 bg-white/80 backdrop-blur-lg border border-white/40 p-6 rounded-2xl shadow-xl max-w-xs">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                        <Award className="text-brand-orange" size={24} />
                      </div>
                      <div>
                        <h4 className="font-montserrat font-bold text-gray-900">Sialkot, Pakistan</h4>
                        <p className="text-sm text-gray-500">Manufacturing Hub</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div className="w-full lg:w-1/2">
              <FadeIn delay={0.2}>
                <span className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-4 block">Manufactured with Precision</span>
                <h2 className="font-montserrat text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Global Partner in Surgical Solutions
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6 font-light">
                  Smith Instruments is a premier surgical instruments manufacturer based in Sialkot, Pakistan. We specialize in engineering high-quality surgical solutions for international distributors, clinics, and healthcare markets worldwide.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {['In-house manufacturing', 'Experienced workforce', 'Modern machinery', 'OEM & Private labeling'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-brand-orange shrink-0" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                
                <a href="#categories" className="inline-flex items-center text-brand-orange font-semibold hover:text-orange-600 transition-colors">
                  Explore our specialties <ArrowRight size={18} className="ml-2" />
                </a>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATEGORIES SECTION */}
      <section id="categories" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-montserrat text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Instrument Categories</h2>
            <p className="text-gray-500 text-lg font-light">Explore our comprehensive range of precision instruments designed to meet the rigorous demands of modern healthcare.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <FadeIn key={cat.id} delay={idx * 0.1}>
                <div className="group bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-brand-orange/30 hover:bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,107,0,0.08)] hover:-translate-y-2 h-full flex flex-col">
                  <div className="w-16 h-16 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <cat.icon size={32} className="text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-montserrat text-2xl font-bold text-gray-900 mb-3">{cat.name}</h3>
                  <p className="text-gray-500 leading-relaxed font-light flex-grow">{cat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OEM / PRIVATE LABEL SECTION */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange/5 blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <h2 className="font-montserrat text-4xl md:text-5xl font-bold mb-6">Your OEM Manufacturing Partner</h2>
                <p className="text-gray-300 text-lg font-light leading-relaxed mb-10">
                  Scale your brand with our world-class manufacturing infrastructure. We provide end-to-end OEM and private labeling solutions tailored to your brand's specifications.
                </p>
                
                <div className="space-y-6">
                  {[
                    { title: "Private Labeling & Logo Engraving", icon: PenTool },
                    { title: "Custom Instrument Development", icon: Settings },
                    { title: "Packaging Customization", icon: Box },
                    { title: "Bulk Production & Distributor Support", icon: Globe }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-brand-orange/20 flex items-center justify-center shrink-0">
                        <feature.icon className="text-brand-orange" size={24} />
                      </div>
                      <div>
                        <h4 className="font-montserrat font-bold text-lg">{feature.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            
            <div className="w-full lg:w-1/2">
              <FadeIn delay={0.2}>
                 <img src={legacyImg} alt="OEM Manufacturing" className="w-full h-auto rounded-3xl shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700" />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY VISIT US AT WHX SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-4 block">Event Focus</span>
            <h2 className="font-montserrat text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Meet Us at WHX Miami?</h2>
            <p className="text-gray-500 text-lg font-light">Connect directly with our manufacturing experts and discover how we can elevate your supply chain.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Explore New Collections", desc: "Get hands-on experience with our latest precision instruments." },
              { title: "Discuss OEM Opportunities", desc: "Plan your private label strategy with our production heads." },
              { title: "Experience Our Quality", desc: "Feel the balance, weight, and finish of our German stainless steel tools." },
              { title: "Build Partnerships", desc: "Establish direct relationships for better pricing and priority support." }
            ].map((card, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-orange/30 hover:shadow-lg transition-all h-full text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-brand-orange/10 flex items-center justify-center mb-6 text-brand-orange font-bold">
                    0{idx + 1}
                  </div>
                  <h4 className="font-montserrat font-bold text-gray-900 mb-3">{card.title}</h4>
                  <p className="text-gray-500 font-light text-sm">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GALLERY SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-montserrat text-4xl font-bold text-gray-900 mb-4">Inside Our Facilities</h2>
              <p className="text-gray-500 font-light max-w-xl">A glimpse into our manufacturing process, where modern machinery meets master craftsmanship.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[artisan1, workshopExtra, legacyImg].map((img, idx) => (
              <FadeIn key={idx} delay={idx * 0.2}>
                <div className="overflow-hidden rounded-2xl group cursor-pointer relative h-[300px]">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={img} 
                    alt={`Manufacturing process ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section id="book-meeting" className="py-24 bg-brand-orange relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center max-w-4xl mx-auto text-white">
            <h2 className="font-montserrat text-4xl md:text-5xl font-bold mb-6">Let's Meet in Miami</h2>
            <p className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
              Schedule a meeting with our team during WHX Miami and explore precision surgical solutions tailored to your market.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={`mailto:${CONTACT_INFO.email}?subject=WHX Miami 2026 Meeting Request`} className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-orange font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-1">
                <Calendar size={20} className="mr-2" /> Book Appointment
              </a>
              <a href={`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all hover:-translate-y-1">
                <MessageCircle size={20} className="mr-2" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONTACT & 10. FOOTER SECTION */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/favicon.svg" alt="Smith Instruments Logo" className="w-10 h-10 brightness-0 invert" />
                <h3 className="font-montserrat text-2xl font-bold tracking-wide">SMITH<span className="font-light">INSTRUMENTS</span></h3>
              </div>
              <p className="text-gray-400 font-light max-w-md mb-6 leading-relaxed">
                Premium manufacturer of precision surgical instruments. Exhibiting as Snaa Industries at WHX Miami 2026.
              </p>
              <div className="flex items-center gap-4 text-gray-400">
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">LinkedIn</a>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">Instagram</a>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">Facebook</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-montserrat font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-gray-400 font-light">
                <li className="flex items-center gap-3"><Mail size={18} className="text-brand-orange" /> {CONTACT_INFO.email}</li>
                <li className="flex items-center gap-3"><MessageCircle size={18} className="text-brand-orange" /> {CONTACT_INFO.phone}</li>
                <li className="flex items-start gap-3"><MapPin size={18} className="text-brand-orange shrink-0 mt-1" /> <span>{CONTACT_INFO.locations[0].address}</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-montserrat font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400 font-light">
                <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Main Website</button></li>
                <li><button onClick={() => navigate('/products')} className="hover:text-white transition-colors">Full Catalog</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Smith Instruments</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-light">
            <p>&copy; {new Date().getFullYear()} Smith Instruments. All rights reserved.</p>
            <p>See you at WHX Miami 2026!</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
