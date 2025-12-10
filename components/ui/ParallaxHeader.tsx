import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxHeaderProps {
    title: string;
    description?: string;
    image: string;
    breadcrumbs?: React.ReactNode;
}

export const ParallaxHeader: React.FC<ParallaxHeaderProps> = ({ title, description, image, breadcrumbs }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax effect: Moving the background at 50% speed of scroll
    const y = useTransform(scrollY, [0, 500], [0, 250]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div ref={ref} className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center bg-brand-charcoal text-white">
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />

                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-brand-charcoal/50 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-brand-charcoal/30" />
            </motion.div>

            {/* Content Content (Static relative to scroll, fades out) */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 container mx-auto px-6 text-center"
            >
                {breadcrumbs && (
                    <div className="mb-6 flex justify-center text-sm font-medium tracking-wide">
                        {breadcrumbs}
                    </div>
                )}

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-serif text-5xl md:text-7xl mb-6 leading-tight"
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-stone-200 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        {description}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};
