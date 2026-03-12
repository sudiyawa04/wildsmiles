import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiStar, HiClock, HiUsers, HiHeart } from 'react-icons/hi';
import { MdOutlinePlace } from 'react-icons/md';
import clsx from 'clsx';

const categoryColors = {
  safari:     'bg-amber-100 text-amber-700',
  adventure:  'bg-red-100 text-red-700',
  cultural:   'bg-purple-100 text-purple-700',
  city:       'bg-blue-100 text-blue-700',
  nature:     'bg-green-100 text-green-700',
  beach:      'bg-cyan-100 text-cyan-700',
  wildlife:   'bg-orange-100 text-orange-700',
  mountain:   'bg-slate-100 text-slate-700',
  historical: 'bg-rose-100 text-rose-700',
  food:       'bg-yellow-100 text-yellow-700',
};

export default function TourCard({ tour, className }) {
  const catClass = categoryColors[tour.category] || 'bg-gray-100 text-gray-700';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={clsx('card group overflow-hidden', className)}
    >
      <Link href={`/tours/${tour.slug}`}>
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={tour.cover_image || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600'}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Category badge */}
          <span className={clsx('absolute top-3 left-3 badge capitalize font-semibold', catClass)}>
            {tour.category}
          </span>

          {/* Wishlist button */}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow">
            <HiHeart className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>

          {/* Price */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow">
            <span className="text-xs text-gray-500">From</span>
            <p className="font-bold text-primary-600 text-sm">${tour.price_per_person?.toLocaleString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <MdOutlinePlace className="w-3.5 h-3.5" />
            <span>{tour.destination_name}, {tour.country}</span>
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-dark text-base leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {tour.title}
          </h3>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <HiClock className="w-3.5 h-3.5" />
              {tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <HiUsers className="w-3.5 h-3.5" />
              Max {tour.group_size_max}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <HiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-dark">
                {tour.avg_rating > 0 ? parseFloat(tour.avg_rating).toFixed(1) : 'New'}
              </span>
              {tour.review_count > 0 && (
                <span className="text-xs text-gray-400">({tour.review_count})</span>
              )}
            </div>
            <span className="text-xs font-medium text-primary-600 hover:underline">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
