import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed rounded-full";

    const variants = {
        primary: "bg-brand-gold text-brand-charcoal hover:bg-stone-200 hover:shadow-md shadow-sm border border-transparent",
        secondary: "bg-brand-charcoal text-brand-gold hover:bg-stone-800 hover:shadow-md shadow-sm border border-transparent",
        outline: "bg-transparent text-brand-charcoal border border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-gold",
        text: "bg-transparent text-brand-charcoal hover:text-stone-600 underline-offset-4 hover:underline padding-0 rounded-none",
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};
