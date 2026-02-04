import React from 'react';
import { Section } from './ui/Section';

const LOGOS = [
    { name: "Johns Hopkins", opacity: 0.6 },
    { name: "Mayo Clinic", opacity: 0.5 },
    { name: "Cleveland Clinic", opacity: 0.55 },
    { name: "Charité", opacity: 0.5 },
    { name: "Singapore General", opacity: 0.6 },
    { name: "Toronto General", opacity: 0.5 },
];

export const LogoCloud: React.FC = () => {
    return (
        <Section className="py-12 md:py-16 border-b border-gray-100 bg-white">
            <div className="container mx-auto px-6">
                <p className="text-center text-sm font-medium text-stone-400 uppercase tracking-widest mb-8">
                    Trusted by Medical Institutions Worldwide
                </p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-70 hover:opacity-100 transition-opacity duration-500">
                    {LOGOS.map((logo, idx) => (
                        <div
                            key={idx}
                            className="text-xl md:text-2xl font-serif text-stone-400 font-bold flex items-center gap-2 select-none"
                            style={{ opacity: logo.opacity }}
                        >
                            {/* Fallback text logos to keep it clean and performant without needing external assets immediately */}
                            {logo.name}
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
