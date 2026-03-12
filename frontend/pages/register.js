import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiCheckCircle } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PERKS = [
  'Exclusive member discounts up to 20%',
  'Save tours to your personal wishlist',
  'Instant booking confirmation',
  'Dedicated 24/7 travel support',
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: authRegister } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (data) => {
    try {
      await authRegister({ first_name: data.first_name, last_name: data.last_name, email: data.email, password: data.password });
      toast.success('Account created! Welcome to WildSmiles 🦁');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <>
      <NextSeo title="Create Account" description="Join WildSmiles and start your African adventure." />
      <div className="min-h-screen flex">
        {/* Left panel */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gray-50">
          <Link href="/" className="mb-8">
            <Image src="/images/logowild.png" alt="WildSmiles" width={150} height={46} />
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <h1 className="font-display font-bold text-dark text-2xl mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm mb-8">Join thousands of happy travellers</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-dark mb-1.5 block">First Name</label>
                  <div className="relative">
                    <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="John"
                      {...register('first_name', { required: 'Required' })}
                      className="input-field pl-9 text-sm"
                    />
                  </div>
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-dark mb-1.5 block">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    {...register('last_name', { required: 'Required' })}
                    className="input-field text-sm"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-dark mb-1.5 block">Email address</label>
                <div className="relative">
                  <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                    className="input-field pl-10"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-dark mb-1.5 block">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                    className="input-field pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-dark mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    {...register('confirm_password', {
                      required: 'Please confirm your password',
                      validate: (val) => val === watch('password') || 'Passwords do not match',
                    })}
                    className="input-field pl-10"
                  />
                </div>
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  {...register('terms', { required: 'You must accept the terms' })}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-500 underline">Terms of Service</Link> and{' '}
                  <Link href="/privacy" className="text-primary-500 underline">Privacy Policy</Link>
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                {isSubmitting ? 'Creating account...' : 'Create Free Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-500 font-semibold hover:text-primary-600">Sign in</Link>
            </p>
          </motion.div>
        </div>

        {/* Right decorative panel */}
        <div className="hidden xl:flex xl:w-5/12 relative bg-gradient-to-br from-primary-600 to-earth-700 flex-col justify-center p-12 text-white">
          <h2 className="font-display font-bold text-3xl mb-2">Start your adventure</h2>
          <p className="text-white/70 mb-8">Create a free account and unlock exclusive benefits</p>
          <ul className="space-y-4">
            {PERKS.map((perk, i) => (
              <li key={i} className="flex items-center gap-3">
                <HiCheckCircle className="w-5 h-5 flex-shrink-0 text-yellow-400" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
