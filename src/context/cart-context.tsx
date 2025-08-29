'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Bundle } from '@/types/ecommerce';
import * as mockApi from '@/lib/mock-api';

interface CartItem {
  product: Product | Bundle;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product | Bundle) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = async (product: Product | Bundle) => {
    // Optimistic UI update
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });

    // Make API call in background
    try {
      // In a real implementation, this would call the API to add to cart
      // For now, we're just simulating the API call
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      // Rollback UI if API call fails
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
          if (existingItem.quantity <= 1) {
            return prevItems.filter(item => item.product.id !== product.id);
          } else {
            return prevItems.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity - 1 } 
                : item
            );
          }
        }
        return prevItems;
      });
      
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeItem = async (productId: string) => {
    // Optimistic UI update
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));

    // Make API call in background
    try {
      // In a real implementation, this would call the API to remove from cart
      // For now, we're just simulating the API call
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      // Note: We don't rollback here since removal is typically less critical
      console.error('Failed to remove item from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    // Optimistic UI update
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );

    // Make API call in background
    try {
      // In a real implementation, this would call the API to update quantity
      // For now, we're just simulating the API call
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      // Rollback UI if API call fails
      setItems(prevItems => 
        prevItems.map(item => 
          item.product.id === productId 
            ? { 
                ...item, 
                quantity: items.find(i => i.product.id === productId)?.quantity || item.quantity
              } 
            : item
        )
      );
      
      console.error('Failed to update item quantity:', error);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => {
    return sum + (item.product.price.amount * item.quantity);
  }, 0);

  const itemCount = items.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}