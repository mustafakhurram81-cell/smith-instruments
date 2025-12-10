import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShoppingCart, AlertCircle } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    productName?: string;
    quantity?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info', options?: { productName?: string; quantity?: number }) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => { } });

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', options?: { productName?: string; quantity?: number }) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type, ...options }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-sm max-w-sm ${toast.type === 'success'
                                    ? 'bg-white border-green-200'
                                    : toast.type === 'error'
                                        ? 'bg-white border-red-200'
                                        : 'bg-white border-stone-200'
                                }`}
                        >
                            {/* Icon */}
                            <div className={`p-2 rounded-full ${toast.type === 'success'
                                    ? 'bg-green-100 text-green-600'
                                    : toast.type === 'error'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-brand-gold/10 text-brand-gold'
                                }`}>
                                {toast.type === 'success' ? (
                                    <ShoppingCart size={18} />
                                ) : toast.type === 'error' ? (
                                    <AlertCircle size={18} />
                                ) : (
                                    <Check size={18} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-charcoal">
                                    {toast.message}
                                </p>
                                {toast.productName && (
                                    <p className="text-xs text-stone-500 truncate">
                                        {toast.quantity && toast.quantity > 1 ? `${toast.quantity}x ` : ''}{toast.productName}
                                    </p>
                                )}
                            </div>

                            {/* Close */}
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <X size={14} className="text-stone-400" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
