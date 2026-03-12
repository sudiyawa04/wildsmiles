import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { HiHome, HiCalendar, HiHeart, HiUser, HiLogout, HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard',           label: 'Overview',  icon: HiHome     },
  { href: '/dashboard/bookings',  label: 'My Bookings', icon: HiCalendar },
  { href: '/dashboard/wishlist',  label: 'Wishlist',  icon: HiHeart    },
  { href: '/dashboard/profile',   label: 'Profile',   icon: HiUser     },
];

export default function DashboardLayout({ children, title }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) router.replace('/login?redirect=/dashboard');
  }, [user]);

  if (!user) return null;

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-dark text-white flex flex-col transition-transform lg:translate-x-0 lg:static lg:flex',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            <Image src="/images/logowild.png" alt="WildSmiles" width={130} height={40} className="brightness-0 invert" />
          </Link>
        </div>

        {/* User info */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user.first_name} {user.last_name}</p>
            <p className="text-white/40 text-xs truncate">{user.email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                router.pathname === href ? 'bg-primary-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
          >
            <HiLogout className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-dark">
            <HiMenu className="w-6 h-6" />
          </button>
          <h1 className="font-display font-semibold text-dark text-lg">{title}</h1>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
