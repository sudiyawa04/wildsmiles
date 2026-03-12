import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import { HiLocationMarker, HiExclamationCircle } from 'react-icons/hi';
import Layout from '../../components/layout/Layout';
import TourCard from '../../components/tours/TourCard';
import { destinationsAPI, toursAPI } from '../../lib/api';
import { STATIC_DESTINATIONS, STATIC_TOURS } from '../../lib/staticData';

export default function DestinationDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { data: destData, isLoading: destLoading, error } = useQuery(
    ['destination', slug],
    () => destinationsAPI.getBySlug(slug).then(r => r.data.data),
    { enabled: !!slug }
  );

  const { data: toursData } = useQuery(
    ['destination-tours', destData?.id],
    () => toursAPI.getAll({ destination_id: destData.id, limit: 6 }).then(r => r.data),
    { enabled: !!destData?.id }
  );

  const staticDest = STATIC_DESTINATIONS[slug];
  const staticTours = staticDest
    ? Object.values(STATIC_TOURS).filter(t => t.destination_name?.toLowerCase() === staticDest?.name?.toLowerCase()).slice(0, 6)
    : [];

  if (destLoading) return (
    <Layout><div className="container-wide pt-28 pb-12"><div className="skeleton h-96 rounded-2xl" /></div></Layout>
  );

  if ((error || !destData) && !staticDest) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <HiExclamationCircle className="w-12 h-12 text-red-400" />
        <h2 className="font-display text-2xl font-bold">Destination not found</h2>
        <Link href="/destinations" className="btn-primary">All Destinations</Link>
      </div>
    </Layout>
  );

  const dest = destData || staticDest;
  const tours = toursData?.data?.length ? toursData.data : staticTours;

  return (
    <Layout>
      <NextSeo
        title={dest.name}
        description={dest.description}
        openGraph={{ images: [{ url: dest.cover_image }] }}
      />

      {/* Hero */}
      <div className="relative h-[70vh]">
        <Image src={dest.cover_image || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80'} alt={dest.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-0 right-0 container-wide text-white">
          <p className="text-sm text-white/70 mb-2 flex items-center gap-1"><HiLocationMarker className="w-4 h-4" />{dest.country}, Africa</p>
          <h1 className="font-display font-bold text-5xl mb-3">{dest.name}</h1>
          <p className="text-white/80 max-w-2xl">{dest.tagline || dest.description?.slice(0, 130)}</p>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="section-title text-2xl mb-4">About {dest.name}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">{dest.description}</p>

            {dest.best_time_to_visit && (
              <div className="bg-primary-50 rounded-2xl p-5 mb-8">
                <h3 className="font-semibold text-dark mb-1">Best Time to Visit</h3>
                <p className="text-gray-600 text-sm">{dest.best_time_to_visit}</p>
              </div>
            )}

            {tours.length > 0 && (
              <>
                <h2 className="section-title text-2xl mb-5">Tours in {dest.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {tours.map(tour => <TourCard key={tour.id} tour={tour} />)}
                </div>
                {toursData?.pagination?.total > 6 && (
                  <div className="text-center mt-6">
                    <Link href={`/tours?destination=${dest.slug}`} className="btn-primary">View All {toursData.pagination.total} Tours</Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-4">
              <h3 className="font-semibold text-dark">Quick Facts</h3>
              <FactRow label="Country" value={dest.country} />
              <FactRow label="Region" value={dest.region} />
              <FactRow label="Climate" value={dest.climate} />
              <FactRow label="Language" value={dest.language} />
              <FactRow label="Currency" value={dest.currency} />
              <FactRow label="Timezone" value={dest.timezone} />
              {dest.visa_info && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Visa Info</p>
                  <p className="text-sm text-dark">{dest.visa_info}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FactRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-dark">{value}</p>
    </div>
  );
}
