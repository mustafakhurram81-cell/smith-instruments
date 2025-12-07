import React from 'react';
import { Section, FadeIn, Button } from '../components/Shared';
import { SEO } from '../components/SEO';
import { Users, Heart, CheckCircle2, PenTool, Handshake, MessageCircle, Hammer, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aboutHero from '../assets/about-hero.png';
import aboutCraftsmanship from '../assets/about-craftsmanship.png';
import aboutQuality from '../assets/about-quality.png';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="About Us"
        description="Learn about Smith Instruments' 20+ years of heritage in manufacturing precision surgical tools using German stainless steel."
      />

      {/* 1. CINEMATIC HERO */}
      <div className="relative h-[60vh] flex items-center justify-center bg-brand-charcoal overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={aboutHero}
            alt="Precision Manufacturing"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/60 via-brand-charcoal/40 to-brand-charcoal" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center mt-20">
          <FadeIn>
            <span className="text-brand-gold uppercase tracking-[0.3em] text-sm font-bold mb-4 block">Est. 2002 • USA Based</span>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 tracking-tight">Defining Precision</h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-stone-300 max-w-2xl mx-auto">
              In-house manufacturing. 50+ Artisans. One standard of excellence.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* 2. THE STORY (Editorial Split) */}
      <section className="bg-stone-50 py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image - Now properly centered and sized */}
            <div className="lg:w-5/12">
              <FadeIn>
                <div className="relative">
                  {/* Decorative accent */}
                  <div className="absolute -top-4 -left-4 w-full h-full bg-brand-gold/20 rounded-lg" />
                  <div className="relative rounded-lg overflow-hidden shadow-2xl">
                    <img
                      src={aboutCraftsmanship}
                      alt="Precision Manufacturing"
                      className="w-full h-auto"
                    />
                  </div>
                  {/* Quote overlay */}
                  <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl max-w-[200px]">
                    <p className="font-serif text-brand-charcoal text-sm italic">
                      "We don't outsource quality. We create it."
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Content */}
            <div className="lg:w-7/12">
              <FadeIn delay={0.2}>
                <span className="text-brand-gold uppercase tracking-[0.2em] text-sm font-bold mb-4 block">Our Heritage</span>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-8 leading-tight">Molding the Metal<br />to Serve Life.</h2>

                <div className="space-y-6 text-stone-600 text-lg font-light leading-relaxed">
                  <p>
                    Since 2002, Smith Instruments has stood as a pillar of reliability in the surgical instruments industry. Based in the USA, we have carved a niche in providing precision tools specifically for <strong className="text-brand-charcoal">Plastic and Reconstructive surgery</strong>.
                  </p>
                  <p>
                    Unlike many suppliers who act as middlemen, we are <strong className="text-brand-charcoal">manufacturers at heart</strong>. With a facility equipped with state-of-the-art machinery and a dedicated team of over 50 skilled employees, we maintain complete control over our production line.
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

      {/* 3. THE TRUST MODEL */}
      <section className="bg-white py-24 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="w-96 h-96 border-[40px] border-brand-charcoal rounded-full absolute -top-20 -left-20"></div>
          <div className="w-96 h-96 border-[40px] border-brand-charcoal rounded-full absolute -bottom-20 -right-20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <Handshake className="w-16 h-16 text-brand-gold mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-6">Our Philosophy:<br />Trust Before Payment.</h2>
            <p className="text-xl font-light text-stone-500 max-w-3xl mx-auto leading-relaxed mb-12">
              What truly sets us apart is our belief in earning your trust.<br />
              <span className="text-brand-charcoal font-medium">You only pay after receiving your instruments and being completely satisfied.</span>
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
              <div className="bg-stone-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <CheckCircle2 className="text-brand-gold mb-4" size={28} />
                <h4 className="font-serif text-xl text-brand-charcoal mb-2">Inspect First</h4>
                <p className="text-sm text-stone-500">Receive your order and inspect the quality firsthand in your own facility.</p>
              </div>
              <div className="bg-stone-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <ShieldCheck className="text-brand-gold mb-4" size={28} />
                <h4 className="font-serif text-xl text-brand-charcoal mb-2">Zero Risk</h4>
                <p className="text-sm text-stone-500">If it doesn't meet your standards, simply return it. No questions asked.</p>
              </div>
              <div className="bg-stone-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <Heart className="text-brand-gold mb-4" size={28} />
                <h4 className="font-serif text-xl text-brand-charcoal mb-2">Long-term Partners</h4>
                <p className="text-sm text-stone-500">This model reflects our confidence in our quality and our commitment to you.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. OEM & CUSTOMIZATION */}
      <Section className="bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Content First on Desktop */}
            <div className="w-full md:w-1/2">
              <FadeIn>
                <span className="text-brand-gold uppercase tracking-widest text-xs font-bold">Bespoke Manufacturing</span>
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

            {/* Image */}
            <div className="w-full md:w-1/2">
              <FadeIn delay={0.2}>
                <div className="relative">
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-brand-gold/10 rounded-xl" />
                  <img
                    src={aboutQuality}
                    alt="Quality Inspection"
                    className="relative w-full rounded-xl shadow-xl"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </Section>

      {/* 5. DIRECT CONNECTION */}
      <section className="bg-gradient-to-br from-stone-100 via-white to-brand-gold/10 py-20">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-6">Human Connection, Not Portals.</h2>
            <p className="text-stone-600 font-light max-w-2xl mx-auto mb-10 text-lg">
              We don't use complicated portals or automated tickets. You can place orders or start a product inquiry simply by talking to us. Our team is quick to respond and ready to guide you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" className="flex items-center gap-2" onClick={() => window.open('https://wa.me/923302449855', '_blank')}>
                <MessageCircle size={20} /> Chat on WhatsApp
              </Button>
              <Button variant="secondary" className="flex items-center gap-2" onClick={() => navigate('/contact')}>
                Contact via Email
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
};