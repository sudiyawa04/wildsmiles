import { useState } from 'react';
import { NextSeo } from 'next-seo';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiLocationMarker, HiCalendar, HiCurrencyDollar, HiArrowRight, HiLightBulb } from 'react-icons/hi';
import Layout from '../components/layout/Layout';
import TourCard from '../components/tours/TourCard';
import { aiAPI } from '../lib/api';
import { toast } from 'react-toastify';

const INTERESTS = ['Wildlife & Safari','Hiking & Trekking','Beach & Relaxation','Cultural Immersion','Food & Cuisine','Photography','Adventure Sports','History & Heritage','Family Fun','Luxury Experiences'];
const BUDGETS = [
  { label: 'Budget', sub: 'Under $1,000', value: 'budget' },
  { label: 'Mid-range', sub: '$1,000–$3,000', value: 'mid' },
  { label: 'Premium', sub: '$3,000–$7,000', value: 'premium' },
  { label: 'Luxury', sub: '$7,000+', value: 'luxury' },
];

export default function AiPlannerPage() {
  const [form, setForm] = useState({ destination: '', days: 7, interests: [], budget: 'mid', group_size: 2, special_requests: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const generate = async () => {
    if (!form.destination) { toast.error('Please enter a destination'); return; }
    if (form.interests.length === 0) { toast.error('Select at least one interest'); return; }
    setLoading(true);
    try {
      const res = await aiAPI.generateItinerary(form);
      setResult(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NextSeo title="AI Trip Planner" description="Let our AI build you a personalised African adventure itinerary in seconds." />

      {/* Hero */}
      <div className="bg-gradient-to-br from-dark via-earth-900 to-primary-900 text-white pt-28 pb-16">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
            <HiSparkles className="text-yellow-400 w-4 h-4" />
            Powered by AI
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">Your Dream Trip,<br /><span className="gradient-text">Planned in Seconds</span></h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">Tell our AI what you love, and get a custom day-by-day itinerary with handpicked tours.</p>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="space-y-7">
            {/* Destination */}
            <div>
              <label className="font-semibold text-dark mb-2 block flex items-center gap-2"><HiLocationMarker className="text-primary-500" /> Where to?</label>
              <input
                type="text"
                placeholder="e.g. Serengeti, Zanzibar, Cape Town..."
                value={form.destination}
                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Days */}
            <div>
              <label className="font-semibold text-dark mb-2 block flex items-center gap-2"><HiCalendar className="text-primary-500" /> How many days? <span className="text-2xl font-bold text-primary-500 ml-2">{form.days}</span></label>
              <input
                type="range"
                min={3}
                max={21}
                value={form.days}
                onChange={e => setForm(f => ({ ...f, days: Number(e.target.value) }))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3 days</span><span>21 days</span></div>
            </div>

            {/* Interests */}
            <div>
              <label className="font-semibold text-dark mb-3 block flex items-center gap-2"><HiLightBulb className="text-primary-500" /> Interests <span className="text-sm font-normal text-gray-400">(select all that apply)</span></label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${form.interests.includes(interest) ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="font-semibold text-dark mb-3 block flex items-center gap-2"><HiCurrencyDollar className="text-primary-500" /> Budget</label>
              <div className="grid grid-cols-2 gap-3">
                {BUDGETS.map(b => (
                  <button
                    key={b.value}
                    onClick={() => setForm(f => ({ ...f, budget: b.value }))}
                    className={`p-3 rounded-xl border text-left transition-colors ${form.budget === b.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-200'}`}
                  >
                    <p className={`font-semibold text-sm ${form.budget === b.value ? 'text-primary-600' : 'text-dark'}`}>{b.label}</p>
                    <p className="text-xs text-gray-400">{b.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Group size */}
            <div>
              <label className="font-semibold text-dark mb-2 block">Group Size: <span className="text-primary-500">{form.group_size} {form.group_size === 1 ? 'person' : 'people'}</span></label>
              <div className="flex items-center gap-3">
                <button onClick={() => setForm(f => ({ ...f, group_size: Math.max(1, f.group_size - 1) }))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50">−</button>
                <span className="text-lg font-semibold w-10 text-center">{form.group_size}</span>
                <button onClick={() => setForm(f => ({ ...f, group_size: Math.min(20, f.group_size + 1) }))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50">+</button>
              </div>
            </div>

            {/* Special requests */}
            <div>
              <label className="font-semibold text-dark mb-2 block">Special Requests <span className="text-sm font-normal text-gray-400">(optional)</span></label>
              <textarea
                rows={3}
                placeholder="Dietary requirements, accessibility needs, celebration..."
                value={form.special_requests}
                onChange={e => setForm(f => ({ ...f, special_requests: e.target.value }))}
                className="input-field resize-none"
              />
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin">✦</span> Building your itinerary...</>
              ) : (
                <><HiSparkles className="w-5 h-5" /> Generate My Itinerary</>
              )}
            </button>
          </div>

          {/* Result panel */}
          <div>
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                  <div>
                    <div className="text-6xl mb-4">🌍</div>
                    <h3 className="font-display font-semibold text-dark text-xl mb-2">Your itinerary will appear here</h3>
                    <p className="text-gray-400 text-sm">Fill in the form and click Generate</p>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <div>
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <h3 className="font-display font-semibold text-dark text-lg mb-2">Crafting your adventure...</h3>
                    <p className="text-gray-400 text-sm">Our AI is building a personalised itinerary just for you</p>
                  </div>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
                    <p className="text-xs opacity-70 mb-1">Your personalised itinerary</p>
                    <h2 className="font-display font-bold text-xl">{result.destination} — {result.days} Days</h2>
                    <p className="text-sm opacity-80 mt-1">{result.overview}</p>
                  </div>

                  <div className="p-5 max-h-[600px] overflow-y-auto space-y-3">
                    {result.itinerary?.map((day) => (
                      <div key={day.day} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">{day.day}</span>
                          <h4 className="font-semibold text-dark text-sm">{day.title}</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{day.description}</p>
                        {day.activities && day.activities.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {day.activities.map((a, i) => <li key={i} className="text-xs text-gray-500 flex items-center gap-1.5">• {a}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}

                    {result.recommended_tours && result.recommended_tours.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold text-dark mb-3 flex items-center gap-2"><HiArrowRight className="text-primary-500 w-4 h-4" /> Recommended Tours</h3>
                        <div className="space-y-3">
                          {result.recommended_tours.map(t => <TourCard key={t.id} tour={t} compact />)}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
