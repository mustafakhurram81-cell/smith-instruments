import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-md";

    const variants = {
        primary: "bg-brand-orange text-white hover:bg-orange-600 hover:shadow-lg shadow-md border border-transparent",
        secondary: "bg-brand-charcoal text-white hover:bg-gray-800 hover:shadow-lg shadow-md border border-transparent",
        outline: "bg-transparent text-brand-charcoal border-2 border-brand-charcoal hover:bg-brand-charcoal hover:text-white",
        text: "bg-transparent text-brand-charcoal hover:text-brand-orange underline-offset-4 hover:underline padding-0 rounded-none",
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                {children}
            </span>
        </button>
    );
};

