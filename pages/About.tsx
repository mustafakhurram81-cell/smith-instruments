import React from 'react';
import { Section, FadeIn, Button } from '../components/Shared';
import { Target, Globe, Award, Users, Zap, Heart, CheckCircle2, PenTool, Handshake, MessageCircle, Hammer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      {/* 1. CINEMATIC HERO */}
      <div className="relative h-[80vh] flex items-center justify-center bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-50">
           {/* Close up of steel instruments - texture */}
           <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=2000" alt="Steel Texture" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/60 via-brand-charcoal/80 to-stone-50"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center mt-20">
          <FadeIn>
            <span className="text-brand-gold uppercase tracking-[0.3em] text-sm font-bold mb-4 block">Est. 2002 &bull; USA Based</span>
            <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 tracking-tight">Defining Precision</h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-brand-gold opacity-90 max-w-2xl mx-auto">
              In-house manufacturing. 50+ Artisans. One standard of excellence.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* 2. THE STORY (Editorial Split) */}
      <section className="bg-stone-50 pb-32 -mt-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            {/* Image Column - Sticky */}
            <div className="lg:w-5/12 lg:sticky lg:top-32">
               <FadeIn>
                 <div className="relative rounded-sm overflow-hidden shadow-2xl border-8 border-white">
                    <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000" alt="Precision Manufacturing" className="w-full h-auto" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <p className="font-serif italic">"We don't outsource quality. We create it."</p>
                    </div>
                 </div>
               </FadeIn>
            </div>

            {/* Text Content */}
            <div className="lg:w-7/12 pt-10">
              <FadeIn delay={0.2}>
                <span className="text-brand-gold uppercase tracking-[0.2em] text-sm font-bold mb-4 block">Our Heritage</span>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-8 leading-tight">Molding the Metal<br/> to Serve Life.</h2>
                
                <div className="space-y-6 text-stone-600 text-lg font-light leading-relaxed">
                    <p>
                        Since 2002, Smith Instruments has stood as a pillar of reliability in the surgical instruments industry. Based in the USA, we have carved a niche in providing precision tools specifically for <strong>Plastic and Reconstructive surgery</strong>.
                    </p>
                    <p>
                        Unlike many suppliers who act as middlemen, we are <strong>manufacturers at heart</strong>. With a facility equipped with state-of-the-art machinery and a dedicated team of over 50 skilled employees, we maintain complete control over our production line. This allows us to ensure that every scalpel, forcep, and retractor meets the rigorous demands of the modern operating theater.
                    </p>
                    <div className="p-6 bg-white border-l-4 border-brand-gold shadow-sm my-8">
                        <p className="text-brand-charcoal font-serif text-xl italic">
                            "We focus especially on serving the growing needs of the South American market, delivering reliable instruments to professionals in Brazil, Argentina, and Chile who value precision."
                        </p>
                    </div>
                    <p>
                        Our dedication to craftsmanship is backed by two decades of industry expertise. We don't just follow standards; we set them, ensuring safety and performance in every procedure.
                    </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE TRUST MODEL (Unique Selling Point) */}
      <section className="bg-brand-charcoal py-32 text-white relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="w-96 h-96 border-[40px] border-white rounded-full absolute -top-20 -left-20"></div>
            <div className="w-96 h-96 border-[40px] border-white rounded-full absolute -bottom-20 -right-20"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10 text-center">
            <FadeIn>
                <Handshake className="w-20 h-20 text-brand-gold mx-auto mb-8" strokeWidth={1} />
                <h2 className="font-serif text-4xl md:text-6xl mb-8">Our Philosophy: <br/>Trust Before Payment.</h2>
                <p className="text-xl md:text-2xl font-light text-stone-300 max-w-3xl mx-auto leading-relaxed mb-12">
                   What truly sets us apart is our belief in earning your trust. <br/>
                   <span className="text-white font-normal border-b border-brand-gold pb-1">You only pay after receiving your instruments and being completely satisfied.</span>
                </p>
                <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto mt-16">
                    <div className="bg-white/5 p-8 border border-white/10 rounded-sm">
                        <CheckCircle2 className="text-brand-gold mb-4" />
                        <h4 className="font-serif text-xl mb-2">Inspect First</h4>
                        <p className="text-sm text-stone-400">Receive your order and inspect the quality firsthand in your own facility.</p>
                    </div>
                    <div className="bg-white/5 p-8 border border-white/10 rounded-sm">
                        <ShieldCheck className="text-brand-gold mb-4" />
                        <h4 className="font-serif text-xl mb-2">Zero Risk</h4>
                        <p className="text-sm text-stone-400">If it doesn't meet your standards, simply return it. No questions asked.</p>
                    </div>
                    <div className="bg-white/5 p-8 border border-white/10 rounded-sm">
                        <Heart className="text-brand-gold mb-4" />
                        <h4 className="font-serif text-xl mb-2">Long-term Partners</h4>
                        <p className="text-sm text-stone-400">This model reflects our confidence in our quality and our commitment to you.</p>
                    </div>
                </div>
            </FadeIn>
         </div>
      </section>

      {/* 4. OEM & CUSTOMIZATION */}
      <Section className="bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
             <div className="w-full md:w-1/2 order-2 md:order-1">
                <FadeIn>
                    <span className="text-stone-400 uppercase tracking-widest text-xs font-bold">Bespoke Manufacturing</span>
                    <h2 className="font-serif text-4xl text-brand-charcoal mt-3 mb-6">Customization & OEM</h2>
                    <p className="text-stone-600 font-light text-lg mb-6">
                        At Smith Instruments, we understand that no two clients are the same. Whether you require modifications to an existing pattern or the development of an entirely new instrument from a napkin sketch, we are your partners in innovation.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-brand-charcoal">
                            <PenTool size={20} className="text-brand-gold" /> Private Labeling (Your Brand, Our Quality)
                        </li>
                        <li className="flex items-center gap-3 text-brand-charcoal">
                            <Hammer size={20} className="text-brand-gold" /> Prototyping & Development
                        </li>
                        <li className="flex items-center gap-3 text-brand-charcoal">
                            <Users size={20} className="text-brand-gold" /> Client-Specific Modifications
                        </li>
                    </ul>
                    <Button variant="secondary" onClick={() => navigate('/contact')}>Start a Custom Project</Button>
                </FadeIn>
             </div>
             <div className="w-full md:w-1/2 order-1 md:order-2">
                <FadeIn delay={0.2}>
                   <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" alt="Engineering Blueprint" className="rounded-sm shadow-xl" />
                </FadeIn>
             </div>
          </div>
        </div>
      </Section>

      {/* 5. DIRECT CONNECTION (No Portals) */}
      <section className="bg-white py-24 border-t border-stone-100">
          <div className="container mx-auto px-6 text-center">
             <FadeIn>
                 <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-6">Human Connection, Not Portals.</h2>
                 <p className="text-stone-500 font-light max-w-2xl mx-auto mb-10 text-lg">
                    We don’t use complicated portals or automated tickets. You can place orders or start a product inquiry simply by talking to us. Our team is quick to respond and ready to guide you.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                     <Button variant="primary" className="flex items-center gap-2" onClick={() => window.open('https://wa.me/923302449855', '_blank')}>
                        <MessageCircle size={20} /> Chat on WhatsApp
                     </Button>
                     <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/contact')}>
                        Contact via Email
                     </Button>
                 </div>
             </FadeIn>
          </div>
      </section>

    </div>
  );
};

// Simple Icon component helper for the Trust section if needed
import { ShieldCheck } from 'lucide-react';