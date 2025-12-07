import React from 'react';
import { Section, Button, FadeIn } from '../components/Shared';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Blog: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="pt-20 min-h-screen bg-stone-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <Section className="text-center">
          <FadeIn>
            <div className="w-20 h-20 bg-brand-charcoal text-brand-gold rounded-full flex items-center justify-center mx-auto mb-8">
              <Clock size={40} />
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-brand-charcoal mb-6">{t('blog.comingSoon')}</h1>
            <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto mb-10">
              {t('blog.comingSoonDesc')}
            </p>
            <Button onClick={() => navigate('/')}>{t('blog.returnHome')}</Button>
          </FadeIn>
        </Section>
      </div>
    </div>
  );
};