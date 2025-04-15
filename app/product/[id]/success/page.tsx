'use client'

import React from 'react';
import Link from 'next/link';

const SuccessPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-green-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Purchase Successful!</h1>
        <p className="text-lg text-gray-700 mb-6">Thank you for your purchase! Your order has been placed successfully.</p>
        <Link href="/" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;