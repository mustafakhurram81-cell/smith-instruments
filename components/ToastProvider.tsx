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

            {/* Toast Container - top right below header */}
            <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            layout
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`pointer-events-auto flex items-start gap-4 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-md max-w-sm w-96 ${toast.type === 'success'
                                ? 'bg-white/95 border-green-100 shadow-green-100/20'
                                : toast.type === 'error'
                                    ? 'bg-white/95 border-red-100 shadow-red-100/20'
                                    : 'bg-white/95 border-stone-200'
                                }`}
                        >
                            {/* Icon */}
                            <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${toast.type === 'success'
                                ? 'bg-green-100 text-green-600'
                                : toast.type === 'error'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-brand-orange/10 text-brand-orange'
                                }`}>
                                {toast.type === 'success' ? (
                                    <ShoppingCart size={16} strokeWidth={2.5} />
                                ) : toast.type === 'error' ? (
                                    <AlertCircle size={16} strokeWidth={2.5} />
                                ) : (
                                    <Check size={16} strokeWidth={2.5} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-sm font-semibold text-brand-charcoal leading-tight">
                                    {toast.message}
                                </p>
                                {toast.productName && (
                                    <p className="text-xs text-stone-500 mt-1 truncate font-medium">
                                        {toast.quantity && toast.quantity > 1 ? (
                                            <span className="text-brand-orange font-bold">{toast.quantity}x </span>
                                        ) : ''}
                                        {toast.productName}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="group -mr-2 -mt-2 p-2 rounded-full hover:bg-stone-100 transition-colors"
                            >
                                <X size={14} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
                            </button>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-100 rounded-b-xl overflow-hidden">
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                    className={`h-full ${toast.type === 'success' ? 'bg-green-500' :
                                        toast.type === 'error' ? 'bg-red-500' :
                                            'bg-brand-orange'
                                        }`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
