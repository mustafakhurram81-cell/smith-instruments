import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SOCIAL_LINKS } from '../constants';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    structuredData?: object; // JSON-LD schema.org data
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image = 'https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?q=80&w=1200', /* Default image */
    url = typeof window !== 'undefined' ? window.location.href : '',
    type = 'website',
    structuredData
}) => {
    const siteTitle = 'Smith Instruments';
    const fullTitle = `${title} | ${siteTitle}`;

    // Default organization schema for all pages
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Smith Instruments",
        "url": "https://smithinstruments.net",
        "logo": "https://smithinstruments.net/smith-logo-full.webp",
        "description": "Premium manufacturer of precision surgical instruments",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+92-330-2449855",
            "contactType": "sales",
            "email": "sales@smithinstruments.net"
        },
        "sameAs": Object.values(SOCIAL_LINKS)
    };

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData || organizationSchema)}
            </script>
        </Helmet>
    );
};
