import React from 'react';
import { Section, FadeIn, Button, ParallaxHeader } from '../components/Shared';
import { SEO } from '../components/SEO';
import { Users, Heart, CheckCircle2, PenTool, Handshake, MessageCircle, Hammer, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aboutCraftsmanship from '../assets/about-craftsmanship.png';
import aboutQuality from '../assets/about-quality.png';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="About Us"
        description="Learn about Smith Instruments' 20+ years of heritage in manufacturing precision surgical tools using German stainless steel."
        keywords="surgical instrument manufacturer USA, about Smith Instruments, medical device company, ISO certified surgical tools, custom surgical instrument maker, OEM medical instruments"
      />

      {/* 1. CINEMATIC HERO */}
      <ParallaxHeader
        title="Defining Precision"
        description="In-house manufacturing. 50+ Artisans. One standard of excellence."
        image="/images/headers/about-header.png"
        breadcrumbs={<span className="text-brand-orange uppercase tracking-[0.3em] text-sm font-bold block">Est. 2002 • USA Based</span>}
      />

      {/* 2. THE STORY (Editorial Split) */}
      <section className="bg-stone-50 py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image - Now properly centered and sized */}
            <div className="lg:w-5/12">
              <FadeIn>
                <div className="relative">
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={aboutCraftsmanship}
                      alt="Precision Manufacturing"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Content */}
            <div className="lg:w-7/12">
              <FadeIn delay={0.2}>
                <span className="text-brand-orange uppercase tracking-[0.2em] text-sm font-bold mb-4 block">Our Heritage</span>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-8 leading-tight">Molding the Metal<br />to Serve Life.</h2>

                <div className="space-y-6 text-stone-600 text-lg font-light leading-relaxed">
                  <p>
                    Since 2002, Smith Instruments has stood as a pillar of reliability in the surgical instruments industry. Based in the USA, we have carved a niche in providing precision tools specifically for <strong className="text-brand-charcoal">Plastic and Reconstructive surgery</strong>.
                  </p>
                  <p>
                    Unlike many suppliers who act as middlemen, we are <strong className="text-brand-charcoal">manufacturers at heart</strong>. With a facility equipped with state-of-the-art machinery and a dedicated team of over 50 skilled employees, we maintain complete control over our production line.
                  </p>
                  <div className="p-6 bg-white border-l-4 border-brand-orange shadow-sm my-8">
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

        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <Handshake className="w-16 h-16 text-brand-orange mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-6">Our Philosophy:<br />Trust Before Payment.</h2>
            <p className="text-xl font-light text-stone-500 max-w-3xl mx-auto leading-relaxed mb-12">
              What truly sets us apart is our belief in earning your trust.<br />
              <span className="text-brand-charcoal font-medium">You only pay after receiving your instruments and being completely satisfied.</span>
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
              <div className="bg-stone-50 p-8 rounded-lg border border-stone-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-brand-orange" size={24} />
                </div>
                <h4 className="font-serif text-xl text-brand-charcoal mb-2">Inspect First</h4>
                <p className="text-sm text-stone-500">Receive your order and inspect the quality firsthand in your own facility.</p>
              </div>
              <div className="bg-stone-50 p-8 rounded-lg border border-stone-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center mb-4">
                  <ShieldCheck className="text-brand-orange" size={24} />
                </div>
                <h4 className="font-serif text-xl text-brand-charcoal mb-2">Zero Risk</h4>
                <p className="text-sm text-stone-500">If it doesn't meet your standards, simply return it. No questions asked.</p>
              </div>
              <div className="bg-stone-50 p-8 rounded-lg border border-stone-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center mb-4">
                  <Heart className="text-brand-orange" size={24} />
                </div>
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
                <span className="text-brand-orange uppercase tracking-widest text-xs font-bold">Bespoke Manufacturing</span>
                <h2 className="font-serif text-4xl text-brand-charcoal mt-3 mb-6">Customization & OEM</h2>
                <p className="text-stone-600 font-light text-lg mb-6">
                  At Smith Instruments, we understand that no two clients are the same. Whether you require modifications to an existing pattern or the development of an entirely new instrument from a napkin sketch, we are your partners in innovation.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-brand-charcoal">
                    <PenTool size={20} className="text-brand-orange" /> Private Labeling (Your Brand, Our Quality)
                  </li>
                  <li className="flex items-center gap-3 text-brand-charcoal">
                    <Hammer size={20} className="text-brand-orange" /> Prototyping & Development
                  </li>
                  <li className="flex items-center gap-3 text-brand-charcoal">
                    <Users size={20} className="text-brand-orange" /> Client-Specific Modifications
                  </li>
                </ul>
                <Button variant="secondary" onClick={() => navigate('/contact')}>Start a Custom Project</Button>
              </FadeIn>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/2">
              <FadeIn delay={0.2}>
                <div className="relative">
                  <img
                    src={aboutQuality}
                    alt="Quality Inspection"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </Section>

      {/* 5. MEET THE ARTISANS - HUMANIZING THE BRAND */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-orange uppercase tracking-[0.2em] text-sm font-bold block mb-3">Our People</span>
            <h2 className="font-serif text-4xl text-brand-charcoal">The Hands Behind the Steel</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { name: "Khurram Munir", role: "Production Director", img: "https://ui-avatars.com/api/?name=Khurram+Munir&size=400&background=f97316&color=ffffff&bold=true", quote: "Quality is never an accident; it's the result of intelligent effort." },
              { name: "Usama Munir", role: "Customer Relations & Finance", img: "https://ui-avatars.com/api/?name=Usama+Munir&size=400&background=1c1917&color=ffffff&bold=true", quote: "Building lasting partnerships, one conversation at a time." },
              { name: "Mustafa Khurram", role: "Head of Marketing", img: "https://ui-avatars.com/api/?name=Mustafa+Khurram&size=400&background=57534e&color=ffffff&bold=true", quote: "Sharing our story of precision with the world." }
            ].map((member, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-stone-50 shadow-lg group-hover:border-brand-orange/20 transition-colors">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h4 className="font-serif text-2xl text-brand-charcoal mb-1">{member.name}</h4>
                  <p className="text-brand-orange font-medium text-xs uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-stone-500 italic font-light">"{member.quote}"</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DIRECT CONNECTION */}
      <section className="bg-stone-50 py-20">
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