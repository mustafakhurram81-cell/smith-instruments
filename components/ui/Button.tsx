import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-md";

    const variants = {
        primary: "bg-brand-orange text-white hover:bg-[#E54D20] hover:shadow-[0_8px_20px_-6px_rgba(235,90,40,0.4)] border border-transparent",
        secondary: "bg-brand-charcoal text-white hover:bg-[#1A1A1A] hover:shadow-[0_8px_20px_-6px_rgba(30,30,30,0.4)] border border-transparent",
        outline: "bg-transparent text-brand-charcoal border border-stone-300 hover:border-brand-charcoal hover:bg-stone-50",
        text: "bg-transparent text-brand-charcoal hover:text-brand-orange hover:translate-x-1 px-0 py-0 rounded-none",
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                {children}
            </span>
        </button>
    );
};

