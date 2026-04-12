import React from 'react';
import { Package, LucideIcon } from 'lucide-react';
import { Button } from '../Shared';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: React.ReactNode | string;
    action?: {
        label: string;
        onClick: () => void;
    };
    children?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon = Package,
    title,
    description,
    action,
    children,
    className = ""
}) => {
    return (
        <div className={`text-center py-20 px-6 bg-white rounded-xl shadow-sm border border-stone-100 max-w-2xl mx-auto w-full flex flex-col items-center justify-center ${className}`}>
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6 text-stone-300 border border-stone-100">
                <Icon size={32} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-heading text-brand-charcoal mb-3">{title}</h3>
            
            <div className="text-stone-500 font-light mb-8 max-w-md mx-auto leading-relaxed">
                {description}
            </div>
            
            {action && (
                <Button variant="primary" onClick={action.onClick} className="px-8 shadow-sm">
                    {action.label}
                </Button>
            )}
            
            {children && (
                <div className="mt-8 w-full">
                    {children}
                </div>
            )}
        </div>
    );
};
