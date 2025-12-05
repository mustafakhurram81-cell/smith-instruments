import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    nav: {
                        home: "Home",
                        products: "Products",
                        catalogues: "Catalogues",
                        about: "About Us",
                        blog: "Blog",
                        contact: "Contact",
                        quote: "Request Quote"
                    },
                    hero: {
                        title: "Precision in Every Cut",
                        subtitle: "Premium surgical instruments crafted for excellence. ISO certified manufacturing."
                    }
                }
            },
            de: {
                translation: {
                    nav: {
                        home: "Startseite",
                        products: "Produkte",
                        catalogues: "Kataloge",
                        about: "Über Uns",
                        blog: "Blog",
                        contact: "Kontakt",
                        quote: "Angebot anfordern"
                    },
                    hero: {
                        title: "Präzision bei jedem Schnitt",
                        subtitle: "Hochwertige chirurgische Instrumente, gefertigt für Exzellenz. ISO-zertifizierte Fertigung."
                    }
                }
            },
            es: {
                translation: {
                    nav: {
                        home: "Inicio",
                        products: "Productos",
                        catalogues: "Catálogos",
                        about: "Sobre Nosotros",
                        blog: "Blog",
                        contact: "Contacto",
                        quote: "Solicitar Presupuesto"
                    },
                    hero: {
                        title: "Precisión en cada corte",
                        subtitle: "Instrumentos quirúrgicos premium elaborados para la excelencia. Fabricación certificada ISO."
                    }
                }
            }
        }
    });

export default i18n;
