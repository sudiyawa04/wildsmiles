import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import {
  HiMail, HiPhone, HiLocationMarker, HiClock, HiCheckCircle, HiArrowRight,
} from 'react-icons/hi';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const offices = [
  {
    city: 'Nairobi',
    country: 'Kenya',
    flag: '🇰🇪',
    address: 'Westlands Business Park, Waiyaki Way, Nairobi',
    phone: '+254 700 123 456',
    email: 'nairobi@wildsmiles.com',
    hours: 'Mon–Fri: 8am–6pm EAT',
    image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=500&q=80',
  },
  {
    city: 'Kampala',
    country: 'Uganda',
    flag: '🇺🇬',
    address: 'Kololo Hill Drive, Kampala, Uganda',
    phone: '+256 700 987 654',
    email: 'uganda@wildsmiles.com',
    hours: 'Mon–Fri: 8am–5pm EAT',
    image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=500&q=80',
  },
  {
    city: 'Cape Town',
    country: 'South Africa',
    flag: '🇿🇦',
    address: 'Long Street, CBD, Cape Town 8001',
    phone: '+27 21 123 4567',
    email: 'capetown@wildsmiles.com',
    hours: 'Mon–Fri: 9am–5pm SAST',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=500&q=80',
  },
];

const faqs = [
  {
    q: 'How far in advance should I book my safari?',
    a: 'We recommend booking at least 3–6 months in advance, especially for peak season (July–October, December–January). Gorilla permits in particular sell out very quickly.',
  },
  {
    q: 'Are your tour prices inclusive of everything?',
    a: 'Our prices include accommodation, transport, meals as listed, park fees, and an English-speaking guide. International flights and travel insurance are not included.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Full refund up to 60 days before departure. 50% refund between 30–60 days. No refund inside 30 days, but we offer full rebooking credit valid for 2 years.',
  },
  {
    q: 'Is it safe to travel in Africa with WildSmiles?',
    a: 'Safety is our absolute priority. All our routes and partners are regularly reviewed. We provide 24/7 in-country emergency support and work only in areas with stable safety conditions.',
  },
  {
    q: 'Can I customize an itinerary?',
    a: 'Absolutely. All our tours can be customized in terms of duration, accommodation level, activities, and travel dates. Contact us or use the AI Trip Planner for a fully bespoke proposal.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      return;
    }
    // Simulate submission
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <Layout>
      <NextSeo
        title="Contact Us — WildSmiles Africa"
        description="Get in touch with the WildSmiles team. We're here 24/7 to help you plan the African adventure of your dreams."
      />

      {/* Header */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-earth-900 to-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=60"
            alt="contact bg"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 container-wide text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-primary-500/80 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              We Reply Within 2 Hours
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-5">
              Let's Plan Your<br /><span className="text-primary-400">African Dream</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              Whether you have a question, need a custom itinerary, or just want to chat about Africa — our team is here for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact main */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Contact info sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h3 className="font-display font-bold text-xl text-dark mb-5">Get In Touch</h3>
                <div className="space-y-4">
                  <a href="tel:+254700123456" className="flex items-start gap-3 group">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HiPhone className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Call Us</p>
                      <p className="font-semibold text-dark text-sm group-hover:text-primary-600 transition-colors">+254 700 123 456</p>
                    </div>
                  </a>
                  <a href="mailto:hello@wildsmiles.com" className="flex items-start gap-3 group">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HiMail className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Email Us</p>
                      <p className="font-semibold text-dark text-sm group-hover:text-primary-600 transition-colors">hello@wildsmiles.com</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HiLocationMarker className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Head Office</p>
                      <p className="font-semibold text-dark text-sm">Westlands, Nairobi, Kenya</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HiClock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Working Hours</p>
                      <p className="font-semibold text-dark text-sm">Mon–Sun: 6am–9pm EAT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/254700123456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 shadow-md transition-all hover:scale-105"
              >
                <FaWhatsapp className="w-7 h-7 flex-shrink-0" />
                <div>
                  <p className="font-bold">Chat on WhatsApp</p>
                  <p className="text-sm text-green-100">Fastest response — we reply in minutes</p>
                </div>
              </a>

              {/* Social links */}
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h4 className="font-semibold text-dark mb-4">Follow Our Adventures</h4>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                    <FaFacebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors">
                    <FaInstagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-md">
              <h3 className="font-display font-bold text-2xl text-dark mb-2">Send Us a Message</h3>
              <p className="text-gray-500 text-sm mb-8">Tell us about your dream trip and we'll get back to you within 2 hours.</p>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-2xl text-dark mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Our team will reach out within 2 hours. Check your email inbox.</p>
                  <button
                    onClick={() => setStatus(null)}
                    className="mt-6 text-primary-600 font-semibold hover:underline text-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 555 000 0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm bg-white"
                      >
                        <option value="">Select a topic…</option>
                        <option value="booking">New Booking Enquiry</option>
                        <option value="custom">Custom Itinerary Request</option>
                        <option value="existingbooking">Existing Booking Help</option>
                        <option value="partnership">Partnership / B2B</option>
                        <option value="press">Press & Media</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Message *</label>
                    <textarea
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your dream trip — destination, travel dates, group size, type of experience…"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm resize-none"
                      required
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-red-500 text-sm">Please fill in all required fields.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <>Send Message <HiArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-dark mb-3">Our Offices</h2>
            <p className="text-gray-500 text-lg">Present across Africa, serving the world.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, i) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-44">
                  <Image src={office.image} alt={office.city} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="font-bold text-xl">{office.flag} {office.city}</p>
                    <p className="text-sm text-gray-200">{office.country}</p>
                  </div>
                </div>
                <div className="bg-white p-5 space-y-2">
                  <p className="text-sm text-gray-600 flex items-start gap-2"><HiLocationMarker className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />{office.address}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2"><HiPhone className="w-4 h-4 text-primary-500 flex-shrink-0" />{office.phone}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2"><HiMail className="w-4 h-4 text-primary-500 flex-shrink-0" />{office.email}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2"><HiClock className="w-4 h-4 text-primary-500 flex-shrink-0" />{office.hours}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-dark mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-dark text-sm md:text-base">{faq.q}</span>
                  <span className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold transition-colors ${activeFaq === i ? 'bg-primary-500' : 'bg-gray-200 text-gray-500'}`}>
                    {activeFaq === i ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0 }}
                    className="px-6 pb-5"
                  >
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
