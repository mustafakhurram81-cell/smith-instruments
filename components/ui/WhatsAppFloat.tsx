import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
    return (
        <motion.a
            href="https://wa.me/923302449855?text=Hi,%20I'm%20interested%20in%20Smith%20Instruments%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <MessageCircle size={28} fill="white" />
        </motion.a>
    );
};
