import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { NextSeo } from 'next-seo';
import { HiSearch, HiBan, HiCheckCircle } from 'react-icons/hi';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../lib/api';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const ROLE_BADGE = {
  user:        'bg-gray-100 text-gray-600',
  guide:       'bg-blue-100 text-blue-700',
  admin:       'bg-purple-100 text-purple-700',
  super_admin: 'bg-red-100 text-red-700',
};

export default function AdminUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['admin-users', page, search],
    () => adminAPI.getAllUsers({ page, limit: 20, search }).then(r => r.data),
    { keepPreviousData: true }
  );

  const statusMutation = useMutation(
    ({ id, is_active }) => adminAPI.updateUserStatus(id, is_active),
    {
      onSuccess: () => { toast.success('User updated'); qc.invalidateQueries('admin-users'); },
      onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
    }
  );

  const users = data?.data || [];

  return (
    <AdminLayout title="Users">
      <NextSeo title="Admin Users" />

      <div className="relative max-w-xs mb-6">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input type="text" placeholder="Name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field pl-9 text-sm py-2.5" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['User','Email','Role','Bookings','Joined','Status','Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading
                ? [...Array(8)].map((_, i) => <tr key={i}><td colSpan={7}><div className="skeleton h-10 m-2 rounded" /></td></tr>)
                : users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {(u.first_name?.[0] || '') + (u.last_name?.[0] || '')}
                        </div>
                        <span className="font-medium text-dark">{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                    <td className="px-4 py-3"><span className={clsx('badge text-xs capitalize', ROLE_BADGE[u.role] || 'bg-gray-100')}>{u.role}</span></td>
                    <td className="px-4 py-3 text-gray-500">{u.booking_count || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('badge text-xs', u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => statusMutation.mutate({ id: u.id, is_active: !u.is_active })}
                          className={clsx('text-xs flex items-center gap-1 font-medium transition-colors', u.is_active ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-700')}
                        >
                          {u.is_active ? <><HiBan className="w-3.5 h-3.5" /> Suspend</> : <><HiCheckCircle className="w-3.5 h-3.5" /> Activate</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {data?.pagination?.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">{data.pagination.total} total users</p>
            <div className="flex gap-1">
              {[...Array(data.pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i+1)} className={clsx('w-8 h-8 rounded text-xs font-medium', page===i+1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600')}>{i+1}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
