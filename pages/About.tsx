import React from 'react';
import { Section, FadeIn, Button } from '../components/Shared';
import { SEO } from '../components/SEO';
import { Target, Globe, Award, Users, Zap, Heart, CheckCircle2, PenTool, Handshake, MessageCircle, Hammer, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const About: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="overflow-x-hidden">
      <SEO
        title={t('nav.about')}
        description={t('about.metaDescription')}
      />
      {/* 1. CINEMATIC HERO */}
      <div className="relative h-[80vh] flex items-center justify-center bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=2000" alt="Steel Texture" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/60 via-brand-charcoal/80 to-stone-50"></div>

        <div className="relative z-10 container mx-auto px-6 text-center mt-20">
          <FadeIn>
            <span className="text-brand-gold uppercase tracking-[0.3em] text-sm font-bold mb-4 block">{t('about.established')}</span>
            <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 tracking-tight">{t('about.heroTitle')}</h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-brand-gold opacity-90 max-w-2xl mx-auto">
              {t('about.heroSubtitle')}
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
                    <p className="font-serif italic">"{t('about.quoteImage')}"</p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Text Content */}
            <div className="lg:w-7/12 pt-10">
              <FadeIn delay={0.2}>
                <span className="text-brand-gold uppercase tracking-[0.2em] text-sm font-bold mb-4 block">{t('about.ourHeritage')}</span>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-8 leading-tight">{t('about.storyTitle')}</h2>

                <div className="space-y-6 text-stone-600 text-lg font-light leading-relaxed">
                  <p>{t('about.storyPara1')}</p>
                  <p>{t('about.storyPara2')}</p>
                  <div className="p-6 bg-white border-l-4 border-brand-gold shadow-sm my-8">
                    <p className="text-brand-charcoal font-serif text-xl italic">
                      "{t('about.storyQuote')}"
                    </p>
                  </div>
                  <p>{t('about.storyPara3')}</p>
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
            <h2 className="font-serif text-4xl md:text-6xl mb-8">{t('about.philosophyTitle')}</h2>
            <p className="text-xl md:text-2xl font-light text-stone-300 max-w-3xl mx-auto leading-relaxed mb-12">
              {t('about.philosophySubtitle')} <br />
              <span className="text-white font-normal border-b border-brand-gold pb-1">{t('about.philosophyHighlight')}</span>
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto mt-16">
              <div className="bg-white/5 p-8 border border-white/10 rounded-sm">
                <CheckCircle2 className="text-brand-gold mb-4" />
                <h4 className="font-serif text-xl mb-2">{t('about.inspectFirst')}</h4>
                <p className="text-sm text-stone-400">{t('about.inspectFirstDesc')}</p>
              </div>
              <div className="bg-white/5 p-8 border border-white/10 rounded-sm">
                <ShieldCheck className="text-brand-gold mb-4" />
                <h4 className="font-serif text-xl mb-2">{t('about.zeroRisk')}</h4>
                <p className="text-sm text-stone-400">{t('about.zeroRiskDesc')}</p>
              </div>
              <div className="bg-white/5 p-8 border border-white/10 rounded-sm">
                <Heart className="text-brand-gold mb-4" />
                <h4 className="font-serif text-xl mb-2">{t('about.longTermPartners')}</h4>
                <p className="text-sm text-stone-400">{t('about.longTermPartnersDesc')}</p>
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
                <span className="text-stone-400 uppercase tracking-widest text-xs font-bold">{t('about.bespokeManufacturing')}</span>
                <h2 className="font-serif text-4xl text-brand-charcoal mt-3 mb-6">{t('about.customizationTitle')}</h2>
                <p className="text-stone-600 font-light text-lg mb-6">
                  {t('about.customizationDesc')}
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-brand-charcoal">
                    <PenTool size={20} className="text-brand-gold" /> {t('about.privateLabeling')}
                  </li>
                  <li className="flex items-center gap-3 text-brand-charcoal">
                    <Hammer size={20} className="text-brand-gold" /> {t('about.prototyping')}
                  </li>
                  <li className="flex items-center gap-3 text-brand-charcoal">
                    <Users size={20} className="text-brand-gold" /> {t('about.clientModifications')}
                  </li>
                </ul>
                <Button variant="secondary" onClick={() => navigate('/contact')}>{t('about.startCustomProject')}</Button>
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
            <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-6">{t('about.humanConnection')}</h2>
            <p className="text-stone-500 font-light max-w-2xl mx-auto mb-10 text-lg">
              {t('about.humanConnectionDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button variant="primary" className="flex items-center gap-2" onClick={() => window.open('https://wa.me/923302449855', '_blank')}>
                <MessageCircle size={20} /> {t('contact.chatWhatsApp')}
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/contact')}>
                {t('contact.contactEmail')}
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
};