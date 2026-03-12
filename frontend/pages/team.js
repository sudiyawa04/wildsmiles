import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { HiArrowRight } from 'react-icons/hi';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const team = [
  {
    name: 'Amara Wanjiru',
    role: 'Founder & CEO',
    bio: 'Born and raised in Nairobi, Amara spent 15 years as a wildlife biologist before founding WildSmiles in 2012. Her mission: make Africa\'s wonders accessible to every curious traveler.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    country: '🇰🇪 Kenya',
    linkedin: '#',
    instagram: '#',
    twitter: '#',
    badge: 'Founder',
    badgeColor: 'bg-primary-100 text-primary-700',
  },
  {
    name: 'Emmanuel Okafor',
    role: 'Head of Safari Operations',
    bio: 'With 18 years in the field across 12 African nations, Emmanuel has personally guided over 3,000 wildlife excursions. He knows where the lions sleep before the lions do.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    country: '🇳🇬 Nigeria',
    linkedin: '#',
    instagram: '#',
    twitter: '#',
    badge: 'Expert Guide',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'Customer Experience Director',
    bio: 'Fatima ensures every WildSmiles traveler feels like family — from first inquiry to final farewell. Her team holds a 98% satisfaction score across 8,000+ reviews.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&q=80',
    country: '🇲🇦 Morocco',
    linkedin: '#',
    instagram: '#',
    twitter: '#',
    badge: 'Guest Champion',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'David Mwangi',
    role: 'Head of Gorilla Conservation Programs',
    bio: 'David works closely with the Uganda Wildlife Authority and Rwanda Development Board, ensuring every trek permit supports genuine conservation and local community development.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    country: '🇺🇬 Uganda',
    linkedin: '#',
    instagram: '#',
    twitter: '#',
    badge: 'Conservationist',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    name: 'Yemi Adeyemi',
    role: 'AI & Technology Lead',
    bio: 'Yemi built WildSmiles\' AI trip planner from the ground up. A Stanford CS grad and avid birder, he combines code with a deep love for African ecosystems.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    country: '🇳🇬 Nigeria',
    linkedin: '#',
    instagram: '#',
    twitter: '#',
    badge: 'Tech Pioneer',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Sophie Ndegwa',
    role: 'Lead Travel Designer',
    bio: 'Sophie crafts bespoke itineraries that read like adventure novels. She\'s personally covered every route WildSmiles offers, staying in tents, lodges, and everything in between.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    country: '🇹🇿 Tanzania',
    linkedin: '#',
    instagram: '#',
    twitter: '#',
    badge: 'Itinerary Architect',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
  {
    name: 'Marcus Webb',
    role: 'Head of Photography Safaris',
    bio: 'National Geographic contributor and BBC Wildlife photographer, Marcus leads WildSmiles\' acclaimed photography safari program. His images have appeared in 40+ publications worldwide.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
    country: '🇿🇦 South Africa',
    linkedin: '#',
    instagram: '#',
    twitter: '#',
    badge: 'Photographer',
    badgeColor: 'bg-slate-100 text-slate-700',
  },
  {
    name: 'Aisha Kamara',
    role: 'Partner Relations Manager',
    bio: 'Aisha manages relationships with 200+ verified tour operators, lodges, and local guides across 15 African countries — ensuring every experience meets WildSmiles\' strict quality standards.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    country: '🇸🇱 Sierra Leone',
    linkedin: '#',
    instagram: '#',
    twitter: '#',
    badge: 'Partnership Lead',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
];

const values = [
  { emoji: '🦁', title: 'Wildlife First', desc: 'Every itinerary is designed with minimal environmental impact. We donate 2% of every booking to conservation.' },
  { emoji: '🤝', title: 'Community Impact', desc: 'Over 70% of our local guides, drivers and lodge staff are from the communities surrounding our tour areas.' },
  { emoji: '⭐', title: 'Uncompromising Quality', desc: 'Every operator is personally vetted. We\'ve rejected 60% of operators who applied to join our platform.' },
  { emoji: '🌍', title: 'Pan-African Pride', desc: 'Our team spans 12 African nations. We don\'t just sell Africa — we are from Africa, and we love it deeply.' },
];

export default function TeamPage() {
  return (
    <Layout>
      <NextSeo
        title="Our Team — WildSmiles Africa"
        description="Meet the passionate team behind WildSmiles — wildlife experts, local guides, conservationists and travel designers who live and breathe Africa."
      />

      {/* Header */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-earth-900 via-dark to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=60"
            alt="team bg"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 container-wide text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-primary-500/80 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              Across 12 African Nations
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-5">
              Meet the People<br /><span className="text-primary-400">Behind the Magic</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We're not a travel agency. We're a tribe of Africa lovers — guides, photographers, conservationists and
              storytellers — united by a single belief: Africa changes people.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{v.emoji}</div>
                <h3 className="font-display font-bold text-lg text-dark mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-dark mb-3">The WildSmiles Team</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Our people are what make WildSmiles extraordinary. Every member brings a unique slice of Africa's magic to the table.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {/* Photo */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${member.badgeColor}`}>
                      {member.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 text-sm">{member.country}</div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-dark">{member.name}</h3>
                  <p className="text-primary-600 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{member.bio}</p>

                  {/* Social */}
                  <div className="flex items-center gap-2">
                    <a href={member.linkedin} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors">
                      <FaLinkedin className="w-3.5 h-3.5" />
                    </a>
                    <a href={member.instagram} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-pink-100 flex items-center justify-center text-gray-500 hover:text-pink-600 transition-colors">
                      <FaInstagram className="w-3.5 h-3.5" />
                    </a>
                    <a href={member.twitter} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-sky-100 flex items-center justify-center text-gray-500 hover:text-sky-500 transition-colors">
                      <FaTwitter className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the team CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-wide text-center">
          <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
            Love Africa? <span className="text-primary-200">Join Us.</span>
          </h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
            We're always looking for passionate guides, photographers, conservationists, and travel designers.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-10 py-4 rounded-2xl text-base hover:bg-primary-50 transition-all hover:scale-105 shadow-xl"
          >
            Get in Touch <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
