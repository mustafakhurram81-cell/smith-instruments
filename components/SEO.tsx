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
    structuredData?: object | object[]; // JSON-LD schemas
    breadcrumbs?: { name: string; item: string }[];
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image = 'https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?q=80&w=1200', /* Default image */
    url = '',
    type = 'website',
    structuredData,
    breadcrumbs
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
            "email": "info@smithinstruments.net"
        },
        "sameAs": Object.values(SOCIAL_LINKS)
    };

    // Ensure absolute URL strictly using the primary domain
    const cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');
    const absoluteUrl = `https://smithinstruments.net${cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`}`;

    // WebSite schema to enforce Site Name
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteTitle,
        "alternateName": "Smith Surgical",
        "url": "https://smithinstruments.net/"
    };

    // Combine schemas
    const schemas: object[] = [organizationSchema, websiteSchema];

    if (breadcrumbs && breadcrumbs.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.item.startsWith('http') ? crumb.item : `https://smithinstruments.net${crumb.item}`
            }))
        });
    }

    if (structuredData) {
        if (Array.isArray(structuredData)) {
            schemas.push(...structuredData);
        } else {
            schemas.push(structuredData);
        }
    }

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={absoluteUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={absoluteUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Canonical URL and hreflang */}
            <link rel="canonical" href={absoluteUrl} />
            <link rel="alternate" hrefLang="en" href={absoluteUrl} />
            <link rel="alternate" hrefLang="x-default" href={absoluteUrl} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schemas)}
            </script>
        </Helmet>
    );
};
