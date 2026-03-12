import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import {
  HiHeart, HiChat, HiBookmark, HiArrowRight, HiStar, HiUser,
} from 'react-icons/hi';
import { FaCamera, FaMapPin, FaFireAlt } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const stories = [
  {
    id: 1,
    author: 'Sarah Mitchell',
    country: 'United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&q=80',
    tour: 'Serengeti Great Migration Safari',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=700&q=80',
    title: 'The Great Migration Changed My Life Forever',
    excerpt: 'I stood at the Mara River crossing, heart pounding, as 500,000 wildebeest churned up the water. Nothing I\'d ever read prepared me for the sound, the smell, the raw power of nature at its most primal...',
    likes: 847,
    comments: 62,
    saves: 211,
    tags: ['Safari', 'Serengeti', 'Wildlife'],
    readTime: '5 min read',
  },
  {
    id: 2,
    author: 'James Kariuki',
    country: 'Kenya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    tour: 'Bwindi Gorilla Trekking',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=700&q=80',
    title: 'Meeting a Silverback: A Moment Beyond Words',
    excerpt: 'After two hours of steep forest hiking through thick mud and bamboo, we heard the sounds first — deep, rumbling chests beats. Our guide knelt down and whispered: "They\'re right there." ...',
    likes: 1204,
    comments: 98,
    saves: 376,
    tags: ['Gorilla Trek', 'Uganda', 'Bwindi'],
    readTime: '7 min read',
  },
  {
    id: 3,
    author: 'Amina Osei',
    country: 'Ghana',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80',
    tour: 'Zanzibar Island Retreat',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80',
    title: 'Seven Days in Paradise: My Zanzibar Diary',
    excerpt: 'Day 1: Arrived at Stone Town and immediately lost myself in the labyrinth of spice-scented alleyways. Day 2: Swam with whale sharks in the turquoise water off Mnemba Atoll...',
    likes: 632,
    comments: 47,
    saves: 189,
    tags: ['Beach', 'Zanzibar', 'Island Life'],
    readTime: '9 min read',
  },
  {
    id: 4,
    author: 'Pierre Dubois',
    country: 'France',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    tour: 'Victoria Falls Adventure',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
    title: 'Bungee Jumping & White Water at Victoria Falls',
    excerpt: 'Standing on the edge of the 111-metre Zambia bridge, looking down into the Zambezi gorge while the spray of the Falls soaked my face — I jumped and felt truly, completely alive...',
    likes: 918,
    comments: 73,
    saves: 257,
    tags: ['Adventure', 'Victoria Falls', 'Adrenaline'],
    readTime: '6 min read',
  },
  {
    id: 5,
    author: 'Yuki Tanaka',
    country: 'Japan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80',
    tour: 'Cape Town Explorer',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=700&q=80',
    title: 'Cape Town in 5 Days: The Perfect City Safari',
    excerpt: 'From the cable car up Table Mountain to penguin colonies at Boulders Beach, from the Cape Winelands to the vibrant Bo-Kaap neighborhood — Cape Town packs more into five days than most cities offer in a lifetime...',
    likes: 754,
    comments: 55,
    saves: 302,
    tags: ['Cape Town', 'City', 'South Africa'],
    readTime: '8 min read',
  },
  {
    id: 6,
    author: 'David Onyango',
    country: 'Kenya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    tour: 'Masai Mara Big Five Safari',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=80',
    title: 'A Kenyan Sees the Mara for the First Time',
    excerpt: 'I\'m Kenyan — I grew up hearing about the Masai Mara, but somehow never went. My WildSmiles guide Emmanuel showed me a side of the Mara I never knew existed: tracking lions on foot before dawn...',
    likes: 1087,
    comments: 114,
    saves: 443,
    tags: ['Masai Mara', 'Safari', 'Kenya'],
    readTime: '10 min read',
  },
];

const travelTips = [
  {
    icon: FaCamera,
    title: 'Best Time to Photograph the Migration',
    author: 'Marcus Webb — Wildlife Photographer',
    tip: 'July–October for river crossings. Aim for golden hour (6–8am). A 500mm lens is ideal for predators. Always shoot in RAW.',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  {
    icon: FaMapPin,
    title: 'What to Pack for Gorilla Trekking',
    author: 'Elena Russo — Experienced Trekker',
    tip: 'Waterproof boots, long-sleeved shirts, gardening gloves (for bamboo), snacks, and at least 2L of water. No strong perfume — gorillas hate it.',
    color: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    icon: FaFireAlt,
    title: 'Tanzania vs Kenya Safari: How to Choose',
    author: 'Amara Diallo — WildSmiles Guide',
    tip: 'Kenya (Masai Mara) is better Jun–Sep for the migration. Tanzania (Serengeti) offers year-round wildlife density and fewer crowds outside peak season.',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
];

export default function CommunityPage() {
  const [filter, setFilter] = useState('All');
  const tags = ['All', 'Safari', 'Gorilla Trek', 'Beach', 'Adventure', 'Cultural', 'City'];

  const filtered = filter === 'All'
    ? stories
    : stories.filter((s) => s.tags.includes(filter));

  return (
    <Layout>
      <NextSeo
        title="Travel Community & Stories — WildSmiles Africa"
        description="Read real travel stories, tips, and guides from Africa explorers. Share your WildSmiles adventure with a global community of passionate travelers."
      />

      {/* Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-earth-900 to-dark overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=60"
            alt="community bg"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 container-wide text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-primary-500/80 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              10,000+ Traveler Stories
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-5">
              The WildSmiles <span className="text-primary-400">Community</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              Real stories. Real adventures. Real Africa. See the world through the eyes of those who lived it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="container-wide">
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                  filter === tag
                    ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((story, i) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-600"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                    {story.tags.map((t) => (
                      <span key={t} className="bg-white/90 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-100">
                      <Image src={story.avatar} alt={story.author} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark">{story.author}</p>
                      <p className="text-xs text-gray-400">{story.country} · {story.readTime}</p>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-dark mb-2 leading-snug group-hover:text-primary-600 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{story.excerpt}</p>

                  <div className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    📍 {story.tour}
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><HiHeart className="w-4 h-4 text-red-400" />{story.likes}</span>
                      <span className="flex items-center gap-1"><HiChat className="w-4 h-4 text-blue-400" />{story.comments}</span>
                      <span className="flex items-center gap-1"><HiBookmark className="w-4 h-4 text-amber-400" />{story.saves}</span>
                    </div>
                    <button className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
                      Read More <HiArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-dark mb-3">Tips from the Field</h2>
            <p className="text-gray-500 text-lg">Expert advice from guides, photographers, and seasoned Africa travelers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl border p-6 ${tip.color}`}
                >
                  <Icon className="w-7 h-7 mb-3 opacity-80" />
                  <h3 className="font-bold text-base mb-1">{tip.title}</h3>
                  <p className="text-xs opacity-70 mb-3">by {tip.author}</p>
                  <p className="text-sm leading-relaxed opacity-90">{tip.tip}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-wide text-center">
          <HiUser className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="font-display font-black text-4xl md:text-5xl mb-4">Share Your Story</h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
            Traveled with WildSmiles? Write about it. Inspire the next adventurer. Be part of a community that lives for Africa.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-10 py-4 rounded-2xl text-base hover:bg-primary-50 transition-all hover:scale-105 shadow-xl"
          >
            Join the Community <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
