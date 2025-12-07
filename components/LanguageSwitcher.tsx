import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

// Trigger Google Translate programmatically (hidden widget)
const translatePage = (langCode: string) => {
    const googleFrame = document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
    if (googleFrame) {
        const innerDoc = googleFrame.contentDocument || googleFrame.contentWindow?.document;
        if (innerDoc) {
            const items = innerDoc.querySelectorAll('.goog-te-menu2-item span.text');
            items.forEach((item: any) => {
                const itemLang = item.parentElement?.getAttribute('value');
                if (itemLang === langCode || (langCode === 'en' && item.textContent === 'English')) {
                    item.click();
                }
            });
        }
    }

    // Fallback: use cookie method
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${langCode}; path=/`;

    // Force page update
    if (langCode === 'en') {
        // Reset to English
        const frame = document.querySelector('.skiptranslate iframe') as HTMLIFrameElement;
        if (frame) {
            const innerDoc = frame.contentDocument || frame.contentWindow?.document;
            const restoreBtn = innerDoc?.querySelector('[id=":1.restore"]') as HTMLElement;
            if (restoreBtn) restoreBtn.click();
        }
    }

    window.location.reload();
};

export const LanguageSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Detect current language from cookie
    useEffect(() => {
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
        if (match) {
            setCurrentLang(match[1]);
        }
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode: string) => {
        setCurrentLang(langCode);
        setIsOpen(false);
        translatePage(langCode);
    };

    const currentLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    return (
        <>
            {/* Hidden Google Translate element */}
            <div id="google_translate_element" className="hidden" />

            {/* Custom Professional UI */}
            <div ref={dropdownRef} className="relative z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-stone-600 hover:border-brand-gold text-stone-300 hover:text-white transition-all duration-200 bg-brand-charcoal/50 backdrop-blur-sm"
                >
                    <Globe size={16} />
                    <span className="text-sm font-medium">{currentLanguage.flag} {currentLanguage.name}</span>
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 border border-stone-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors ${currentLang === lang.code
                                        ? 'bg-brand-gold/10 text-brand-gold font-medium'
                                        : 'text-stone-700 hover:bg-stone-50'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </span>
                                {currentLang === lang.code && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
