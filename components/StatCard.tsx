import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface StatCardProps {
  type: 'appointments' | 'pending' | 'cancelled' | 'all';
  count: number;
  label: string;
  icon: string;
  isActive?: boolean;
}

const StatCard = ({ count = 0, label, icon, type, isActive }: StatCardProps) => {
  return (
    <div
      className={clsx(
        'stat-card p-4 rounded-lg shadow-md transition border-2',
        {
          'bg-appointments': type === 'appointments',
          'bg-pending': type === 'pending',
          'bg-cancelled': type === 'cancelled',
          'bg-all': type === 'all', // optional: define a background for the "all" type if desired
          'border-blue-500': isActive,
          'border-transparent': !isActive,
        }
      )}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt={label}
          className="w-fit"
        />
        <div>
          <h2 className="text-32-bold text-white">{count}</h2>
          <p className="text-14-regular text-white">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
