import React from 'react';

export const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = "", id }) => (
    <section id={id} className={`py-24 md:py-32 ${className}`}>
        {children}
    </section>
);
