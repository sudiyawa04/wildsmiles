import { useQuery, useMutation, useQueryClient } from 'react-query';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Image from 'next/image';
import { HiHeart, HiLocationMarker, HiClock, HiStar } from 'react-icons/hi';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { usersAPI } from '../../lib/api';
import { toast } from 'react-toastify';

export default function WishlistPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery('wishlist', () => usersAPI.getWishlist().then(r => r.data));

  const removeMutation = useMutation(
    (tourId) => usersAPI.toggleWishlist(tourId),
    {
      onSuccess: (_, tourId) => {
        toast.success('Removed from wishlist');
        qc.invalidateQueries('wishlist');
      },
    }
  );

  const items = data?.data || [];

  return (
    <DashboardLayout title="My Wishlist">
      <NextSeo title="My Wishlist" />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <HiHeart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="font-semibold text-dark mb-2">Your wishlist is empty</h3>
          <p className="text-gray-400 text-sm mb-5">Browse tours and save your favourites</p>
          <Link href="/tours" className="btn-primary">Browse Tours</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div key={item.tour_id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={item.cover_image || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeMutation.mutate(item.tour_id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                >
                  <HiHeart className="w-4 h-4 text-red-500 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-dark text-sm mb-1 line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  {item.destination_name && <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5" />{item.destination_name}</span>}
                  {item.duration_days && <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" />{item.duration_days}d</span>}
                  {item.avg_rating > 0 && <span className="flex items-center gap-1 text-yellow-500"><HiStar className="w-3.5 h-3.5" />{item.avg_rating}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-primary-500">${Number(item.price_per_person).toLocaleString()}<span className="text-xs text-gray-400 font-normal">/person</span></p>
                  <Link href={`/tours/${item.slug}`} className="text-xs btn-secondary py-1.5">View Tour</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
