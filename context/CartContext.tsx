"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartContextType, CartItem, MenuItem, MerchItem } from "../constants/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = () => {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
      setLoading(false);
    };

    loadCartItems();
  }, []);

  const addToCart = (item: MenuItem | MerchItem) => {
    setCartItems((prevItems) => {
      const itemKey = item.hasOwnProperty('imagePath') ? 'merchItem' : 'menuItem';
      const itemId = item._id;
      const itemInCart = prevItems.find(cartItem => cartItem[itemKey]?._id === itemId);
      let updatedCartItems;
      if (itemInCart) {
        updatedCartItems = prevItems.map(cartItem => {
          if (cartItem[itemKey]?._id === itemId) {
            const newQuantity = Math.min(cartItem.quantity + 1, 10);
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
      } else {
        const newCartItem = { [itemKey]: item, quantity: 1 } as CartItem;
        updatedCartItems = [...prevItems, newCartItem];
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const removeFromCart = (_id: string) => {
    setCartItems((prevItems) => {
      const updatedCartItems = prevItems.filter(cartItem => cartItem.menuItem?._id !== _id && cartItem.merchItem?._id !== _id);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const updateQuantity = (_id: string, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedCartItems = prevItems.map(cartItem =>
        (cartItem.menuItem?._id === _id || cartItem.merchItem?._id === _id ? { ...cartItem, quantity } : cartItem)
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
