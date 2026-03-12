import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiArrowRight } from 'react-icons/hi';
import { newsletterAPI } from '../../lib/api';
import { toast } from 'react-toastify';

export default function NewsletterSection() {
  const [email,      setEmail    ] = useState('');
  const [loading,    setLoading  ] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await newsletterAPI.subscribe({ email });
      setSubscribed(true);
      toast.success('Welcome aboard! You\'re now part of the WildSmiles community.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-secondary-50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HiMail className="w-7 h-7 text-secondary-600" />
          </div>

          <h2 className="section-title mb-3">Get Exclusive Travel Deals</h2>
          <p className="section-subtitle mx-auto text-gray-500 mb-8">
            Join 15,000+ subscribers receiving early-bird deals, destination guides,
            and insider travel tips every week. No spam, ever.
          </p>

          {subscribed ? (
            <div className="bg-secondary-100 text-secondary-700 rounded-2xl px-8 py-6 font-semibold text-lg">
              🎉 You're subscribed! Check your inbox for a welcome surprise.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 input-field shadow-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary whitespace-nowrap"
              >
                {loading ? 'Subscribing...' : (
                  <><HiArrowRight className="w-4 h-4" /> Subscribe Free</>
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-gray-400 mt-3">
            No spam. Unsubscribe anytime. Your privacy is protected.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
