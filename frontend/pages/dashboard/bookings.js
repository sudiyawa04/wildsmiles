import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { HiCalendar, HiLocationMarker, HiUsers, HiX, HiSearch } from 'react-icons/hi';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { bookingsAPI } from '../../lib/api';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const STATUS_BADGE = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function BookingsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['my-bookings', page],
    () => bookingsAPI.getMyBookings({ page, limit: 10 }).then(r => r.data),
    { keepPreviousData: true }
  );

  const cancelMutation = useMutation(
    (id) => bookingsAPI.cancel(id),
    {
      onSuccess: () => { toast.success('Booking cancelled'); qc.invalidateQueries('my-bookings'); },
      onError: (err) => toast.error(err.response?.data?.message || 'Cancel failed'),
    }
  );

  const bookings = data?.data?.filter(b => !search || b.tour_title?.toLowerCase().includes(search.toLowerCase()) || b.booking_ref?.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <DashboardLayout title="My Bookings">
      <NextSeo title="My Bookings" />

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search bookings or reference..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9 text-sm py-2.5"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <HiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-dark mb-2">No bookings found</h3>
          <Link href="/tours" className="btn-primary">Browse Tours</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
                {/* Tour image */}
                <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0 overflow-hidden">
                  {booking.tour_cover && (
                    <img src={booking.tour_cover} alt={booking.tour_title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-dark">{booking.tour_title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Ref: <span className="font-mono">{booking.booking_ref}</span></p>
                    </div>
                    <span className={clsx('badge text-xs capitalize', STATUS_BADGE[booking.status] || 'bg-gray-100 text-gray-600')}>{booking.status}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" />{new Date(booking.travel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><HiUsers className="w-3.5 h-3.5" />{booking.adults} adult{booking.adults !== 1 ? 's' : ''}{booking.children > 0 ? `, ${booking.children} child` : ''}</span>
                    <span className="font-semibold text-dark">${Number(booking.total_price).toLocaleString()}</span>
                  </div>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => { if (confirm('Cancel this booking?')) cancelMutation.mutate(booking.id); }}
                      className="mt-3 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                    >
                      <HiX className="w-3.5 h-3.5" /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data?.pagination?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(data.pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={clsx('w-9 h-9 rounded-xl text-sm font-medium', page === i + 1 ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600')}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
