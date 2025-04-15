'use client'

import { useCallback, useEffect, useState } from 'react'
import { Medicine } from '@/types/appwrite.types'
import { listMedicines } from '@/lib/actions/medicine.actions'
import Image from 'next/image'
import Link from 'next/link'

const MedicinePage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<Record<string,string>>({})

  useEffect(() => {
    listMedicines()
      .then(setMedicines)
      .catch((err) => {
        console.error(err)
        setError('Failed to fetch medicines.')
      })
      .finally(() => setLoading(false))
  }, [])

  const loadImage = useCallback(async (url: string, id: string) => {
    try {
      const res = await fetch(url, {
        headers: {
          'X-Appwrite-Project': process.env.NEXT_PUBLIC_PROJECT_ID!,
          'X-Appwrite-Key': process.env.NEXT_PUBLIC_API_KEY!,
        }
      })
      if (!res.ok) throw new Error('Image fetch failed')
      const blob = await res.blob()
      setImages((prev) => ({ ...prev, [id]: URL.createObjectURL(blob) }))
    } catch (e) {
      console.error(e)
    }
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="loader" /></div>
  if (error)   return <div className="text-center py-12 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Medicines In Stock
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((med) => {
            const key = `med-${med.$id}`
            if (!images[key]) loadImage(med.image, key)

            return (
              <div
                key={med.$id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
              >
                <Link
                  href={`/product/${med.$id}`}
                  className="block overflow-hidden rounded-t-lg relative w-full h-48 bg-gray-100"
                >
                  {images[key] ? (
                    <Image
                      src={images[key]}
                      alt={med.medicineName}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="hover:scale-105 transform transition-transform duration-200"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="loader-sm" />
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-1">
                    {med.medicineName}
                  </h2>
                  <p className="text-red-600 font-semibold">${med.Price}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MedicinePage