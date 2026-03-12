import { useQuery } from 'react-query';
import { NextSeo } from 'next-seo';
import { HiUsers, HiCalendar, HiGlobe, HiStar, HiTrendingUp } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../lib/api';
import clsx from 'clsx';

export default function AdminOverview() {
  const { data: overview, isLoading } = useQuery('admin-overview', () => adminAPI.getOverview().then(r => r.data.data));
  const { data: revenue } = useQuery('admin-revenue', () => adminAPI.getRevenueAnalytics().then(r => r.data.data));

  const kpis = [
    { label: 'Total Users',    value: overview?.users?.total        || 0, change: `+${overview?.users?.new_this_month    || 0} this month`, icon: HiUsers,    color: 'bg-blue-500'   },
    { label: 'Total Bookings', value: overview?.bookings?.total     || 0, change: `+${overview?.bookings?.this_month     || 0} this month`, icon: HiCalendar, color: 'bg-primary-500'},
    { label: 'Active Tours',   value: overview?.tours?.active       || 0, change: `${overview?.tours?.total || 0} total`,                  icon: HiGlobe,    color: 'bg-green-500'  },
    { label: 'Avg Rating',     value: overview?.reviews?.avg_rating || '—', change: `${overview?.reviews?.total || 0} reviews`,            icon: HiStar,     color: 'bg-yellow-500' },
  ];

  return (
    <AdminLayout title="Overview">
      <NextSeo title="Admin Overview" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4', k.color)}>
              <k.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-dark">{k.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{k.label}</p>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><HiTrendingUp className="w-3 h-3" />{k.change}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-dark mb-4">Monthly Revenue</h2>
        {revenue?.monthly ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue.monthly}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : <div className="h-64 skeleton rounded-xl" />}
      </div>

      {/* Top Tours + Recent bookings */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-dark mb-4">Top Performing Tours</h2>
          <div className="space-y-3">
            {revenue?.top_tours?.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.booking_count} bookings</p>
                </div>
                <p className="text-sm font-semibold text-primary-500">${Number(t.total_revenue || 0).toLocaleString()}</p>
              </div>
            )) ?? <p className="text-gray-400 text-sm">No data</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-dark mb-4">Revenue by Category</h2>
          <div className="space-y-2">
            {revenue?.by_category?.map((cat) => {
              const max = revenue.by_category.reduce((m, c) => Math.max(m, c.total), 0);
              const pct = max > 0 ? (cat.total / max) * 100 : 0;
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-dark font-medium">{cat.category}</span>
                    <span className="text-gray-500">${Number(cat.total).toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            }) ?? <p className="text-gray-400 text-sm">No data</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
