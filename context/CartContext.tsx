"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartContextType, CartItem, MenuItem } from "../constants/types";

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
  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((cartItem) => cartItem.menuItem._id === item._id);
      let updatedCartItems;

      if (itemInCart) {
        updatedCartItems = prevItems.map((cartItem) => {
          if (cartItem.menuItem._id === item._id) {
            const newQuantity = Math.min(cartItem.quantity.valueOf() + 1, 10);
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
      } else {
        const newCartItem: CartItem = { menuItem: item, quantity: 1 };
        updatedCartItems = [...prevItems, newCartItem];
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const removeFromCart = (_id: string) => {
    setCartItems((prevItems) => {
      const updatedCartItems = prevItems.filter((cartItem) => cartItem.menuItem._id !== _id);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const updateQuantity = (_id: string, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedCartItems = prevItems.map((cartItem) =>
        (cartItem.menuItem._id === _id ? { ...cartItem, quantity } : cartItem)
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
