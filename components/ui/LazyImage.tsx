import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    placeholder?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    containerClassName = '',
    placeholder
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // Start loading 100px before visible
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const defaultPlaceholder = (
        <div className="w-full h-full bg-stone-100 animate-pulse" />
    );

    return (
        <div ref={imgRef} className={containerClassName}>
            {!isInView ? (
                placeholder || defaultPlaceholder
            ) : (
                <>
                    {!isLoaded && (placeholder || defaultPlaceholder)}
                    <img
                        src={src}
                        alt={alt}
                        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsLoaded(true)}
                        loading="lazy"
                    />
                </>
            )}
        </div>
    );
};
