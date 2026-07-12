import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{
                duration: reduceMotion ? 0 : 0.4,
                ease: [0.22, 1, 0.36, 1] // Snappy but smooth cubic-bezier
            }}
            className="w-full relative"
        >
            {children}
        </motion.div>
    );
};
