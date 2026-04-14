import React from 'react';
import { Section, Button, FadeIn, ParallaxHeader } from '../components/Shared';
import { SEO } from '../components/SEO';
import { ArrowRight, TrendingUp, Megaphone, UserCheck, MapPin, Package, ShieldCheck, Handshake, HeadphonesIcon, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DISTRIBUTOR_PERKS = [
  {
    icon: TrendingUp,
    title: 'Competitive Margins',
    desc: 'Industry-leading profit margins that make every sale worthwhile. Our pricing structure rewards committed partners.'
  },
  {
    icon: Megaphone,
    title: 'Marketing Support',
    desc: 'Co-branded marketing materials, catalogues, and digital assets to help you establish a strong local presence.'
  },
  {
    icon: UserCheck,
    title: 'Dedicated Account Manager',
    desc: 'A personal point of contact for order support, product queries, and business development strategies.'
  },
  {
    icon: MapPin,
    title: 'Territory Protection',
    desc: 'Exclusive or semi-exclusive territory rights to protect your investment and market development efforts.'
  }
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Inquire',
    desc: 'Reach out to our team with your company details and territory of interest. We will review your application and get back to you within 48 hours.',
    icon: Handshake
  },
  {
    step: '02',
    title: 'Sample & Evaluate',
    desc: 'Receive sample instruments to evaluate our quality firsthand. We believe in our product — no payment required until you are completely satisfied.',
    icon: Package
  },
  {
    step: '03',
    title: 'Launch & Grow',
    desc: 'Once onboarded, receive your first order with full marketing support, product training, and a dedicated account manager to help you succeed.',
    icon: TrendingUp
  }
];

const OFFER_LIST = [
  'Direct manufacturer pricing — no middlemen',
  'Payment after delivery & satisfaction guaranteed',
  'Custom OEM & private labeling available',
  'Flexible MOQ for new distributors',
  'Technical support',
  'Priority access to new product launches',
  'Co-branded catalogues & marketing materials'
];

export const Distributor: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="Become a Distributor"
        description="Partner with Smith Instruments as an authorized distributor. Competitive margins, marketing support, exclusive territories, and direct manufacturer pricing for surgical instruments."
        keywords="become surgical instrument distributor, surgical instruments distributorship, medical device distribution partnership, wholesale surgical instruments, OEM surgical instruments partner"
      />

      {/* HERO */}
      <ParallaxHeader
        title="Become a Distributor"
        description="Partner with a manufacturer, not a middleman. Join our global network of trusted distributors."
        image="/images/headers/distributor-header.webp"
        breadcrumbs={<span className="text-brand-orange uppercase tracking-[0.3em] text-sm font-bold block">Partnership Program</span>}
      />

      {/* WHY PARTNER WITH US */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <span className="text-brand-orange font-bold text-xs tracking-widest uppercase mb-3 block">Why Partner With Us</span>
            <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-6 text-balance">Built for <span className="text-brand-orange">Mutual Growth.</span></h2>
            <p className="text-stone-500 text-lg font-light leading-relaxed">
              We don't just sell instruments — we build long-term partnerships. Our distributors get direct access to our manufacturing capabilities, competitive pricing, and unwavering support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DISTRIBUTOR_PERKS.map((perk, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group h-full bg-white p-8 rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg hover:border-brand-orange/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:bg-brand-orange/20 transition-colors">
                    <perk.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3 text-brand-charcoal">{perk.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{perk.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 3-STEP PROCESS */}
      <section className="py-16 md:py-24 bg-white border-y border-stone-200/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-orange font-bold text-xs tracking-widest uppercase mb-3 block">The Process</span>
            <h2 className="font-heading text-4xl md:text-5xl text-brand-charcoal mb-4">Three Simple Steps</h2>
            <p className="text-stone-500 font-light text-lg max-w-2xl mx-auto">From your first inquiry to your first sale — we make it seamless.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PROCESS_STEPS.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.15}>
                <div className="relative text-center group">
                  {/* Connector line (hidden on mobile and after last item) */}
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[1px] bg-stone-200" />
                  )}

                  <div className="relative z-10 w-24 h-24 mx-auto rounded-full bg-stone-50 border-2 border-stone-200 flex items-center justify-center mb-6 group-hover:border-brand-orange group-hover:bg-brand-orange/5 transition-all duration-300">
                    <step.icon className="w-10 h-10 text-brand-steel group-hover:text-brand-orange transition-colors" strokeWidth={1.5} />
                  </div>

                  <span className="text-brand-orange font-heading text-sm tracking-widest font-bold mb-2 block">STEP {step.step}</span>
                  <h3 className="font-heading text-2xl text-brand-charcoal mb-3">{step.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER — SPLIT LAYOUT */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="bg-white p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-200/60 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <span className="text-brand-orange uppercase tracking-widest text-xs font-bold">What You Get</span>
                <h2 className="font-heading text-4xl text-brand-charcoal mt-3 mb-6">Everything You Need <br />to Succeed.</h2>
                <p className="text-stone-500 font-light text-lg mb-8">
                  Our distributor program is designed to give you every advantage. From competitive pricing to hands-on support, we invest in your success.
                </p>

                <ul className="space-y-4">
                  {OFFER_LIST.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-stone-600">
                      <CheckCircle2 size={18} className="text-brand-orange mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {/* Right — Key Stats */}
            <div className="w-full lg:w-1/2">
              <FadeIn delay={0.2}>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '20+', label: 'Years of Experience', icon: ShieldCheck },
                    { value: '20+', label: 'Countries Served', icon: MapPin },
                    { value: '50+', label: 'Active Distributors', icon: UserCheck },
                    { value: '24h', label: 'Response Time', icon: HeadphonesIcon }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-stone-50 rounded-2xl p-6 text-center border border-stone-100 hover:border-brand-orange/20 transition-colors">
                      <stat.icon className="w-8 h-8 text-brand-orange mx-auto mb-3" strokeWidth={1.5} />
                      <div className="font-heading text-3xl text-brand-charcoal mb-1">{stat.value}</div>
                      <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-28 bg-brand-charcoal relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <Handshake className="w-16 h-16 text-brand-orange mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">Ready to Partner <br />With Us?</h2>
            <p className="text-stone-300 font-light text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join our global network of distributors and gain access to premium surgical instruments, competitive margins, and dedicated support. Let's grow together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                className="px-10"
                onClick={() => navigate('/contact')}
              >
                Contact Us Today <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button
                variant="outline"
                className="text-white border-white/30 hover:bg-white hover:text-brand-charcoal px-10"
                onClick={() => navigate('/catalogues')}
              >
                View Our Catalogue
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
