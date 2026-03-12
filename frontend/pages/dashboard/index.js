import { useQuery } from 'react-query';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { HiCalendar, HiHeart, HiStar, HiArrowRight } from 'react-icons/hi';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { bookingsAPI, usersAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const STATUS_BADGE = {
  confirmed:  'bg-green-100   text-green-700',
  pending:    'bg-yellow-100  text-yellow-700',
  cancelled:  'bg-red-100     text-red-700',
  completed:  'bg-blue-100    text-blue-700',
};

export default function DashboardIndex() {
  const { user } = useAuth();
  const { data: bookingsData } = useQuery('my-bookings', () => bookingsAPI.getMyBookings({ limit: 3 }).then(r => r.data));
  const { data: wishlistData }  = useQuery('wishlist', () => usersAPI.getWishlist().then(r => r.data));

  const bookings  = bookingsData?.data || [];
  const wishlist  = wishlistData?.data || [];
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <DashboardLayout title="Overview">
      <NextSeo title="Dashboard" />

      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white mb-6">
        <h2 className="font-display font-bold text-2xl mb-1">Welcome back, {user?.first_name}! 👋</h2>
        <p className="text-white/80 text-sm">Ready for your next adventure?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings" value={bookingsData?.pagination?.total || 0} icon={<HiCalendar />} color="text-primary-500" />
        <StatCard label="Confirmed"      value={confirmed} icon={<HiCalendar />} color="text-green-500" />
        <StatCard label="Wishlisted"     value={wishlist.length} icon={<HiHeart />} color="text-red-400" />
        <StatCard label="Reviews Left"   value={0} icon={<HiStar />} color="text-yellow-500" />
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark">Recent Bookings</h3>
          <Link href="/dashboard/bookings" className="text-xs text-primary-500 hover:underline flex items-center gap-1">See all <HiArrowRight className="w-3 h-3" /></Link>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <HiCalendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No bookings yet</p>
            <Link href="/tours" className="btn-primary mt-3 text-sm inline-block">Explore Tours</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-dark text-sm">{b.tour_title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Ref: {b.booking_ref} • {new Date(b.travel_date).toLocaleDateString()}</p>
                </div>
                <span className={clsx('badge text-xs', STATUS_BADGE[b.status] || 'bg-gray-100 text-gray-600')}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/tours" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-md transition-all group">
          <p className="font-semibold text-dark mb-1 group-hover:text-primary-600 transition-colors">Browse Tours</p>
          <p className="text-xs text-gray-400">Find your next adventure</p>
        </Link>
        <Link href="/ai-planner" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-md transition-all group">
          <p className="font-semibold text-dark mb-1 group-hover:text-primary-600 transition-colors">AI Trip Planner</p>
          <p className="text-xs text-gray-400">Build a custom itinerary</p>
        </Link>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className={clsx('w-8 h-8 mb-3', color)}>{icon}</div>
      <p className="text-2xl font-bold text-dark">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
