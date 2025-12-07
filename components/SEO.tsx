import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image = 'https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?q=80&w=1200', /* Default image */
    url = typeof window !== 'undefined' ? window.location.href : '',
    type = 'website'
}) => {
    const siteTitle = 'Smith Instruments';
    const fullTitle = `${title} | ${siteTitle}`;

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

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};
