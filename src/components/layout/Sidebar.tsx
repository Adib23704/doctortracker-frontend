'use client';

import { LayoutDashboard, LogOut, Stethoscope, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: 'Doctors',
      href: '/doctors',
      icon: Stethoscope,
      active: pathname.startsWith('/doctors'),
    },
    {
      label: 'Patients',
      href: '/patients',
      icon: Users,
      active: pathname.startsWith('/patients'),
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-sm font-semibold tracking-tight text-slate-900">
              Doctor Tracker
            </span>
            <span className="block text-[11px] font-medium text-teal-700">
              Care Guide BD Portal
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Clinical Operations
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    item.active
                      ? 'bg-teal-50 text-teal-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      item.active ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
            <div className="min-w-0 pr-2">
              <p className="truncate text-xs font-semibold text-slate-800">
                {user?.name || 'Administrator'}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {user?.email || 'admin@doctortracker.com'}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign out of portal"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-rose-600 hover:shadow-xs"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
