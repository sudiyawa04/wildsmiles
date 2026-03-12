import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { NextSeo } from 'next-seo';
import { HiSearch, HiChevronDown } from 'react-icons/hi';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../lib/api';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const STATUS_OPTS = ['pending','confirmed','processing','cancelled','completed','refunded'];

const BADGE = {
  confirmed:  'bg-green-100 text-green-700',
  pending:    'bg-yellow-100 text-yellow-700',
  cancelled:  'bg-red-100 text-red-700',
  completed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  refunded:   'bg-gray-100 text-gray-600',
};

export default function AdminBookings() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['admin-bookings', page, search, statusFilter],
    () => adminAPI.getAllBookings({ page, limit: 20, search, status: statusFilter }).then(r => r.data),
    { keepPreviousData: true }
  );

  const updateMutation = useMutation(
    ({ id, status }) => adminAPI.updateBookingStatus(id, status),
    {
      onSuccess: () => { toast.success('Booking updated'); qc.invalidateQueries('admin-bookings'); },
      onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
    }
  );

  const bookings = data?.data || [];

  return (
    <AdminLayout title="Bookings">
      <NextSeo title="Admin Bookings" />

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Reference, tour or guest..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field pl-9 text-sm py-2.5" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm py-2.5 w-40">
          <option value="">All statuses</option>
          {STATUS_OPTS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Reference','Tour','Guest','Date','People','Total','Status','Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading
                ? [...Array(10)].map((_, i) => <tr key={i}><td colSpan={8}><div className="skeleton h-10 m-2 rounded" /></td></tr>)
                : bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{b.booking_ref}</td>
                    <td className="px-4 py-3 font-medium text-dark max-w-[180px] truncate">{b.tour_title}</td>
                    <td className="px-4 py-3 text-gray-600">{b.first_name} {b.last_name}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(b.travel_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-500">{b.adults}A {b.children > 0 ? `${b.children}C` : ''}</td>
                    <td className="px-4 py-3 font-semibold text-dark">${Number(b.total_price).toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={clsx('badge text-xs capitalize', BADGE[b.status] || 'bg-gray-100')}>{b.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={b.status}
                          onChange={e => updateMutation.mutate({ id: b.id, status: e.target.value })}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white hover:border-primary-300 transition-colors appearance-none pr-6"
                        >
                          {STATUS_OPTS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                        <HiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination?.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Showing {bookings.length} of {data.pagination.total}</p>
            <div className="flex gap-1">
              {[...Array(data.pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i+1)} className={clsx('w-8 h-8 rounded text-xs font-medium', page===i+1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{i+1}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
