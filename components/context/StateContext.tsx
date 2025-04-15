"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Define the shape of a product
interface Product {
  id: string;
  name: string;
  priceqty:number;
  quantity: number; // Optional, as it will be added later
}

// Define the shape of the context state
interface StateContextType {
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: Product[];
  totalPrice: number;
  totalQuantities: number;
  qty: number;
  incQty: () => void;
  decQty: () => void;
  onAdd: (product: Product, quantity: number) => void;
  toggleCartItemQuantity: (id: string, value: 'inc' | 'dec') => void;
  onRemove: (product: Product) => void;
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  setTotalQuantities: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context
const Context = createContext<StateContextType | undefined>(undefined);

export const StateContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalQuantities, setTotalQuantities] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);

  const onAdd = (product: Product, quantity: number) => {
    const checkProductInCart = cartItems.find((item) => item.id === product.id);
    
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.priceqty * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    
    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct.id === product.id) return {
          ...cartProduct,
          quantity: (cartProduct.quantity || 0) + quantity // Ensure quantity is handled
        };
        return cartProduct; // Return unchanged product
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product: Product) => {
    const foundProduct = cartItems.find((item) => item.id === product.id);
    const newCartItems = cartItems.filter((item) => item.id !== product.id);

    if (foundProduct) {
      setTotalPrice((prevTotalPrice) => prevTotalPrice - (foundProduct.priceqty * (foundProduct.quantity || 1)));
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - (foundProduct.quantity || 1));
    }

    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id: string, value: 'inc' | 'dec') => {
    const foundProduct = cartItems.find((item) => item.id === id);
    const index = cartItems.findIndex((product) => product.id === id);
    const newCartItems = cartItems.filter((item) => item.id !== id);

    if (foundProduct) {
      if (value === 'inc') {
        setCartItems([...newCartItems, { ...foundProduct, quantity: (foundProduct.quantity || 0) + 1 }]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.priceqty);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
      } else if (value === 'dec') {
        if ((foundProduct.quantity || 1) > 1) {
          setCartItems([...newCartItems, { ...foundProduct, quantity: (foundProduct.quantity || 1) - 1 }]);
          setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.priceqty);
          setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
        }
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities 
      }}
    >
      {children}
    </Context.Provider>
  );
};

// Custom hook to use the context
export const useStateContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useStateContext must be used within a StateContext Provider');
  }
  return context;
};


