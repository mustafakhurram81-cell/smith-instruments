import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    const reduceMotion = useReducedMotion();

    return (
    <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : delay,
            ease: [0.22, 1, 0.36, 1] 
        }}
    >
        {children}
    </motion.div>
    );
};
