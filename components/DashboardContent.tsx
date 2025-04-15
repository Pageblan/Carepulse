// components/DashboardContent.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import { columns } from '@/components/table/columns';
import { DataTable } from '@/components/table/DataTabel';

interface Appointment {
  id: string;
  status: string;
  // ... additional appointment properties
}

interface AppointmentsData {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: Appointment[];
}

interface DashboardContentProps {
  appointments: AppointmentsData;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ appointments }) => {
  // State to track the currently selected filter ('all' means no filter is applied)
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter the appointment data based on the current filterStatus state.
  // If "all" is selected, show all records.
  const filteredData =
    filterStatus === 'all'
      ? appointments.documents
      : appointments.documents.filter((app) => app.status === filterStatus);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header flex items-center justify-between py-4">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header text-3xl font-bold">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>
        <section className="admin-stat flex flex-wrap items-center gap-4">
            {/* All Appointments Card */}
            <div onClick={() => setFilterStatus('all')} className="cursor-pointer">
                <StatCard
                type="all"
                count={
                    appointments.scheduledCount +
                    appointments.pendingCount +
                    appointments.cancelledCount
                }
                label="All Appointments"
                icon="/assets/icons/all.png"
                isActive={filterStatus === 'all'}
                />
            </div>
            {/* Other cards follow... */}
            <div onClick={() => setFilterStatus('scheduled')} className="cursor-pointer">
                <StatCard
                type="appointments"
                count={appointments.scheduledCount}
                label="Scheduled appointments"
                icon="/assets/icons/appointments.svg"
                isActive={filterStatus === 'scheduled'}
                />
            </div>
            <div onClick={() => setFilterStatus('pending')} className="cursor-pointer">
                <StatCard
                type="pending"
                count={appointments.pendingCount}
                label="Pending appointments"
                icon="/assets/icons/pending.svg"
                isActive={filterStatus === 'pending'}
                />
            </div>
            <div onClick={() => setFilterStatus('cancelled')} className="cursor-pointer">
                <StatCard
                type="cancelled"
                count={appointments.cancelledCount}
                label="Cancelled appointments"
                icon="/assets/icons/cancelled.svg"
                isActive={filterStatus === 'cancelled'}
                />
            </div>
        </section>

        <section className="mt-8">
          <DataTable columns={columns} data={filteredData} />
        </section>
      </main>
    </div>
  );
};

export default DashboardContent;
