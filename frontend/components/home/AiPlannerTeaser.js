import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSparkles, HiArrowRight } from 'react-icons/hi';
import { useRouter } from 'next/router';

export default function AiPlannerTeaser() {
  const router   = useRouter();
  const [dest, setDest] = useState('');

  return (
    <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <HiSparkles className="w-4 h-4" />
              AI-Powered Trip Planning
            </div>
            <h2 className="font-display font-bold text-white text-3xl md:text-5xl mb-4">
              Let AI Plan Your Perfect African Adventure
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Tell us your destination, interests, and budget — our AI builds you a custom day-by-day itinerary in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="flex-1 px-5 py-3 rounded-xl text-dark outline-none shadow-inner"
              />
              <button
                onClick={() => router.push(`/ai-planner${dest ? `?destination=${encodeURIComponent(dest)}` : ''}`)}
                className="bg-dark hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Plan My Trip <HiArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-white/60 text-xs mt-4">Free to use · No registration required to plan</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
