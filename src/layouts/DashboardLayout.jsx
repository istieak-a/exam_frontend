'use client';

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
