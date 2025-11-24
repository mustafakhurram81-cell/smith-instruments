import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
    title: string;
    description?: string;
    image?: string;
    icon?: any;
    onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, image, icon: Icon, onClick }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-white rounded-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={onClick}
        >
            {/* Image Area */}
            <div className="h-48 overflow-hidden relative bg-stone-100">
                <div className="absolute inset-0 bg-brand-charcoal/10 group-hover:bg-transparent transition-colors z-10"></div>
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                        {Icon ? <Icon size={48} /> : <span className="text-4xl font-serif text-stone-200">{title.charAt(0)}</span>}
                    </div>
                )}

                {Icon && (
                    <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
                        <Icon size={24} className="text-brand-charcoal" />
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-serif text-xl text-brand-charcoal group-hover:text-brand-gold transition-colors">{title}</h3>
                    <ArrowRight size={20} className="text-brand-gold transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                {description && (
                    <p className="text-stone-500 text-sm font-light line-clamp-2">
                        {description}
                    </p>
                )}
            </div>
        </motion.div>
    );
};
