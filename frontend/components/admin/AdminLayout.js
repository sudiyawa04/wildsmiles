import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  HiChartBar, HiCalendar, HiGlobe, HiUsers, HiStar,
  HiLogout, HiMenu, HiChevronRight,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const NAV = [
  { href: '/admin',          label: 'Overview',   icon: HiChartBar  },
  { href: '/admin/bookings', label: 'Bookings',   icon: HiCalendar  },
  { href: '/admin/tours',    label: 'Tours',      icon: HiGlobe     },
  { href: '/admin/users',    label: 'Users',      icon: HiUsers     },
  { href: '/admin/reviews',  label: 'Reviews',    icon: HiStar      },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !['admin', 'super_admin'].includes(user.role)) {
      router.replace('/dashboard');
    } else if (user === null) {
      router.replace('/login');
    }
  }, [user]);

  if (!user || !['admin', 'super_admin'].includes(user.role)) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-60 bg-dark text-white flex flex-col transition-transform lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-5 border-b border-white/10">
          <Link href="/admin"><Image src="/images/logowild.png" alt="WildSmiles" width={120} height={36} className="brightness-0 invert" /></Link>
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                router.pathname === href ? 'bg-primary-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <HiChevronRight className="w-4 h-4" /> User Dashboard
          </Link>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors w-full">
            <HiLogout className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setOpen(true)} className="lg:hidden text-gray-500"><HiMenu className="w-6 h-6" /></button>
          <h1 className="font-display font-semibold text-dark text-lg">{title}</h1>
          <div className="ml-auto text-sm text-gray-500">{user.first_name} {user.last_name}</div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
