import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { NextSeo } from 'next-seo';
import { HiFilter, HiX, HiAdjustments } from 'react-icons/hi';
import Layout from '../../components/layout/Layout';
import TourCard from '../../components/tours/TourCard';
import { toursAPI } from '../../lib/api';
import clsx from 'clsx';

const CATEGORIES = ['safari','adventure','cultural','city','nature','beach','mountain','wildlife','historical','food'];
const DIFFICULTIES= ['easy','moderate','challenging','extreme'];
const SORT_OPTIONS= [
  { value: 'created_at_DESC',         label: 'Newest First'     },
  { value: 'price_per_person_ASC',    label: 'Price: Low → High'},
  { value: 'price_per_person_DESC',   label: 'Price: High → Low'},
  { value: 'avg_rating_DESC',         label: 'Top Rated'        },
  { value: 'booking_count_DESC',      label: 'Most Popular'     },
  { value: 'duration_days_ASC',       label: 'Shortest First'   },
];

export default function ToursPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '', destination: '', category: '', difficulty: '',
    min_price: '', max_price: '', min_duration: '', max_duration: '',
    min_rating: '', sort: 'created_at', order: 'DESC',
    page: 1, limit: 12,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync URL query into filters
  useEffect(() => {
    const q = router.query;
    if (Object.keys(q).length > 0) {
      setFilters(f => ({ ...f, ...q }));
    }
  }, [router.isReady]);

  const { data, isLoading } = useQuery(
    ['tours', filters],
    () => toursAPI.getAll(filters).then(r => r.data),
    { keepPreviousData: true }
  );

  const setFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '', destination: '', category: '', difficulty: '',
      min_price: '', max_price: '', min_duration: '', max_duration: '',
      min_rating: '', sort: 'created_at', order: 'DESC',
      page: 1, limit: 12,
    });
  };

  const handleSort = (val) => {
    const [sort, order] = val.split('_').slice(-2).reduce((acc, _, i, arr) => {
      if (i === arr.length - 1) return [arr.slice(0, -1).join('_'), arr[arr.length - 1]];
      return acc;
    }, val.split('_').reduceRight((acc, cur, i, arr) => {
      if (acc.length === 0) return [cur];
      return acc;
    }, []));
    // Simple split approach
    const parts = val.split('_');
    const orderVal = parts[parts.length - 1];
    const sortVal  = parts.slice(0, -1).join('_');
    setFilters(f => ({ ...f, sort: sortVal, order: orderVal, page: 1 }));
  };

  const activeFiltersCount = [
    filters.category, filters.difficulty, filters.min_price,
    filters.max_price, filters.min_rating, filters.destination,
  ].filter(Boolean).length;

  return (
    <Layout>
      <NextSeo title="Browse All Tours" description="Explore 200+ curated African tours — safaris, adventures, beach retreats, and more." />

      {/* Header */}
      <div className="bg-gradient-to-r from-dark to-earth-900 text-white pt-28 pb-12">
        <div className="container-wide">
          <h1 className="font-display font-bold text-4xl mb-2">Explore All Tours</h1>
          <p className="text-gray-300">
            {data?.pagination?.total
              ? `${data.pagination.total} extraordinary experiences found`
              : 'Finding your perfect adventure...'}
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition-colors', activeFiltersCount > 0 ? 'bg-primary-500 text-white border-primary-500' : 'bg-white border-gray-200 text-gray-700 hover:border-primary-400')}
            >
              <HiFilter className="w-4 h-4" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
                <HiX className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={`${filters.sort}_${filters.order}`}
              onChange={(e) => handleSort(e.target.value)}
              className="input-field py-2 text-sm w-48"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={clsx(
            'w-64 flex-shrink-0 transition-all',
            sidebarOpen ? 'block' : 'hidden lg:block'
          )}>
            <div className="bg-white rounded-2xl p-5 shadow-card sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-dark">Filters</h3>
                <HiAdjustments className="w-4 h-4 text-gray-400" />
              </div>

              {/* Search */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Search</label>
                <input
                  type="text"
                  placeholder="Tour name or keyword..."
                  value={filters.search}
                  onChange={(e) => setFilter('search', e.target.value)}
                  className="input-field text-sm py-2"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter('category', filters.category === cat ? '' : cat)}
                      className={clsx(
                        'text-xs px-2.5 py-1 rounded-lg border font-medium capitalize transition-colors',
                        filters.category === cat
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Difficulty</label>
                <div className="flex flex-wrap gap-1.5">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      onClick={() => setFilter('difficulty', filters.difficulty === d ? '' : d)}
                      className={clsx(
                        'text-xs px-2.5 py-1 rounded-lg border font-medium capitalize transition-colors',
                        filters.difficulty === d
                          ? 'bg-dark text-white border-dark'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Price Range (USD)</label>
                <div className="flex gap-2 items-center">
                  <input type="number" placeholder="Min" value={filters.min_price} onChange={(e) => setFilter('min_price', e.target.value)} className="input-field text-sm py-2 w-full" min="0" />
                  <span className="text-gray-400">–</span>
                  <input type="number" placeholder="Max" value={filters.max_price} onChange={(e) => setFilter('max_price', e.target.value)} className="input-field text-sm py-2 w-full" min="0" />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Duration (days)</label>
                <div className="flex gap-2 items-center">
                  <input type="number" placeholder="Min" value={filters.min_duration} onChange={(e) => setFilter('min_duration', e.target.value)} className="input-field text-sm py-2 w-full" min="1" />
                  <span className="text-gray-400">–</span>
                  <input type="number" placeholder="Max" value={filters.max_duration} onChange={(e) => setFilter('max_duration', e.target.value)} className="input-field text-sm py-2 w-full" min="1" />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Min Rating</label>
                <div className="flex gap-1">
                  {[4, 4.5, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => setFilter('min_rating', filters.min_rating == r ? '' : r)}
                      className={clsx(
                        'flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors',
                        filters.min_rating == r
                          ? 'bg-yellow-400 text-dark border-yellow-400'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-300'
                      )}
                    >
                      ⭐ {r}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Tour Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => <div key={i} className="skeleton h-96 rounded-2xl" />)}
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="font-display font-semibold text-dark text-xl mb-2">No tours found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {data?.data?.map((tour) => <TourCard key={tour.id} tour={tour} />)}
                </div>

                {/* Pagination */}
                {data?.pagination?.pages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setFilters(f => ({ ...f, page: p }))}
                        className={clsx(
                          'w-10 h-10 rounded-xl font-medium text-sm transition-colors',
                          filters.page == p
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
