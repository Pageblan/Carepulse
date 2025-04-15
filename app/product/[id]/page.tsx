'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Medicine } from '@/types/appwrite.types'
import { getMedicineById } from '@/lib/actions/medicine.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStateContext } from '@/components/context/StateContext'
import { IoIosCart } from 'react-icons/io'
import Cart from '@/components/Cart'

const BuyPage: React.FC = () => {
  const { id } = useParams()
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { onAdd, qty, incQty, decQty, totalQuantities, setShowCart, showCart } = useStateContext()
  const router = useRouter()

  // Fetch medicine details
  useEffect(() => {
    const fetchMedicine = async () => {
      if (id) {
        try {
          const response = await getMedicineById(id as string);
          setMedicine(response);
        } catch (err) {
          console.error('Error fetching medicine details:', err);
          setError('Failed to fetch medicine details.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMedicine();
  }, [id]);

  // Load image blob
  const loadImage = useCallback(async (url: string) => {
    try {
      const res = await fetch(url, {
        headers: {
          'X-Appwrite-Project': process.env.NEXT_PUBLIC_PROJECT_ID!,
          'X-Appwrite-Key': process.env.NEXT_PUBLIC_API_KEY!,
        }
      })
      if (!res.ok) throw new Error('Image fetch failed')
      const blob = await res.blob()
      setImageUrl(URL.createObjectURL(blob))
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    if (medicine?.image) loadImage(medicine.image)
  }, [medicine, loadImage])

  // Handlers
  const handleAddToCart = () => {
    if (medicine) {
      const product = {
        id: medicine.$id,
        name: medicine.medicineName,
        price: medicine.Price,
        priceqty: medicine.priceqty,
        quantity: qty, // Use the current quantity
      };
      onAdd(product, qty); // Add product to cart
    }
  };
  const handleBuyNow = () => {
    if (!medicine) return
    router.push(`/product/${medicine.$id}/success`)
  }

  if (loading) return <div className="flex-grow flex items-center justify-center">Loading...</div>
  if (error)   return <div className="flex-grow flex items-center justify-center text-red-600">{error}</div>
  if (!medicine) return <div className="flex-grow flex items-center justify-center">Not found</div>

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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-gray-100 h-80 md:h-auto relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={medicine.medicineName}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="loader-sm" />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                {medicine.medicineName}
              </h1>
              <p className="text-gray-700 mb-6">
                {medicine.Description}
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-red-600 mb-4">
                Price: ${medicine.Price}
              </p>

              <div className="flex items-center mb-6">
                <button
                  onClick={decQty}
                  className="bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-l-lg hover:bg-gray-300"
                >-
                </button>
                <span className="px-4 py-1 border-t border-b border-gray-500 text-gray-700 font-semibold">
                  {qty}
                </span>
                <button
                  onClick={incQty}
                  className="bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-r-lg hover:bg-gray-300"
                >+
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default BuyPage