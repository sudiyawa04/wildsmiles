import { useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { NextSeo } from 'next-seo';
import { HiUser, HiMail, HiPhone, HiGlobe, HiSave, HiLockClosed } from 'react-icons/hi';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { usersAPI, authAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('info');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name:  user?.last_name  || '',
      phone:      user?.phone      || '',
      nationality: user?.nationality || '',
      bio:        user?.bio        || '',
    },
  });

  const { register: regPw, handleSubmit: submitPw, watch: watchPw, formState: { errors: pwErrors, isSubmitting: isPwSubmitting }, reset: resetPw } = useForm();

  const updateMutation = useMutation(
    (payload) => usersAPI.updateProfile(payload),
    {
      onSuccess: (res) => {
        toast.success('Profile updated!');
        if (setUser) setUser(res.data.data);
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
    }
  );

  const pwMutation = useMutation(
    (payload) => usersAPI.changePassword(payload),
    {
      onSuccess: () => { toast.success('Password changed!'); resetPw(); },
      onError: (err) => toast.error(err.response?.data?.message || 'Change failed'),
    }
  );

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase();

  return (
    <DashboardLayout title="My Profile">
      <NextSeo title="Profile" />

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="font-display font-semibold text-dark text-lg">{user?.first_name} {user?.last_name}</h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <span className="badge badge-primary text-xs capitalize mt-1">{user?.role}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {['info', 'password'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-dark'}`}
          >
            {t === 'info' ? 'Personal Info' : 'Change Password'}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <form onSubmit={handleSubmit(d => updateMutation.mutate(d))} className="bg-white rounded-2xl border border-gray-100 p-6 max-w-xl space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-dark mb-1.5 block">First Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input {...register('first_name', { required: true })} className="input-field pl-9 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark mb-1.5 block">Last Name</label>
              <input {...register('last_name', { required: true })} className="input-field text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-dark mb-1.5 block">Phone Number</label>
            <div className="relative">
              <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input {...register('phone')} type="tel" placeholder="+1 234 567 8900" className="input-field pl-9 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-dark mb-1.5 block">Nationality</label>
            <div className="relative">
              <HiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input {...register('nationality')} placeholder="e.g. American" className="input-field pl-9 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-dark mb-1.5 block">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea {...register('bio')} rows={3} placeholder="Tell us about yourself..." className="input-field text-sm resize-none" />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
            <HiSave className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={submitPw(d => pwMutation.mutate(d))} className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md space-y-5">
          <div>
            <label className="text-sm font-medium text-dark mb-1.5 block">Current Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="password" {...regPw('current_password', { required: 'Required' })} className="input-field pl-9 text-sm" />
            </div>
            {pwErrors.current_password && <p className="text-red-500 text-xs mt-1">{pwErrors.current_password.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-dark mb-1.5 block">New Password</label>
            <input type="password" {...regPw('new_password', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })} className="input-field text-sm" />
            {pwErrors.new_password && <p className="text-red-500 text-xs mt-1">{pwErrors.new_password.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-dark mb-1.5 block">Confirm New Password</label>
            <input type="password" {...regPw('confirm_password', { required: 'Required', validate: v => v === watchPw('new_password') || 'Passwords do not match' })} className="input-field text-sm" />
            {pwErrors.confirm_password && <p className="text-red-500 text-xs mt-1">{pwErrors.confirm_password.message}</p>}
          </div>

          <button type="submit" disabled={isPwSubmitting} className="btn-primary flex items-center gap-2">
            <HiLockClosed className="w-4 h-4" /> {isPwSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}
