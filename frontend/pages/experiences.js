import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { HiArrowRight, HiStar } from 'react-icons/hi';
import { FaPaw, FaMountain, FaUmbrellaBeach, FaHiking, FaCamera, FaLeaf } from 'react-icons/fa';
import { MdExplore, MdNightlife } from 'react-icons/md';
import Layout from '../components/layout/Layout';

const experiences = [
  {
    id: 'safari',
    title: 'Safari & Wildlife',
    icon: FaPaw,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 border-amber-200',
    textColor: 'text-amber-700',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=80',
    description:
      'Track the Big Five across Africa\'s most iconic game reserves. From predawn drives over golden plains to heart-stopping leopard sightings, every safari moment is unforgettable.',
    highlights: ['Big Five Game Drives', 'Great Migration Crossings', 'Night Safari', 'Walking Safaris'],
    link: '/tours?category=safari',
    rating: 4.9,
    tours: 47,
  },
  {
    id: 'gorilla',
    title: 'Gorilla Trekking',
    icon: FaLeaf,
    color: 'from-green-600 to-emerald-700',
    bgLight: 'bg-green-50 border-green-200',
    textColor: 'text-green-700',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=900&q=80',
    description:
      'Come face to face with mountain gorillas in their natural highland habitat. A one-hour encounter in the misty forests of Bwindi or Volcanoes National Park will change your life forever.',
    highlights: ['Mountain Gorilla Permits', 'Chimpanzee Tracking', 'Golden Monkey Trek', 'Forest Hikes'],
    link: '/tours?category=wildlife',
    rating: 5.0,
    tours: 12,
  },
  {
    id: 'adventure',
    title: 'Adventure & Climbing',
    icon: FaMountain,
    color: 'from-red-500 to-rose-700',
    bgLight: 'bg-red-50 border-red-200',
    textColor: 'text-red-700',
    image: 'https://images.unsplash.com/photo-1697649814745-be8b1be40455?w=900&q=80',
    description:
      'Summit Africa\'s highest peaks, bungee jump over the Zambezi, or white-water raft through the Batoka Gorge. Africa\'s adventures are as extreme as they come.',
    highlights: ['Kilimanjaro Summit', 'Victoria Falls Raft', 'Rock Climbing', 'Skydiving'],
    link: '/tours?category=adventure',
    rating: 4.8,
    tours: 35,
  },
  {
    id: 'beach',
    title: 'Beach & Island',
    icon: FaUmbrellaBeach,
    color: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-50 border-cyan-200',
    textColor: 'text-cyan-700',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80',
    description:
      'Sink your toes into powdery white sand on Zanzibar, Mozambique, or Seychelles. Snorkel pristine coral reefs teeming with life, or simply drift away with a coconut in hand.',
    highlights: ['Zanzibar Spice Tour', 'Reef Snorkeling', 'Dhow Sunset Cruise', 'Deep Sea Fishing'],
    link: '/tours?category=beach',
    rating: 4.9,
    tours: 28,
  },
  {
    id: 'cultural',
    title: 'Cultural Immersion',
    icon: MdExplore,
    color: 'from-purple-500 to-violet-700',
    bgLight: 'bg-purple-50 border-purple-200',
    textColor: 'text-purple-700',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=900&q=80',
    description:
      'Dance with Maasai warriors, attend a Swahili cooking class in Stone Town, or visit ancient rock art in the Drakensberg. Africa\'s living cultures are its greatest treasure.',
    highlights: ['Maasai Village Stay', 'Swahili Cooking Class', 'Ancient Rock Art', 'Local Market Tours'],
    link: '/tours?category=cultural',
    rating: 4.8,
    tours: 31,
  },
  {
    id: 'trekking',
    title: 'Trekking & Hiking',
    icon: FaHiking,
    color: 'from-lime-500 to-green-600',
    bgLight: 'bg-lime-50 border-lime-200',
    textColor: 'text-lime-700',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80',
    description:
      'Lace up your boots and trek through ancient lava fields, misty rainforests, or the scorched ridge of the Rift Valley. Every step reveals a new wonder of the natural world.',
    highlights: ['Rwenzori Mountains', 'Drakensberg Trail', 'Simien Plateau', 'Atlas Mountain Trek'],
    link: '/tours?category=adventure',
    rating: 4.7,
    tours: 22,
  },
  {
    id: 'photography',
    title: 'Photography Safaris',
    icon: FaCamera,
    color: 'from-yellow-500 to-amber-600',
    bgLight: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-700',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=80',
    description:
      'Led by professional wildlife photographers, these small-group safaris position you at the perfect angle, in perfect light to capture images worthy of a magazine cover.',
    highlights: ['Golden Hour Drives', 'Expert Guides', 'Specialized Vehicles', 'Post-processing Tips'],
    link: '/tours?category=safari',
    rating: 4.9,
    tours: 9,
  },
  {
    id: 'luxury',
    title: 'Luxury Escapes',
    icon: MdNightlife,
    color: 'from-slate-700 to-gray-900',
    bgLight: 'bg-slate-50 border-slate-200',
    textColor: 'text-slate-700',
    image: 'https://images.unsplash.com/photo-1517054984518-f31c4f6e6530?w=900&q=80',
    description:
      'Private game reserves, butler-service tented lodges, and chartered flights between destinations. Luxury in Africa is in a class of its own — raw beauty meets refined indulgence.',
    highlights: ['Private Game Lodges', 'Champagne Sundowners', 'Spa & Wellness', 'Private Transfers'],
    link: '/tours',
    rating: 5.0,
    tours: 18,
  },
];

export default function ExperiencesPage() {
  const [active, setActive] = useState(null);

  return (
    <Layout>
      <NextSeo
        title="Experiences — WildSmiles Africa"
        description="Browse Africa's most extraordinary travel experiences — from Big Five safaris to gorilla trekking, beach retreats, adventure climbs and luxury lodges."
      />

      {/* Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-earth-900 via-dark to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=70"
            alt="safari bg"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 container-wide text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-primary-500/80 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm tracking-wide uppercase">
              8 Signature Experience Categories
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-5">
              Find Your <span className="text-primary-400">Perfect</span>
              <br />African Story
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              Every traveler is different. Explore the experience that speaks to your soul — then let us craft the journey of a lifetime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experiences.map((exp, i) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => setActive(active === exp.id ? null : exp.id)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1">
                      <HiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-semibold">{exp.rating} · {exp.tours} tours</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className={`font-display font-bold text-lg mb-2 ${exp.textColor}`}>{exp.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{exp.description}</p>
                  </div>

                  {/* Expanded */}
                  <AnimatePresence>
                    {active === exp.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className={`mx-4 mb-4 p-4 rounded-2xl border ${exp.bgLight}`}>
                          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${exp.textColor}`}>What's Included</p>
                          <ul className="space-y-1">
                            {exp.highlights.map((h) => (
                              <li key={h} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${exp.color}`} />
                                {h}
                              </li>
                            ))}
                          </ul>
                          <Link
                            href={exp.link}
                            className={`mt-4 flex items-center gap-1 text-sm font-semibold ${exp.textColor} hover:underline`}
                          >
                            View {exp.tours} Tours <HiArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why experience Africa with WildSmiles */}
      <section className="py-20 bg-white">
        <div className="container-wide text-center">
          <h2 className="font-display font-black text-4xl md:text-5xl text-dark mb-4">
            Africa Is Not a Destination.<br /><span className="text-primary-500">It's a Transformation.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12">
            We've guided over 10,000 travelers through life-changing African experiences. Let us guide yours.
          </p>
          <Link href="/tours" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-10 py-4 rounded-2xl text-base shadow-lg shadow-primary-500/30 transition-all hover:scale-105">
            Start Planning Now <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
