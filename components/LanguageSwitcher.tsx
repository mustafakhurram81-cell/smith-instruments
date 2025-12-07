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

interface LanguageSwitcherProps {
    isTransparent?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isTransparent = false }) => {
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

            {/* Compact Professional UI */}
            <div ref={dropdownRef} className="relative z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isTransparent
                            ? 'text-white hover:bg-white/10'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-brand-charcoal'
                        }`}
                    title={`Language: ${currentLanguage.name}`}
                >
                    <Globe size={18} />
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-1.5 border border-stone-100 overflow-hidden">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex items-center justify-between w-full px-3 py-2 text-xs transition-colors ${currentLang === lang.code
                                    ? 'bg-brand-gold/10 text-brand-gold font-medium'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-sm">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </span>
                                {currentLang === lang.code && <Check size={12} />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
