import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { HiArrowRight, HiSearch, HiCalendar, HiCheckCircle, HiStar } from 'react-icons/hi';
import { MdFlightTakeoff, MdSupportAgent, MdPhotoCamera } from 'react-icons/md';
import Layout from '../components/layout/Layout';

const steps = [
  {
    number: '01',
    icon: HiSearch,
    title: 'Discover & Explore',
    color: 'from-primary-500 to-primary-700',
    desc: 'Browse 200+ curated tours across 15 African destinations. Filter by type, duration, budget, or group size. Or let our AI Trip Planner build a bespoke itinerary just for you.',
    tips: ['Use AI Planner for custom itineraries', 'Compare tours side-by-side', 'Read verified traveler reviews', 'Save tours to your wishlist'],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=700&q=80',
  },
  {
    number: '02',
    icon: HiCalendar,
    title: 'Book with Confidence',
    color: 'from-amber-500 to-orange-600',
    desc: 'Select your preferred dates, group size and accommodation level. Pay securely with card, bank transfer or installments. Receive instant confirmation via email and SMS.',
    tips: ['Instant booking confirmation', 'Flexible payment plans', 'Free cancellation up to 60 days', 'Best price guarantee'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80',
  },
  {
    number: '03',
    icon: MdSupportAgent,
    title: 'We Handle Everything',
    color: 'from-green-500 to-emerald-700',
    desc: 'Your dedicated travel designer coordinates all logistics — accommodation, transfers, guides, permits and activities. You get a detailed day-by-day briefing before departure.',
    tips: ['Personal travel designer assigned', 'Pre-trip detailed briefing', 'All permits handled for you', '24/7 WhatsApp support line'],
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80',
  },
  {
    number: '04',
    icon: MdFlightTakeoff,
    title: 'Live Your African Dream',
    color: 'from-rose-500 to-red-700',
    desc: 'Meet your expert guide and immerse yourself in an extraordinary African adventure. On-ground support is available 24/7 for any needs during your trip.',
    tips: ['Expert English-speaking guide', '24/7 emergency support number', 'Daily briefings from your guide', 'Local SIM card provided'],
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=80',
  },
  {
    number: '05',
    icon: MdPhotoCamera,
    title: 'Share & Inspire',
    color: 'from-purple-500 to-violet-700',
    desc: 'Return home with memories (and photos) of a lifetime. Share your story on the WildSmiles Community, leave a review, and inspire the next wave of Africa adventurers.',
    tips: ['Share your story on Community', 'Leave a review & earn rewards', 'Tag us @wildsmiles on Instagram', 'Refer friends for $50 credit'],
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=700&q=80',
  },
];

export default function HowItWorksPage() {
  return (
    <Layout>
      <NextSeo
        title="How It Works — WildSmiles Africa"
        description="Booking an African adventure with WildSmiles is simple. Discover, book, let us handle the details, and live your dream. Here's exactly how it works."
      />

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-earth-900 via-dark to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=60"
            alt="How it works bg"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 container-wide text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-primary-500/80 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              Simple. Transparent. Unforgettable.
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-5">
              Your Journey in<br /><span className="text-primary-400">5 Easy Steps</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              From first browse to final sunset in Africa — here's exactly how WildSmiles makes it happen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="space-y-20">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}
                >
                  {/* Text */}
                  <div className={!isEven ? 'lg:col-start-2' : ''}>
                    <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${step.color} text-white px-5 py-2 rounded-full mb-6 shadow-lg`}>
                      <Icon className="w-5 h-5" />
                      <span className="font-bold text-sm">Step {step.number}</span>
                    </div>
                    <h2 className="font-display font-black text-3xl md:text-4xl text-dark mb-4">{step.title}</h2>
                    <p className="text-gray-500 text-lg leading-relaxed mb-6">{step.desc}</p>
                    <ul className="space-y-2">
                      {step.tips.map((tip) => (
                        <li key={tip} className="flex items-center gap-2 text-sm text-gray-600">
                          <HiCheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image */}
                  <div className={`relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-xl ${!isEven ? 'lg:col-start-1' : ''}`}>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Step number overlay */}
                    <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <span className={`font-black text-lg bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>{step.number}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why trust section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-dark">Why 10,000+ Travelers Trust Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '🛡️', title: 'Fully Insured & Licensed', desc: 'IATA-accredited. All operators have valid tourism licenses and liability insurance.' },
              { emoji: '💳', title: 'Secure Payments', desc: 'SSL-encrypted. We accept Visa, Mastercard, PayPal, M-Pesa, and bank transfers.' },
              { emoji: '📞', title: '24/7 Emergency Line', desc: 'A real human answers every call. Day or night, we\'re with you throughout your trip.' },
              { emoji: '🌱', title: 'Eco-Certified', desc: 'All our lodges and operators meet our strict environmental sustainability criteria.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(n => <HiStar key={n} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
          </div>
          <blockquote className="font-display text-2xl md:text-3xl font-bold leading-snug mb-6">
            "From the first WhatsApp message to the moment our plane landed — WildSmiles handled every single detail perfectly.
            We didn't have to worry about anything. Just the animals."
          </blockquote>
          <p className="text-primary-200 font-medium">— Claire & Tom R., Australia · Serengeti + Zanzibar, 14 days</p>
          <div className="mt-10">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-10 py-4 rounded-2xl hover:bg-primary-50 transition-all hover:scale-105 shadow-xl"
            >
              Start Planning Now <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
