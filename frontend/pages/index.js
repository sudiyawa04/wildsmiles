import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import {
  HiStar, HiArrowRight, HiCheckCircle, HiShieldCheck, HiChevronLeft, HiChevronRight,
} from 'react-icons/hi';
import {
  MdExplore, MdCreditCard, MdHeadsetMic,
} from 'react-icons/md';
import { FaUmbrellaBeach, FaMountain, FaPaw, FaCity, FaHiking } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import SearchBar from '../components/search/SearchBar';
import TourCard from '../components/tours/TourCard';
import DestinationCard from '../components/destinations/DestinationCard';
import ReviewCard from '../components/reviews/ReviewCard';
import NewsletterSection from '../components/home/NewsletterSection';
import AiPlannerTeaser from '../components/home/AiPlannerTeaser';
import { toursAPI, destinationsAPI, reviewsAPI } from '../lib/api';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85',
    heading: 'The Great Migration\nStarts in Kenya',
    sub: 'Two million wildebeest thunder across the Mara River in one of nature\'s greatest spectacles — right here in the Masai Mara.',
    cta: 'Book the Migration',
    link: '/tours?category=safari',
    location: 'Masai Mara, Kenya',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85',
    heading: 'Diani: Kenya\'s\nCoastal Paradise',
    sub: 'Sugar-white sands, warm turquoise waters, swaying palms — Diani Beach is East Africa\'s most beautiful coastline.',
    cta: 'Explore the Coast',
    link: '/tours?category=beach',
    location: 'Diani Beach, Kenya',
  },
  {
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85',
    heading: 'Elephants Beneath\nKilimanjaro\'s Crown',
    sub: 'Amboseli\'s iconic vista — great herds of elephants roaming the open plains with Africa\'s highest peak as backdrop.',
    cta: 'See Amboseli',
    link: '/tours?category=wildlife',
    location: 'Amboseli National Park, Kenya',
  },
  {
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=85',
    heading: 'Ancient Mombasa\nMeets the Sea',
    sub: 'Wander spice-laced alleys of Old Town, feel the ocean breeze on Fort Jesus ramparts, and taste 1,000 years of Swahili culture.',
    cta: 'Discover Mombasa',
    link: '/tours?category=cultural',
    location: 'Mombasa, Kenya',
  },
  {
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1920&q=85',
    heading: 'Eye to Eye with\nMountain Gorillas',
    sub: 'Trek into the misty highlands of Bwindi and share a breathtaking moment with our closest cousins.',
    cta: 'Book Gorilla Trek',
    link: '/tours?category=wildlife',
    location: 'Bwindi Forest, Uganda',
  },
  {
    image: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=1920&q=85',
    heading: "Africa's Rooftop\nAwaits You",
    sub: 'Stand on the summit of Kilimanjaro and see the curve of the Earth — the ultimate African conquest.',
    cta: 'Take the Summit',
    link: '/tours?category=adventure',
    location: 'Mount Kilimanjaro, Tanzania',
  },
  {
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=85',
    heading: 'Where Oceans\nMeet at Sunset',
    sub: "Cape Town's golden hour atop Table Mountain — where the Atlantic and Indian Oceans converge in breathtaking beauty.",
    cta: 'Discover Cape Town',
    link: '/tours?category=city',
    location: 'Cape Town, South Africa',
  },
];

const stats = [
  { value: '50+',   label: 'Destinations'    },
  { value: '200+',  label: 'Curated Tours'   },
  { value: '10K+',  label: 'Happy Travelers' },
  { value: '4.9★',  label: 'Average Rating'  },
];

const categories = [
  { label: 'Safari',    icon: FaPaw,         href: '/tours?category=safari',    bg: 'bg-amber-50  border-amber-200',  icon_color: 'text-amber-600'  },
  { label: 'Adventure', icon: FaMountain,    href: '/tours?category=adventure', bg: 'bg-red-50    border-red-200',    icon_color: 'text-red-500'    },
  { label: 'Beach',     icon: FaUmbrellaBeach,href:'/tours?category=beach',     bg: 'bg-cyan-50   border-cyan-200',   icon_color: 'text-cyan-600'   },
  { label: 'Cultural',  icon: MdExplore,     href: '/tours?category=cultural',  bg: 'bg-purple-50 border-purple-200', icon_color: 'text-purple-600' },
  { label: 'Trekking',  icon: FaHiking,      href: '/tours?category=wildlife',  bg: 'bg-green-50  border-green-200',  icon_color: 'text-green-600'  },
  { label: 'City Tours',icon: FaCity,        href: '/tours?category=city',      bg: 'bg-blue-50   border-blue-200',   icon_color: 'text-blue-600'   },
];

const whyUs = [
  { icon: HiShieldCheck,  title: 'Verified & Safe',       desc: 'Every tour operator is vetted. Your safety is our #1 priority.' },
  { icon: MdCreditCard,   title: 'Best Price Guarantee',  desc: 'Find a lower price? We\'ll match it. No questions asked.' },
  { icon: MdHeadsetMic,   title: '24/7 Support',          desc: 'Real humans — not bots — ready to help you anytime, anywhere.' },
  { icon: HiCheckCircle,  title: 'Instant Confirmation',  desc: 'Book today, get your confirmation in seconds. No waiting.' },
];

const testimonials = [
  { name: 'Sarah M.',     country: 'UK',          rating: 5, text: 'WildSmiles made our Serengeti safari absolutely perfect. The level of detail in the planning was incredible. Best holiday of my life.', tour: 'Serengeti Great Migration Safari' },
  { name: 'James K.',     country: 'USA',         rating: 5, text: 'Gorilla trekking in Bwindi was a spiritual experience. Our guide was knowledgeable beyond belief. WildSmiles delivered everything promised.', tour: 'Bwindi Gorilla Trekking' },
  { name: 'Amina O.',     country: 'Nigeria',     rating: 5, text: 'I booked a Zanzibar beach retreat as a solo traveler. WildSmiles connected me with the most amazing local community. I never felt alone.', tour: 'Zanzibar Beach Retreat' },
  { name: 'Pierre D.',    country: 'France',      rating: 5, text: 'Victoria Falls left me speechless. The white-water rafting through Batoka Gorge was the most adrenaline-filled experience of my life!', tour: 'Victoria Falls Adventure' },
  { name: 'Yuki T.',      country: 'Japan',       rating: 5, text: 'Cape Town exceeded every expectation. Table Mountain, penguins, wine tasting — all brilliantly organized. We will be back!', tour: 'Cape Town Explorer' },
  { name: 'David O.',     country: 'Kenya',       rating: 5, text: 'As a Kenyan I thought I knew the Mara well. WildSmiles showed me a completely different side. Outstanding local knowledge.', tour: 'Masai Mara Big Five' },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[activeSlide];

  const { data: featuredToursRaw }         = useQuery('featured-tours',        () => toursAPI.getFeatured().then(r => r.data.data), { retry: 1 });
  const { data: featuredDestinationsRaw }  = useQuery('featured-destinations', () => destinationsAPI.getFeatured().then(r => r.data.data), { retry: 1 });

  const STATIC_DESTINATIONS = [
    { id: 1, slug: 'masai-mara',             name: 'Masai Mara',         country: 'Kenya',    tour_count: 8,  cover_image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80' },
    { id: 2, slug: 'serengeti-national-park',name: 'Serengeti',          country: 'Tanzania', tour_count: 6,  cover_image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
    { id: 3, slug: 'zanzibar-island',         name: 'Zanzibar Island',    country: 'Tanzania', tour_count: 5,  cover_image: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=600&q=80' },
    { id: 4, slug: 'victoria-falls',          name: 'Victoria Falls',     country: 'Zimbabwe', tour_count: 4,  cover_image: 'https://images.unsplash.com/photo-1632793070527-a1bec39ec000?w=600&q=80' },
    { id: 5, slug: 'cape-town',               name: 'Cape Town',          country: 'South Africa', tour_count: 7, cover_image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80' },
    { id: 6, slug: 'diani-beach',             name: 'Diani Beach',        country: 'Kenya',    tour_count: 4,  cover_image: 'https://images.unsplash.com/photo-1559628233-100c798642c5?w=600&q=80' },
  ];

  const STATIC_TOURS = [
    { id: 1, slug: 'masai-mara-wildebeest-migration', title: 'Masai Mara Wildebeest Migration Safari', category: 'safari',    price_per_person: 2400, duration_days: 7, destination_name: 'Masai Mara', country: 'Kenya',    rating_avg: 4.9, review_count: 124, cover_image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80' },
    { id: 2, slug: 'serengeti-great-migration',        title: 'Serengeti Great Migration Safari',       category: 'safari',    price_per_person: 2800, duration_days: 8, destination_name: 'Serengeti',  country: 'Tanzania', rating_avg: 4.9, review_count: 210, cover_image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
    { id: 3, slug: 'zanzibar-beach-retreat',           title: 'Zanzibar Spice Island Beach Retreat',    category: 'beach',     price_per_person: 1200, duration_days: 5, destination_name: 'Zanzibar',   country: 'Tanzania', rating_avg: 4.8, review_count: 98,  cover_image: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=600&q=80' },
    { id: 4, slug: 'victoria-falls-adventure',         title: 'Victoria Falls Adventure & Rafting',     category: 'adventure', price_per_person: 1600, duration_days: 4, destination_name: 'Victoria Falls', country: 'Zimbabwe', rating_avg: 4.8, review_count: 76, cover_image: 'https://images.unsplash.com/photo-1632793070527-a1bec39ec000?w=600&q=80' },
    { id: 5, slug: 'cape-town-explorer',               title: 'Cape Town Explorer & Winelands Tour',    category: 'city',      price_per_person: 1900, duration_days: 6, destination_name: 'Cape Town',  country: 'South Africa', rating_avg: 4.9, review_count: 152, cover_image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80' },
    { id: 6, slug: 'amboseli-elephant-safari',         title: 'Amboseli Elephant Safari & Kilimanjaro', category: 'safari',    price_per_person: 1800, duration_days: 5, destination_name: 'Amboseli',   country: 'Kenya',    rating_avg: 4.8, review_count: 88,  cover_image: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=600&q=80' },
  ];

  const featuredDestinations = featuredDestinationsRaw?.length ? featuredDestinationsRaw : STATIC_DESTINATIONS;
  const featuredTours         = featuredToursRaw?.length         ? featuredToursRaw         : STATIC_TOURS;

  return (
    <Layout>
      <NextSeo
        title="WildSmiles — Africa's Premier Tours & Travel Platform"
        description="Discover extraordinary African safaris, gorilla trekking, beach retreats, and cultural adventures. Book with WildSmiles — Africa's most trusted travel platform."
      />

      {/* ─── HERO SLIDESHOW ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Slides */}
        <AnimatePresence initial={false}>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.location}
              fill
              className="object-cover"
              priority
              quality={85}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />

        {/* Content */}
        <div className="relative z-20 container-wide text-white pt-24 pb-36">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide + '-content'}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Location pill */}
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-sm text-primary-300 font-medium tracking-wide uppercase">
                  {slide.location}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-none mb-6 max-w-3xl">
                {slide.heading.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {i === 1 ? <span className="text-primary-400">{line}</span> : line}
                  </span>
                ))}
              </h1>

              {/* Sub text */}
              <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-10 leading-relaxed">
                {slide.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-xl"
                >
                  {slide.cta} <HiArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl text-base border border-white/30 transition-all"
                >
                  Browse All Tours
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-3xl"
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* Slide controls */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30">
          <button
            onClick={prevSlide}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <HiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30">
          <button
            onClick={nextSlide}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <HiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`transition-all duration-300 rounded-full ${i === activeSlide ? 'w-8 h-2 bg-primary-400' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/50 backdrop-blur-md border-t border-white/10">
          <div className="container-wide py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display font-bold text-2xl md:text-3xl text-primary-400">{value}</p>
                  <p className="text-xs text-gray-300">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="section-title">Explore by Experience</h2>
            <p className="section-subtitle mx-auto">
              From heart-pounding adventures to serene beach escapes — find your perfect African experience.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ label, icon: Icon, href, bg, icon_color }) => (
              <Link key={label} href={href}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${bg}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm ${icon_color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-dark text-sm">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AFRICA INSPIRATION STRIP ─────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80"
          alt="Masai Mara"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="relative z-10 container-wide">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3 block">
                Over 15 African Countries
              </span>
              <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-tight mb-5">
                Every Sunrise in Africa<br />Looks Different Here
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                From the Sahara dunes of Morocco to the penguin coasts of South Africa — WildSmiles operates across
                the entire continent. Wherever your dream takes you, we know the way.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/destinations" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg">
                  All Destinations <HiArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/30 transition-all">
                  How It Works
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED DESTINATIONS ────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Destinations</h2>
              <p className="section-subtitle">Africa's most extraordinary places to explore</p>
            </div>
            <Link href="/destinations" className="btn-ghost hidden md:flex">
              All Destinations <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations
              ? featuredDestinations.map((dest, i) => (
                  <DestinationCard key={dest.id} destination={dest} index={i} />
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-72 rounded-2xl" />
                ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/destinations" className="btn-primary">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED TOURS ───────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Trending Tours</h2>
              <p className="section-subtitle">Our most booked experiences — loved by thousands of adventurers</p>
            </div>
            <Link href="/tours" className="btn-ghost hidden md:flex">
              All Tours <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours
              ? featuredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-96 rounded-2xl" />
                ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/tours" className="btn-primary">
              Explore All {featuredTours?.length ? '200+' : ''} Tours
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AI TRIP PLANNER TEASER ───────────────────────────────────── */}
      <AiPlannerTeaser />

      {/* ─── WHY WILDSMILES ───────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Thousands Choose WildSmiles</h2>
            <p className="section-subtitle mx-auto">We don't just book trips — we craft life-changing experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-display font-semibold text-dark text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / TESTIMONIALS ──────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-earth-900 to-dark">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="section-title text-white">What Our Adventurers Say</h2>
            <p className="text-gray-400 text-lg mt-3">
              Over 10,000 travelers have experienced the WildSmiles difference
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(n => (
                    <HiStar key={n} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-200 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.country} · {t.tour}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────────────────────────── */}
      <NewsletterSection />
    </Layout>
  );
}
