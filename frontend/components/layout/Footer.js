import Link from 'next/link';
import Image from 'next/image';
import {
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok,
} from 'react-icons/fa';
import {
  HiMail, HiPhone, HiLocationMarker,
} from 'react-icons/hi';

const footerLinks = {
  Destinations: [
    { label: 'Serengeti, Tanzania',  href: '/destinations/serengeti-national-park' },
    { label: 'Masai Mara, Kenya',    href: '/destinations/masai-mara' },
    { label: 'Victoria Falls',       href: '/destinations/victoria-falls' },
    { label: 'Zanzibar Island',      href: '/destinations/zanzibar-island' },
    { label: 'Cape Town, SA',        href: '/destinations/cape-town' },
    { label: 'Bwindi, Uganda',       href: '/destinations/bwindi-forest' },
  ],
  Experiences: [
    { label: 'Safari Tours',         href: '/tours?category=safari' },
    { label: 'Gorilla Trekking',     href: '/tours?category=wildlife' },
    { label: 'Adventure Tours',      href: '/tours?category=adventure' },
    { label: 'Beach & Island',       href: '/tours?category=beach' },
    { label: 'Cultural Experiences', href: '/tours?category=cultural' },
    { label: 'City Breaks',          href: '/tours?category=city' },
  ],
  Company: [
    { label: 'About WildSmiles',     href: '/about' },
    { label: 'Our Team',             href: '/team' },
    { label: 'How It Works',         href: '/how-it-works' },
    { label: 'Travel Community',     href: '/community' },
    { label: 'Experiences',          href: '/experiences' },
    { label: 'Contact Us',           href: '/contact' },
  ],
  Support: [
    { label: 'Help Center',          href: '/contact' },
    { label: 'Contact Us',           href: '/contact' },
    { label: 'Cancellation Policy',  href: '/contact' },
    { label: 'Privacy Policy',       href: '/privacy' },
    { label: 'Terms of Service',     href: '/terms' },
    { label: 'Cookie Policy',        href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300">
      {/* Main footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Image
              src="/images/logowild.png"
              alt="WildSmiles"
              width={140}
              height={40}
              className="h-10 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Africa's premier tours and travel platform. We connect explorers with
              extraordinary wildlife experiences, breathtaking landscapes, and authentic
              cultural encounters across the continent and beyond.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+254700000000" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <HiPhone className="w-4 h-4 text-primary-500" />
                +254 700 000 000
              </a>
              <a href="mailto:hello@wildsmiles.com" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <HiMail className="w-4 h-4 text-primary-500" />
                hello@wildsmiles.com
              </a>
              <span className="flex items-center gap-2">
                <HiLocationMarker className="w-4 h-4 text-primary-500 flex-shrink-0" />
                Nairobi, Kenya — Serving all of Africa
              </span>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: FaFacebook,  href: '#', label: 'Facebook' },
                { Icon: FaInstagram, href: '#', label: 'Instagram' },
                { Icon: FaTwitter,   href: '#', label: 'Twitter' },
                { Icon: FaYoutube,   href: '#', label: 'YouTube' },
                { Icon: FaTiktok,    href: '#', label: 'TikTok' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span>🔒 SSL Secured</span>
              <span>✅ Verified Tours</span>
              <span>⭐ 4.9/5 Average Rating</span>
              <span>🌍 50+ Destinations</span>
              <span>🎒 10,000+ Happy Travelers</span>
            </div>
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} WildSmiles. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
