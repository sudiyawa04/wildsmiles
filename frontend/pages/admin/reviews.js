import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { NextSeo } from 'next-seo';
import { HiStar, HiCheck, HiX, HiReply } from 'react-icons/hi';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI, reviewsAPI } from '../../lib/api';
import { toast } from 'react-toastify';
import clsx from 'clsx';

export default function AdminReviews() {
  const qc = useQueryClient();
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const { data, isLoading } = useQuery(
    'admin-pending-reviews',
    () => adminAPI.getPendingReviews().then(r => r.data)
  );

  const approveMutation = useMutation(
    (id) => adminAPI.approveReview(id),
    { onSuccess: () => { toast.success('Review approved'); qc.invalidateQueries('admin-pending-reviews'); } }
  );

  const rejectMutation = useMutation(
    (id) => reviewsAPI.reject(id),
    { onSuccess: () => { toast.success('Review rejected'); qc.invalidateQueries('admin-pending-reviews'); } }
  );

  const replyMutation = useMutation(
    ({ id, reply }) => reviewsAPI.reply(id, reply),
    {
      onSuccess: () => {
        toast.success('Reply posted');
        setReplyId(null);
        setReplyText('');
        qc.invalidateQueries('admin-pending-reviews');
      },
    }
  );

  const reviews = data?.data || [];

  return (
    <AdminLayout title="Reviews">
      <NextSeo title="Admin Reviews" />

      <div className="space-y-4">
        {isLoading && [...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}

        {!isLoading && reviews.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <HiStar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <h3 className="font-semibold text-dark mb-1">No pending reviews</h3>
            <p className="text-gray-400 text-sm">All reviews have been moderated</p>
          </div>
        )}

        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => <HiStar key={s} className={clsx('w-4 h-4', s <= r.rating ? 'text-yellow-400 fill-current' : 'text-gray-200')} />)}
                  </div>
                  <span className="text-xs text-gray-400">for <span className="font-medium text-dark">{r.tour_title}</span></span>
                </div>
                {r.title && <p className="font-semibold text-dark text-sm">{r.title}</p>}
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-2">By {r.first_name} {r.last_name} — {new Date(r.created_at).toLocaleDateString()}</p>

                {replyId === r.id && (
                  <div className="mt-3">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={3}
                      placeholder="Write your official reply..."
                      className="input-field text-sm resize-none mb-2"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => replyMutation.mutate({ id: r.id, reply: replyText })} disabled={!replyText || replyMutation.isLoading} className="btn-primary text-xs py-1.5 px-4">Post Reply</button>
                      <button onClick={() => { setReplyId(null); setReplyText(''); }} className="text-xs text-gray-500 hover:text-dark">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => { setReplyId(replyId === r.id ? null : r.id); setReplyText(''); }} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors">
                  <HiReply className="w-4 h-4" /> Reply
                </button>
                <button onClick={() => approveMutation.mutate(r.id)} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors">
                  <HiCheck className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => rejectMutation.mutate(r.id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                  <HiX className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
