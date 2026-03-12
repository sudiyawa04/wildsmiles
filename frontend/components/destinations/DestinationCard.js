import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MdTour } from 'react-icons/md';

export default function DestinationCard({ destination, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/destinations/${destination.slug}`}>
        <div className="group relative h-72 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
          <Image
            src={destination.cover_image || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80'}
            alt={destination.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-display font-bold text-white text-xl leading-tight">
              {destination.name}
            </h3>
            <p className="text-gray-200 text-sm mt-1">{destination.country}</p>
            {destination.tour_count > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <MdTour className="w-4 h-4 text-primary-400" />
                <span className="text-xs text-primary-300 font-medium">
                  {destination.tour_count} tours available
                </span>
              </div>
            )}
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg">
              Explore {destination.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
