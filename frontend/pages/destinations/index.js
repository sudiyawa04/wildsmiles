import { useQuery } from 'react-query';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HiLocationMarker, HiGlobe, HiStar } from 'react-icons/hi';
import Layout from '../../components/layout/Layout';
import { destinationsAPI } from '../../lib/api';

export default function DestinationsPage() {
  const { data, isLoading } = useQuery('destinations', () => destinationsAPI.getAll().then(r => r.data));
  const destinations = data?.data || [];

  return (
    <Layout>
      <NextSeo title="Destinations" description="Explore Africa's most breathtaking destinations — from the Serengeti to Zanzibar." />

      {/* Header */}
      <div className="bg-gradient-to-r from-dark to-earth-800 text-white pt-28 pb-14">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm mb-4">
            <HiGlobe className="text-primary-400 w-4 h-4" /> 30+ Destinations
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Explore Africa</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">From vast savannahs to tropical islands — discover destinations that will change you forever</p>
        </div>
      </div>

      <div className="container-wide py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/destinations/${dest.slug}`} className="block group">
                  <div className="relative h-72 rounded-2xl overflow-hidden shadow-card">
                    <Image
                      src={dest.cover_image || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80'}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {dest.is_featured && (
                      <div className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Featured</div>
                    )}

                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="font-display font-bold text-white text-xl mb-1">{dest.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-white/70 text-sm">
                          <HiLocationMarker className="w-4 h-4" />{dest.country}
                        </span>
                        <span className="bg-white/20 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full">
                          {dest.tour_count || 0} tours
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
