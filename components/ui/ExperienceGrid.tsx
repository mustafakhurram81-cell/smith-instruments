import React from 'react';
import { motion } from 'framer-motion';

interface ExperienceGridProps {
  images: string[];
  className?: string;
  accentColor?: string;
}

/**
 * ExperienceGrid - A premium overlapping image layout 
 * featuring geometric background shapes and decorative patterns.
 * Optimized for the "Our Legacy" and "Heritage" sections.
 */
export const ExperienceGrid: React.FC<ExperienceGridProps> = ({ 
  images, 
  className = "", 
  accentColor = "bg-brand-orange" 
}) => {
  // We need at least 3 images for the full effect, but handle fewer gracefully
  const mainImage = images[0];
  const secondaryImage = images[1] || images[0];
  const tertiaryImage = images[2] || images[1] || images[0];

  return (
    <div className={`relative ${className}`}>
      {/* Container with specific aspect ratio for the grid */}
      <div className="relative w-full aspect-[4/3] md:aspect-square max-w-xl mx-auto">
        
        {/* 1. Background Orange Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className={`absolute top-[15%] left-[5%] w-[70%] h-[70%] rounded-3xl ${accentColor} opacity-90 z-0 shadow-2xl shadow-brand-orange/20`}
        />

        {/* 2. Top-Left Dotted Pattern */}
        <div className="absolute top-[35%] -left-4 w-20 h-28 z-10 hidden md:block opacity-40">
           <div className="grid grid-cols-5 gap-2">
            {[...Array(25)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            ))}
          </div>
        </div>

        {/* 3. Bottom-Right Dotted Pattern */}
        <div className="absolute bottom-[20%] right-0 w-20 h-20 z-20 hidden md:block opacity-40">
           <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>
        </div>

        {/* 4. Secondary Image (Top Left Surround) */}
        <motion.div 
          initial={{ opacity: 0, x: -30, y: -20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute top-0 left-0 w-[45%] aspect-[4/3] z-20"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white/10 bg-stone-200">
            <img 
              src={secondaryImage} 
              alt="Factory Detail" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
            />
          </div>
        </motion.div>

        {/* 5. Tertiary Image (Top Right) */}
        <motion.div 
          initial={{ opacity: 0, x: 30, y: -20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="absolute top-[10%] right-0 w-[50%] aspect-[3/2] z-10"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white/5 bg-stone-200">
            <img 
              src={tertiaryImage} 
              alt="Factory Environment" 
              className="w-full h-full object-cover" 
            />
          </div>
        </motion.div>

        {/* 6. Main Image (Large, Bottom Center Focus) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute bottom-0 left-[15%] w-[75%] aspect-[4/3] z-30"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white bg-stone-300">
            <img 
              src={mainImage} 
              alt="Main Factory View" 
              className="w-full h-full object-cover" 
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};
