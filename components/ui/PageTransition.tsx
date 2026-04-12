import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] // Snappy but smooth cubic-bezier
            }}
            className="w-full relative"
        >
            {children}
        </motion.div>
    );
};
