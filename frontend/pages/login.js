import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPw, setShowPw] = useState(false);

  const redirect = router.query.redirect || '/dashboard';

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <>
      <NextSeo title="Login" description="Sign in to your WildSmiles account." />
      <div className="min-h-screen flex">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80"
            alt="Serengeti"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/80 to-primary-900/60 flex flex-col justify-between p-12">
            <Link href="/">
              <Image src="/images/logowild.png" alt="WildSmiles" width={160} height={48} className="brightness-0 invert" />
            </Link>
            <div className="text-white">
              <p className="font-display text-3xl font-bold mb-3">"A journey of a thousand miles begins with a single step."</p>
              <p className="text-white/60">— Lao Tzu</p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gray-50">
          {/* Mobile logo */}
          <Link href="/" className="mb-10 lg:hidden">
            <Image src="/images/logowild.png" alt="WildSmiles" width={140} height={42} />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
          >
            <h1 className="font-display font-bold text-dark text-2xl mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm mb-8">Sign in to manage your adventures</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
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

              {/* Password */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-dark">Password</label>
                  <Link href="/forgot-password" className="text-xs text-primary-500 hover:text-primary-600">Forgot password?</Link>
                </div>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Your password"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    className="input-field pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-500 font-semibold hover:text-primary-600">Create one free</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
