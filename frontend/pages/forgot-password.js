import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import { authAPI } from '../lib/api';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await authAPI.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <NextSeo title="Forgot Password" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/">
              <Image src="/images/logowild.png" alt="WildSmiles" width={150} height={46} className="mx-auto" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {sent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiMail className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="font-display font-bold text-dark text-xl mb-2">Check your inbox</h2>
                <p className="text-gray-500 text-sm mb-6">We sent a password reset link. Check your email and follow the instructions.</p>
                <Link href="/login" className="btn-primary">Back to Login</Link>
              </div>
            ) : (
              <>
                <h1 className="font-display font-bold text-dark text-2xl mb-1">Forgot password?</h1>
                <p className="text-gray-500 text-sm mb-7">Enter your email and we'll send you a reset link</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )}

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-dark mt-6 transition-colors">
              <HiArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
