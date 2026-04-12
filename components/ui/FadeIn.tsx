import React from 'react';
import { motion } from 'framer-motion';

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
            duration: 0.6, 
            delay, 
            ease: [0.22, 1, 0.36, 1] 
        }}
    >
        {children}
    </motion.div>
);
