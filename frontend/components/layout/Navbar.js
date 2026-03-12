import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiMenu, HiX, HiUser, HiHeart, HiLogout,
  HiChevronDown, HiBell,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const navLinks = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Tours',        href: '/tours'        },
  { label: 'Experiences',  href: '/experiences'  },
  { label: 'Community',    href: '/community'    },
  { label: 'About',        href: '/about'        },
  { label: 'Contact',      href: '/contact'      },
];

export default function Navbar() {
  const { user, logout }  = useAuth();
  const router            = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isHome = router.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [router.pathname]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        transparent
          ? 'bg-transparent'
          : 'bg-white shadow-md'
      )}
    >
        <div className="container-wide flex items-center justify-between h-18 md:h-22" style={{height: '96px'}}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/images/logowild.png"
            alt="WildSmiles"
            width={240}
            height={72}
            className="h-16 md:h-20 w-auto object-contain drop-shadow-md"
            priority
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className={clsx('font-display font-black text-base md:text-lg tracking-tight', transparent ? 'text-white' : 'text-dark')}>WildSmiles</span>
            <span className={clsx('text-xs font-medium tracking-wide', transparent ? 'text-white/70' : 'text-gray-500')}>Tours &amp; Travel</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                transparent
                  ? 'text-white hover:bg-white/20'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50',
                router.pathname.startsWith(link.href) && !transparent && 'text-primary-600 bg-primary-50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-xl transition-colors',
                  transparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.first_name} width={30} height={30} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium">{user.first_name}</span>
                <HiChevronDown className={clsx('w-4 h-4 transition-transform', userMenuOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="font-semibold text-dark">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700">
                      <HiUser className="w-4 h-4" /> My Dashboard
                    </Link>
                    <Link href="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700">
                      <HiHeart className="w-4 h-4" /> Wishlist
                    </Link>
                    {['admin', 'super_admin'].includes(user.role) && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 text-sm text-primary-600 font-medium">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); router.push('/'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-500 border-t border-gray-50"
                    >
                      <HiLogout className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  transparent ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:text-primary-600'
                )}
              >
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className={clsx('lg:hidden p-2 rounded-lg', transparent ? 'text-white' : 'text-gray-700')}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="container-wide py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn-primary justify-center">My Dashboard</Link>
                    <button onClick={() => logout()} className="btn-secondary justify-center text-red-500 border-red-200">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login"    className="btn-secondary justify-center">Sign In</Link>
                    <Link href="/register" className="btn-primary  justify-center">Get Started Free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
