// components/Cart.tsx
'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStateContext } from '@/components/context/StateContext';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import getStripe from '@/lib/getStripe';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove } = useStateContext();
  const router = useRouter();
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowCart]);

  const handleCheckout = async () => {
    try {
      const stripe = await getStripe();
      console.log("Stripe: ", stripe);
    
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }), // Wrap cartItems in an object
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'An error occurred during checkout.');
        return;
      }
    
      const data = await response.json();
      toast.loading('Redirecting...');
    
      await stripe!.redirectToCheckout({ sessionId: data.id });
    } catch (ex) {
      console.log(ex);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-end z-50">
  {/* Cart container */}
  <div
    ref={cartRef}
    className="relative bg-gray-100 h-full w-full max-w-md p-6 shadow-lg flex flex-col overflow-y-auto"
  >
    {/* Header area */}
    <div className="flex items-center justify-between border-b pb-4">
      <button
        type="button"
        onClick={() => setShowCart(false)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <AiOutlineLeft size={20} />
        <span className="font-semibold">Your Cart</span>
      </button>
      <span className="text-gray-500 font-semibold">{totalQuantities} items</span>
    </div>

    {cartItems.length === 0 ? (
      <div className="flex flex-col items-center justify-center flex-1 py-10">
        <AiOutlineShopping size={150} className="text-gray-400" />
        <h3 className="text-xl font-semibold mt-6">Your shopping bag is empty</h3>
        <button
          type="button"
          onClick={() => setShowCart(false)}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Continue Shopping
        </button>
      </div>
    ) : (
      <>
        <ul className="flex-1 mt-6 space-y-6">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-white border border-gray-200 shadow-sm px-4 py-3"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                <p className="text-gray-500 text-sm">KES {item.priceqty}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCartItemQuantity(item.id, 'dec')}
                  className="bg-gray-200 p-1 rounded hover:bg-gray-300 transition"
                >
                  <AiOutlineMinus size={18} />
                </button>
                <span className="font-semibold w-6 text-center border-gray-500 text-gray-700">{item.quantity}</span>
                <button
                  onClick={() => toggleCartItemQuantity(item.id, 'inc')}
                  className="bg-gray-200 p-1 rounded hover:bg-gray-300 transition"
                >
                  <AiOutlinePlus size={18} />
                </button>
                <button
                  onClick={() => onRemove(item)}
                  className="bg-red-500 p-1 rounded text-white hover:bg-red-600 transition"
                >
                  <TiDeleteOutline size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t pt-6 mt-6">
          <div className="flex justify-between items-center text-lg font-semibold mb-4 text-gray-700">
            <span>Total:</span>
            <span>KES {totalPrice}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-bold transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </>
    )}
  </div>
</div>
  );
};

export default Cart;