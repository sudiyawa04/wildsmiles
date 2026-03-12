import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiStar, HiClock, HiUsers, HiLocationMarker, HiHeart,
  HiChevronLeft, HiChevronRight, HiCheck, HiShieldCheck,
  HiExclamationCircle,
} from 'react-icons/hi';
import { HiArrowRightCircle } from 'react-icons/hi2';
import Layout from '../../components/layout/Layout';
import ReviewCard from '../../components/reviews/ReviewCard';
import { toursAPI, bookingsAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { STATIC_TOURS } from '../../lib/staticData';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const DIFF_COLOR = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  challenging: 'bg-orange-100 text-orange-700',
  extreme: 'bg-red-100 text-red-700',
};

export default function TourDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();
  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState('itinerary');
  const [imgIndex,  setImgIndex]  = useState(0);
  const [booking, setBooking]     = useState({ date: '', adults: 1, children: 0, promo: '' });
  const [promoApplied, setPromoApplied] = useState(null);

  const { data, isLoading, error } = useQuery(
    ['tour', slug],
    () => toursAPI.getBySlug(slug).then(r => r.data.data),
    { enabled: !!slug }
  );

  const bookMutation = useMutation(
    (payload) => bookingsAPI.createTour(payload),
    {
      onSuccess: (res) => {
        toast.success('Booking confirmed! Check your email.');
        router.push(`/dashboard/bookings?ref=${res.data.data.booking_ref}`);
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Booking failed'),
    }
  );

  const staticTour = STATIC_TOURS[slug];

  if (isLoading && !staticTour) return (
    <Layout>
      <div className="pt-24 pb-12 container-wide">
        <div className="skeleton h-96 rounded-2xl mb-6" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="skeleton h-10 w-64 rounded" />
            <div className="skeleton h-4 w-full rounded" />
          </div>
          <div className="skeleton h-72 rounded-2xl" />
        </div>
      </div>
    </Layout>
  );

  if ((error || !data) && !staticTour) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <HiExclamationCircle className="w-12 h-12 text-red-400" />
        <h2 className="font-display text-2xl font-bold">Tour not found</h2>
        <Link href="/tours" className="btn-primary">Browse All Tours</Link>
      </div>
    </Layout>
  );

  // Merge API data with static fallback (API wins if available)
  const mergedData = data || staticTour;
  if (!data && staticTour && staticTour.itinerary) {
    staticTour.itinerary = staticTour.itinerary; // already set
  }

  const tour = mergedData;
  const images = tour.images && tour.images.length > 0 ? tour.images : [tour.cover_image];

  // Resolve includes/excludes — DB fields are `inclusions`/`exclusions`
  const inclusions = Array.isArray(tour.inclusions) ? tour.inclusions
    : tour.inclusions ? JSON.parse(tour.inclusions)
    : ['Professional English-speaking guide', 'Transport in customised 4WD safari vehicle',
       'All park & conservancy entrance fees', 'Accommodation throughout tour (as specified)',
       'Full board meals — breakfast, lunch & dinner', 'Airport / hotel transfers',
       'Bottled water on all drives', '24/7 WildSmiles in-country support'];

  const exclusions = Array.isArray(tour.exclusions) ? tour.exclusions
    : tour.exclusions ? JSON.parse(tour.exclusions)
    : ['International & domestic flights', 'Visa fees',
       'Travel insurance (strongly recommended)', 'Gratuities for guides and lodge staff',
       'Premium alcoholic beverages & personal items', 'Optional activities not listed',
       'Laundry services'];

  const itineraryDays = tour.itinerary && tour.itinerary.length > 0
    ? tour.itinerary
    : Array.from({ length: tour.duration_days || 3 }, (_, i) => ({
        day_number: i + 1,
        title: i === 0 ? 'Arrival & Welcome Briefing'
             : i === (tour.duration_days || 3) - 1 ? 'Farewell Breakfast & Departure Transfer'
             : `Day ${i + 1} — ${tour.category === 'safari' ? 'Morning & Afternoon Game Drives'
                : tour.category === 'beach' ? 'Coastal Exploration & Water Activities'
                : tour.category === 'adventure' ? 'Full Day Adventure Activities'
                : tour.category === 'cultural' ? 'Cultural Immersion & Guided Tours'
                : 'Guided Exploration & Activities'}`,
        description: i === 0
          ? `Arrive at ${tour.destination_name || 'your destination'} and transfer to your lodge. Meet your WildSmiles guide for an evening orientation briefing and welcome dinner under the stars.`
          : i === (tour.duration_days || 3) - 1
          ? `Enjoy a leisurely final breakfast at the lodge. Time to explore local markets or take one last look at the scenery before your private transfer to the airport. Tour ends with lasting memories.`
          : `Rise early for a morning ${tour.category === 'safari' ? 'game drive during the golden hour — prime time for big cat sightings and elephant herds' : 'exploration session in the region'}. Return for a hot lunch and a brief midday rest before an afternoon session. End the day around the campfire with a team dinner under the expansive African sky.`,
        location: tour.destination_name || '',
        accommodation: i < (tour.duration_days || 3) - 1 ? 'Lodge/camp as per booking confirmation' : null,
        meals: i < (tour.duration_days || 3) - 1 ? 'Breakfast, Lunch & Dinner' : 'Breakfast only',
      }));

  const prevImg = () => setImgIndex(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex(i => (i + 1) % images.length);

  const calcPrice = () => {
    const base = (booking.adults * (tour.price_per_person || 0)) + (booking.children * (tour.price_child || 0));
    if (promoApplied) {
      if (promoApplied.discount_type === 'percentage') return base * (1 - promoApplied.discount_value / 100);
      return Math.max(0, base - promoApplied.discount_value);
    }
    return base;
  };

  const handleBook = () => {
    if (!user) { router.push(`/login?redirect=/tours/${slug}`); return; }
    if (!booking.date) { toast.error('Please select a departure date'); return; }
    bookMutation.mutate({
      tour_id: tour.id,
      travel_date: booking.date,
      adults: booking.adults,
      children: booking.children,
      promo_code: booking.promo || undefined,
    });
  };

  const applyPromo = async () => {
    // Promo validation done server-side on booking; provide visual feedback only
    toast.info('Promo code will be applied at checkout');
    setPromoApplied({ discount_type: 'percentage', discount_value: 10 }); // Optimistic UI
  };

  return (
    <Layout>
      <NextSeo
        title={tour.title}
        description={tour.description}
        openGraph={{ images: [{ url: tour.cover_image }] }}
      />

      {/* Hero Gallery */}
      <div className="relative w-full h-[70vh] bg-dark overflow-hidden">
        <Image
          src={images[imgIndex] || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80'}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full transition">
              <HiChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full transition">
              <HiChevronRight className="w-6 h-6 text-white" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIndex(i)} className={clsx('w-2 h-2 rounded-full transition-all', i === imgIndex ? 'bg-white w-5' : 'bg-white/50')} />
              ))}
            </div>
          </>
        )}

        {/* Breadcrumb */}
        <div className="absolute top-24 left-8 flex items-center gap-2 text-white/80 text-sm">
          <Link href="/" className="hover:text-white">Home</Link>
          <HiChevronRight className="w-4 h-4" />
          <Link href="/tours" className="hover:text-white">Tours</Link>
          <HiChevronRight className="w-4 h-4" />
          <span className="text-white font-medium line-clamp-1 max-w-xs">{tour.title}</span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-10 left-8 right-72">
          <div className="flex items-center gap-2 mb-3">
            <span className={clsx('badge capitalize', DIFF_COLOR[tour.difficulty])}>{tour.difficulty}</span>
            {tour.category && <span className="badge badge-primary capitalize">{tour.category}</span>}
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">{tour.title}</h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1"><HiLocationMarker className="w-4 h-4" />{tour.destination_name}</span>
            <span className="flex items-center gap-1"><HiClock className="w-4 h-4" />{tour.duration_days} days</span>
            {tour.avg_rating > 0 && (
              <span className="flex items-center gap-1 text-yellow-400"><HiStar className="w-4 h-4" />{tour.avg_rating} ({tour.review_count} reviews)</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-10">
        <div className="flex gap-8 items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 mb-7 overflow-x-auto">
              {['itinerary','overview','includes','reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'px-5 py-3 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors',
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-dark'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="section-title text-xl mb-3">About This Tour</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{tour.description}</p>

                {tour.highlights && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-dark mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {(Array.isArray(tour.highlights) ? tour.highlights : JSON.parse(tour.highlights || '[]')).map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700"><HiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {itineraryDays.map((day) => (
                  <details key={day.day_number} className="bg-white border border-gray-200 rounded-xl overflow-hidden group" open={day.day_number === 1}>
                    <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none list-none">
                      <span className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{day.day_number}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-dark">{day.title}</p>
                        {day.location && <p className="text-xs text-gray-400 mt-0.5">{day.location}</p>}
                      </div>
                      <HiChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 text-gray-600 text-sm leading-relaxed">
                      <p>{day.description}</p>
                      {day.accommodation && <p className="mt-2 text-xs text-gray-500">🏨 {day.accommodation}</p>}
                      {day.meals && <p className="text-xs text-gray-500">🍽 {day.meals}</p>}
                    </div>
                  </details>
                )) }
              </div>
            )}

            {/* Includes / Excludes */}
            {activeTab === 'includes' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-dark mb-4 flex items-center gap-2"><HiCheck className="text-green-500" /> What's Included</h3>
                  <ul className="space-y-2">
                    {inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm"><HiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-4 flex items-center gap-2"><HiX className="text-red-400" /> Not Included</h3>
                  <ul className="space-y-2">
                    {exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm"><span className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400">✕</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-dark text-xl">Traveller Reviews</h2>
                  {user && (
                    <Link href={`/tours/${slug}/review`} className="btn-secondary text-sm">Write a Review</Link>
                  )}
                </div>
                {tour.reviews && tour.reviews.length > 0
                  ? <div className="space-y-4">{tour.reviews.map(r => <ReviewCard key={r.id} review={r} />)}</div>
                  : <p className="text-gray-400">No reviews yet. Be the first!</p>
                }
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="w-80 flex-shrink-0 sticky top-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-5 text-white">
                <p className="text-sm opacity-80">Starting from</p>
                <p className="font-display font-bold text-3xl">${Number(tour.price_per_person).toLocaleString()}</p>
                <p className="text-xs opacity-70">per person</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Date */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Departure Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={booking.date}
                    onChange={(e) => setBooking(b => ({ ...b, date: e.target.value }))}
                    className="input-field text-sm py-2.5"
                  />
                </div>

                {/* Adults */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Adults</label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setBooking(b => ({ ...b, adults: Math.max(1, b.adults - 1) }))} className="flex-1 py-2.5 hover:bg-gray-50 font-bold text-lg text-gray-600">−</button>
                    <span className="w-10 text-center font-semibold">{booking.adults}</span>
                    <button onClick={() => setBooking(b => ({ ...b, adults: b.adults + 1 }))} className="flex-1 py-2.5 hover:bg-gray-50 font-bold text-lg text-gray-600">+</button>
                  </div>
                </div>

                {/* Children */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Children <span className="font-normal text-gray-400">(under 12)</span></label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setBooking(b => ({ ...b, children: Math.max(0, b.children - 1) }))} className="flex-1 py-2.5 hover:bg-gray-50 font-bold text-lg text-gray-600">−</button>
                    <span className="w-10 text-center font-semibold">{booking.children}</span>
                    <button onClick={() => setBooking(b => ({ ...b, children: b.children + 1 }))} className="flex-1 py-2.5 hover:bg-gray-50 font-bold text-lg text-gray-600">+</button>
                  </div>
                </div>

                {/* Promo */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="WILD10"
                      value={booking.promo}
                      onChange={(e) => setBooking(b => ({ ...b, promo: e.target.value.toUpperCase() }))}
                      className="input-field text-sm py-2 flex-1"
                    />
                    <button onClick={applyPromo} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">Apply</button>
                  </div>
                </div>

                {/* Price summary */}
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{booking.adults}× Adult</span>
                    <span>${(booking.adults * (tour.price_per_person || 0)).toLocaleString()}</span>
                  </div>
                  {booking.children > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>{booking.children}× Child</span>
                      <span>${(booking.children * (tour.price_child || 0)).toLocaleString()}</span>
                    </div>
                  )}
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo ({promoApplied.discount_value}{promoApplied.discount_type === 'percentage' ? '%' : '$'} off)</span>
                      <span>−${(((booking.adults * (tour.price_per_person || 0)) + (booking.children * (tour.price_child || 0))) - calcPrice()).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-dark border-t border-gray-200 pt-1.5">
                    <span>Total</span>
                    <span>${calcPrice().toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={bookMutation.isLoading}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                >
                  {bookMutation.isLoading ? 'Processing...' : (
                    <><HiArrowRightCircle className="w-5 h-5" /> Book This Tour</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <HiShieldCheck className="w-4 h-4 text-green-500" /> Free cancellation up to 48 hours
                </div>
              </div>
            </motion.div>

            {/* Quick info */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <InfoRow icon={<HiClock />} label="Duration" value={`${tour.duration_days} days / ${tour.duration_nights || tour.duration_days - 1} nights`} />
              <InfoRow icon={<HiUsers />} label="Group Size" value={`Max ${tour.max_participants || 12} people`} />
              <InfoRow icon={<HiLocationMarker />} label="Start / End" value={tour.start_location || tour.destination_name} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary-500 w-5 h-5">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-dark">{value}</p>
      </div>
    </div>
  );
}

function HiX({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" /></svg>;
}
