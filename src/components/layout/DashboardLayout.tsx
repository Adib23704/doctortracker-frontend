'use client';

import type React from 'react';
import { useState } from 'react';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            title={title}
            subtitle={subtitle}
          />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
