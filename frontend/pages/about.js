import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import { FaPaw, FaLeaf, FaHandshake, FaGlobe } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const milestones = [
  { year: '2012', title: 'WildSmiles Founded', desc: 'Amara Wanjiru starts WildSmiles from a single desk in Nairobi with 3 partner guides and a big dream.' },
  { year: '2014', title: 'First 1,000 Travelers', desc: 'Word spreads fast. We hit our first 1,000 happy travelers and open an office in Kampala, Uganda.' },
  { year: '2016', title: 'Gorilla Program Launches', desc: 'We partner with the Uganda Wildlife Authority to offer certified gorilla trekking permits. Bwindi becomes our most popular experience.' },
  { year: '2018', title: 'Conservation Fund Created', desc: 'We launch the WildSmiles Conservation Fund — pledging 2% of every booking to African wildlife protection.' },
  { year: '2020', title: 'AI Trip Planner Beta', desc: 'We quietly launch the first version of our AI-powered trip planning tool, trained on 8 years of African travel data.' },
  { year: '2022', title: '10,000 Travelers Milestone', desc: 'We celebrate 10,000 travelers and open our third office in Cape Town, South Africa.' },
  { year: '2024', title: 'Pan-African Expansion', desc: 'WildSmiles expands to cover 15 African countries, adding Ethiopia, Namibia, Rwanda, and Morocco to our portfolio.' },
  { year: '2026', title: 'Africa\'s Most Trusted Platform', desc: 'Ranked Africa\'s #1 tours platform with 10,000+ 5-star reviews, 200+ curated tours, and operations in 15 nations.' },
];

const pillars = [
  {
    icon: FaPaw,
    title: 'Wildlife Conservation',
    color: 'from-amber-500 to-orange-600',
    desc: '2% of every booking goes directly to wildlife conservation. We\'ve contributed to protecting mountain gorilla habitats, anti-poaching efforts in the Mara, and marine protected areas off Zanzibar.',
  },
  {
    icon: FaHandshake,
    title: 'Community First',
    color: 'from-primary-500 to-primary-700',
    desc: 'Over 70% of our guides, drivers, and lodge staff are from local communities. We pay above-market wages and fund education for guides\' children through the WildSmiles Learning Fund.',
  },
  {
    icon: FaLeaf,
    title: 'Low-Impact Travel',
    color: 'from-green-500 to-emerald-700',
    desc: 'We only work with eco-certified lodges, set strict vehicle limits in sensitive areas, and plant 3 trees for every booking made. Carbon neutrality by 2028 is our commitment.',
  },
  {
    icon: FaGlobe,
    title: 'Authentic Experiences',
    color: 'from-purple-500 to-violet-700',
    desc: 'No cookie-cutter tours. Every itinerary is shaped by local knowledge, seasonal wildlife patterns, and the personal interests of each traveler. Authentic Africa — not a theme park version of it.',
  },
];

export default function AboutPage() {
  return (
    <Layout>
      <NextSeo
        title="About WildSmiles — Africa's Premier Tours & Travel Platform"
        description="Learn the story behind WildSmiles — founded in Nairobi in 2012, built on a love of Africa and a mission to share its wonders with the world."
      />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80"
            alt="About WildSmiles"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 container-wide py-32 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block bg-primary-500/90 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              Founded in Nairobi, Loved Across Africa
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-6 max-w-2xl">
              We Don't Sell Trips.<br /><span className="text-primary-400">We Change Lives.</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-xl leading-relaxed mb-10">
              WildSmiles was born from a simple conviction: everyone deserves to experience the raw, untamed magic of Africa. 
              Since 2012, we've been making that happen — one extraordinary journey at a time.
            </p>
            <Link href="/tours" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all">
              Explore Our Tours <HiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '14+', label: 'Years of Experience' },
              { value: '15', label: 'African Countries' },
              { value: '10K+', label: 'Happy Travelers' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-display font-black text-4xl md:text-5xl text-primary-500 mb-1">{value}</p>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3 block">Our Mission</span>
              <h2 className="font-display font-black text-4xl md:text-5xl text-dark leading-tight mb-6">
                Make Africa's Wonders<br />Accessible to Everyone
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Africa holds more than 20% of the world's biodiversity, 30% of the world's mineral resources, and 
                some of the most extraordinary landscapes on Earth. Yet for most people, a real African adventure 
                feels impossibly out of reach.
              </p>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                WildSmiles exists to change that. By connecting travelers directly with trusted local operators, 
                building transparent pricing, and providing end-to-end support, we've made Africa's greatest 
                experiences genuinely accessible — from budget backpackers to luxury honeymooners.
              </p>
              <div className="space-y-3">
                {['Fully verified local operators', 'Best price guarantee', '24/7 in-country support', 'Flexible payment plans'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <HiCheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=80"
                  alt="Masai Mara safari"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary-500 text-white rounded-2xl p-5 shadow-xl">
                <p className="font-black text-3xl">10,000+</p>
                <p className="text-primary-100 text-sm font-medium">Life-changing journeys delivered</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values / Pillars */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-dark mb-3">What We Stand For</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Four principles sit at the heart of every decision WildSmiles makes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-dark mb-2">{p.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-dark mb-3">Our Journey</h2>
            <p className="text-gray-500 text-lg">From one desk in Nairobi to Africa's most trusted travel platform.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-100 -translate-x-0.5" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`md:flex gap-8 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full mb-3">{m.year}</span>
                    <h3 className="font-display font-bold text-lg text-dark mb-2">{m.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                  {/* Center dot */}
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 w-8">
                    <div className="w-4 h-4 rounded-full bg-primary-500 ring-4 ring-primary-100 mt-6" />
                  </div>
                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center mb-14">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3 block">The People Behind the Magic</span>
            <h2 className="font-display font-bold text-4xl text-dark mb-3">Meet Our Team</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Real people with deep African roots — passionate about sharing the continent they love.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Said Ali Yawa',
                role: 'CEO & Founder',
                bio: 'Said founded WildSmiles with a passion for sharing Kenya\'s extraordinary landscapes and wildlife with the world. A visionary leader with deep roots in Kenyan tourism.',
              },
              {
                name: 'Asha Said Yawa',
                role: 'Head of Operations',
                bio: 'Asha ensures every WildSmiles tour runs flawlessly — from the first booking to the final transfer. Her meticulous attention to detail keeps guests delighted every time.',
              },
              {
                name: 'Salim Said Yawa',
                role: 'Lead Safari Guide',
                bio: 'Salim has spent over a decade guiding guests across Kenya\'s most iconic parks. His expertise in wildlife behaviour and tracking makes every game drive unforgettable.',
              },
              {
                name: 'Ali Said Yawa',
                role: 'Kenya Tours Specialist',
                bio: 'Ali designs bespoke Kenya itineraries tailored to each traveller — from coastal escapes in Diani to elephant encounters in Amboseli. Every detail is personal.',
              },
              {
                name: 'Sudi Said Yawa',
                role: 'Customer Experience Lead',
                bio: 'Sudi is the welcoming voice behind WildSmiles\' 24/7 support. She ensures every guest feels cared for from the moment they enquire to the moment they return home.',
              },
            ].map((member, i) => {
              const initials = member.name.split(' ').slice(0, 2).map(w => w[0]).join('');
              const colors = ['from-amber-400 to-orange-500','from-primary-400 to-primary-600','from-green-400 to-emerald-600','from-sky-400 to-blue-600','from-purple-400 to-violet-600'];
              return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
              >
                <div className={`h-48 bg-gradient-to-br ${colors[i]} flex items-center justify-center`}>
                  <span className="text-white font-display font-black text-5xl select-none">{initials}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-dark mb-0.5">{member.name}</h3>
                  <p className="text-primary-600 text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/team" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              View Full Team <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-wide text-center">
          <h2 className="font-display font-black text-4xl md:text-5xl mb-4">Ready to Write Your Chapter?</h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
            Join 10,000+ travelers who discovered Africa with WildSmiles. Your adventure is waiting.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tours" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-10 py-4 rounded-2xl hover:bg-primary-50 transition-all hover:scale-105 shadow-xl">
              Browse Tours <HiArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-10 py-4 rounded-2xl border border-white/30 transition-all">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
