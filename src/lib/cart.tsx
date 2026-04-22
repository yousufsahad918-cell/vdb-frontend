"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  puffs: string;
  flavour: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (product_id: string, flavour: string) => void;
  updateQuantity: (product_id: string, flavour: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product_id === item.product_id && i.flavour === item.flavour
      );
      if (existing) {
        return prev.map((i) =>
          i.product_id === item.product_id && i.flavour === item.flavour
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // Cart stays closed — toast + sticky footer handle the UX
  };

  const removeFromCart = (product_id: string, flavour: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product_id === product_id && i.flavour === flavour))
    );
  };

  const updateQuantity = (product_id: string, flavour: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product_id, flavour);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product_id === product_id && i.flavour === flavour ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
