import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiLockClosed, HiEye, HiEyeOff, HiCheckCircle } from 'react-icons/hi';
import { authAPI } from '../lib/api';
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (data) => {
    if (!token) { toast.error('Invalid reset link'); return; }
    try {
      await authAPI.resetPassword(token, data.password);
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    }
  };

  return (
    <>
      <NextSeo title="Reset Password" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/"><Image src="/images/logowild.png" alt="WildSmiles" width={150} height={46} className="mx-auto" /></Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {done ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiCheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="font-display font-bold text-dark text-xl mb-2">Password updated!</h2>
                <p className="text-gray-500 text-sm mb-6">Your password has been reset. You can now sign in with your new password.</p>
                <Link href="/login" className="btn-primary">Sign In</Link>
              </div>
            ) : (
              <>
                <h1 className="font-display font-bold text-dark text-2xl mb-1">Reset your password</h1>
                <p className="text-gray-500 text-sm mb-7">Choose a strong new password</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-dark mb-1.5 block">New Password</label>
                    <div className="relative">
                      <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                        className="input-field pl-10 pr-10"
                      />
                      <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-dark mb-1.5 block">Confirm New Password</label>
                    <div className="relative">
                      <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="Confirm password"
                        {...register('confirm', {
                          required: 'Please confirm password',
                          validate: v => v === watch('password') || 'Passwords do not match',
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
                  </div>

                  <button type="submit" disabled={isSubmitting || !token} className="btn-primary w-full py-3.5">
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
