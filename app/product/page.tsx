'use client'

import React from 'react'
import Image from 'next/image'
import Products from '@/components/forms/products'
import { IoIosCart } from 'react-icons/io'
import { useStateContext } from '@/components/context/StateContext'
import Cart from '@/components/Cart'

const Page: React.FC = () => {
  const { totalQuantities, setShowCart, showCart } = useStateContext()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="CarePulse Logo"
            width={150}
            height={40}
            className="object-contain"
          />
          <button
            type="button"
            onClick={() => setShowCart(true)}
            className="relative text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <IoIosCart className="text-2xl" />
            {totalQuantities > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {totalQuantities}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Medicines In Stock
        </h1>

          <Products />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CarePulse
        </div>
      </footer>

      {/* Cart Overlay */}
      {showCart && <Cart />}
    </div>
  )
}

export default Page