import React from 'react';
import { Section, FadeIn, Button, ParallaxHeader, ExperienceGrid } from '../components/Shared';
import { SEO } from '../components/SEO';
import { Users, Heart, CheckCircle2, PenTool, Handshake, MessageCircle, Hammer, ShieldCheck, Award, Globe, Factory, Package, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CONTACT_INFO } from '../constants';
import heritageImg from '../assets/factory/heritage.jpeg';
import manufacturingImg from '../assets/factory/manufacturing.jpeg';
import legacyImg from '../assets/factory/legacy.jpeg';
import artisan2 from '../assets/factory/artisan-2.jpeg';
import artisan3 from '../assets/factory/artisan-3.jpeg';
import workshopExtra from '../assets/factory/workshop-extra.jpeg';

/**
 * PLACEHOLDER MILESTONES — Replace with your real company milestones.
 */
const MILESTONES = [
  {
    year: '2002',
    title: 'Company Founded',
    description: 'Smith Instruments was established with a vision to deliver precision surgical instruments to the global market.',
    icon: Factory,
  },
  {
    year: '2005',
    title: 'First International Export',
    description: 'Shipped our first international order, marking the beginning of our global journey.',
    icon: Globe,
  },
  {
    year: '2008',
    title: 'ISO 9001 Certification',
    description: 'Achieved ISO 9001 quality management certification, formalizing our commitment to excellence.',
    icon: Award,
  },
  {
    year: '2012',
    title: '50+ Skilled Artisans',
    description: 'Our team grew to over 50 employees, expanding our manufacturing capacity significantly.',
    icon: Users,
  },
  {
    year: '2015',
    title: 'South American Expansion',
    description: 'Established strong partnerships in Brazil, Argentina, and Chile, becoming a trusted supplier across Latin America.',
    icon: Globe,
  },
  {
    year: '2018',
    title: 'CE Marking Achieved',
    description: 'Our instruments received CE marking, enabling access to European markets.',
    icon: ShieldCheck,
  },
  {
    year: '2020',
    title: '5000+ Instruments',
    description: 'Our product catalog surpassed 5,000 instruments across multiple surgical specialties.',
    icon: Package,
  },
  {
    year: '2024',
    title: 'Digital Transformation',
    description: 'Launched our digital platform with online catalogues, real-time quoting, and global accessibility.',
    icon: Globe,
  },
];

const CERTIFICATIONS = [
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management System — ensuring consistent quality and customer satisfaction across all processes.',
    icon: Award,
  },
  {
    name: 'ISO 13485:2016',
    description: 'Medical Devices Quality Management — the international standard for medical device manufacturing.',
    icon: ShieldCheck,
  },
  {
    name: 'CE Certified',
    description: 'European Conformity — our instruments meet EU health, safety, and environmental protection standards.',
    icon: CheckCircle2,
  },
];

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
        image="/images/headers/about-header.webp"
        breadcrumbs={<span className="text-brand-orange uppercase tracking-[0.3em] text-sm font-bold block">Est. 2002 • USA Based</span>}
      />

      {/* 2. THE STORY (Editorial Split) */}
      <section className="bg-stone-50 py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image - Now properly centered and sized */}
            <div className="lg:w-5/12">
              <ExperienceGrid 
                images={[heritageImg, artisan2, artisan3]} 
              />
            </div>

            {/* Content */}
            <div className="lg:w-7/12">
              <FadeIn delay={0.2}>
                <span className="text-brand-orange uppercase tracking-[0.2em] text-sm font-bold mb-4 block">Our Heritage</span>
                <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-8 leading-tight">Molding the Metal<br />to Serve Life.</h2>

                <div className="space-y-6 text-stone-600 text-lg font-light leading-relaxed">
                  <p>
                    Since 2002, Smith Instruments has stood as a pillar of reliability in the surgical instruments industry. Based in the USA, we have carved a niche in providing precision tools specifically for <strong className="text-brand-charcoal">Plastic and Reconstructive surgery</strong>.
                  </p>
                  <p>
                    Unlike many suppliers who act as middlemen, we are <strong className="text-brand-charcoal">manufacturers at heart</strong>. With a facility equipped with state-of-the-art machinery and a dedicated team of over 50 skilled employees, we maintain complete control over our production line.
                  </p>
                  <div className="p-6 bg-white border-l-4 border-brand-orange shadow-sm my-8">
                    <p className="text-brand-charcoal font-heading text-xl italic">
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

      {/* 3. COMPANY TIMELINE */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-orange uppercase tracking-[0.2em] text-sm font-bold block mb-3">Our Journey</span>
            <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-4">Two Decades of Excellence</h2>
            <p className="text-stone-500 font-light text-lg max-w-2xl mx-auto">
              Key milestones that shaped Smith Instruments into the trusted manufacturer it is today.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-stone-200 md:-translate-x-[1px]" />

            {MILESTONES.map((milestone, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <FadeIn key={idx} delay={idx * 0.08}>
                  <div className={`relative flex items-start mb-12 last:mb-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content card */}
                    <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                      <span className="text-brand-orange font-heading text-sm tracking-widest font-bold mb-1 block">{milestone.year}</span>
                      <h3 className="font-heading text-xl text-brand-charcoal mb-2">{milestone.title}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed">{milestone.description}</p>
                    </div>

                    {/* Center dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center z-10 shadow-sm">
                      <milestone.icon size={14} className="text-brand-orange" />
                    </div>

                    {/* Spacer for the other side */}
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. THE TRUST MODEL */}
      <section className="bg-stone-50 py-24 relative overflow-hidden">

        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <Handshake className="w-16 h-16 text-brand-orange mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-6">Our Philosophy:<br />Trust Before Payment.</h2>
            <p className="text-xl font-light text-stone-500 max-w-3xl mx-auto leading-relaxed mb-12">
              What truly sets us apart is our belief in earning your trust.<br />
              <span className="text-brand-charcoal font-medium">You only pay after receiving your instruments and being completely satisfied.</span>
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-brand-orange" size={24} />
                </div>
                <h4 className="font-heading text-xl text-brand-charcoal mb-2">Inspect First</h4>
                <p className="text-sm text-stone-500">Receive your order and inspect the quality firsthand in your own facility.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="text-brand-orange" size={24} />
                </div>
                <h4 className="font-heading text-xl text-brand-charcoal mb-2">Zero Risk</h4>
                <p className="text-sm text-stone-500">If it doesn't meet your standards, simply return it. No questions asked.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4">
                  <Heart className="text-brand-orange" size={24} />
                </div>
                <h4 className="font-heading text-xl text-brand-charcoal mb-2">Long-term Partners</h4>
                <p className="text-sm text-stone-500">This model reflects our confidence in our quality and our commitment to you.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. OEM & CUSTOMIZATION */}
      <Section className="bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Content First on Desktop */}
            <div className="w-full md:w-1/2">
              <FadeIn>
                <span className="text-brand-orange uppercase tracking-widest text-xs font-bold">Bespoke Manufacturing</span>
                <h2 className="font-heading text-4xl text-brand-charcoal mt-3 mb-6">Customization & OEM</h2>
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
              <ExperienceGrid 
                images={[manufacturingImg, legacyImg, workshopExtra]} 
                accentColor="bg-brand-charcoal"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* 6. MEET THE ARTISANS - HUMANIZING THE BRAND */}
      <section className="bg-stone-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-orange uppercase tracking-[0.2em] text-sm font-bold block mb-3">Our People</span>
            <h2 className="font-heading text-4xl text-brand-charcoal">The Hands Behind the Steel</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* PLACEHOLDER AVATARS — Replace with real team photos ASAP */}
            {[
              { name: "Khurram Munir", role: "Production Director", img: "https://ui-avatars.com/api/?name=Khurram+Munir&size=400&background=f97316&color=ffffff&bold=true", quote: "Quality is never an accident; it's the result of intelligent effort." },
              { name: "Usama Munir", role: "Customer Relations & Finance", img: "https://ui-avatars.com/api/?name=Usama+Munir&size=400&background=1c1917&color=ffffff&bold=true", quote: "Building lasting partnerships, one conversation at a time." },
              { name: "Mustafa Khurram", role: "Head of Marketing", img: "https://ui-avatars.com/api/?name=Mustafa+Khurram&size=400&background=57534e&color=ffffff&bold=true", quote: "Sharing our story of precision with the world." }
            ].map((member, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-stone-100 shadow-lg group-hover:border-brand-orange/20 transition-colors">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h4 className="font-heading text-2xl text-brand-charcoal mb-1">{member.name}</h4>
                  <p className="text-brand-orange font-medium text-xs uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-stone-500 italic font-light">"{member.quote}"</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CERTIFICATIONS & COMPLIANCE */}
      <section className="bg-white py-24 border-t border-stone-200/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-orange uppercase tracking-[0.2em] text-sm font-bold block mb-3">Quality Assurance</span>
            <h2 className="font-heading text-4xl text-brand-charcoal mb-4">Certifications & Compliance</h2>
            <p className="text-stone-500 font-light text-lg max-w-2xl mx-auto">
              Our commitment to quality is verified by internationally recognized standards and certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {CERTIFICATIONS.map((cert, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="text-center p-8 bg-stone-50 rounded-2xl border border-stone-200/60 hover:border-brand-orange/20 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-brand-orange/10 flex items-center justify-center mb-5">
                    <cert.icon className="w-8 h-8 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl text-brand-charcoal mb-3">{cert.name}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{cert.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DIRECT CONNECTION */}
      <section className="bg-stone-50 py-24 border-t border-stone-200/50">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-6">Human Connection, Not Portals.</h2>
            <p className="text-stone-500 font-light max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              We don't use complicated portals or automated tickets. You can place orders or start a product inquiry simply by talking to us. Our team is quick to respond and ready to guide you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="primary" 
                className="flex items-center gap-2 px-8 py-4 shadow-lg hover:-translate-y-1 transition-all" 
                onClick={() => window.open(`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`, '_blank')}
              >
                <MessageCircle size={20} /> Chat on WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-8 py-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all bg-white" 
                onClick={() => navigate('/contact')}
              >
                <Mail size={20} className="text-brand-orange" /> Send an Email
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
};