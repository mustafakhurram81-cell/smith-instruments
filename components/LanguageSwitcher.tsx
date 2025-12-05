import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="relative group z-50">
            <button className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors">
                <Globe size={18} />
                <span className="uppercase text-xs font-medium">{i18n.language.split('-')[0]}</span>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-brand-gold"
                >
                    English
                </button>
                <button
                    onClick={() => changeLanguage('de')}
                    className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-brand-gold"
                >
                    Deutsch
                </button>
                <button
                    onClick={() => changeLanguage('es')}
                    className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-brand-gold"
                >
                    Español
                </button>
            </div>
        </div>
    );
};
