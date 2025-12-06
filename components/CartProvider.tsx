import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    sku: string;
    name: string;
    image_url: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('smith_quote_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to parse cart', e);
            return [];
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('smith_quote_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: any, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, {
                id: product.id,
                sku: product.sku,
                name: product.name,
                image_url: product.image_url,
                quantity
            }];
        });
        setIsOpen(true); // Open cart sidebar/feedback
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount: items.reduce((acc, item) => acc + item.quantity, 0),
            isOpen,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
