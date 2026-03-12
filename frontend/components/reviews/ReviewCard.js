import { HiStar } from 'react-icons/hi';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((n) => (
      <HiStar
        key={n}
        className={`w-4 h-4 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
      />
    ))}
  </div>
);

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0">
          {review.avatar ? (
            <Image src={review.avatar} alt={review.first_name} width={40} height={40} className="rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {review.first_name?.[0]}{review.last_name?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-dark text-sm">{review.first_name} {review.last_name}</p>
          <p className="text-xs text-gray-400">
            {review.created_at && formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
          </p>
        </div>
        <StarRow rating={review.rating} />
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-dark text-sm mb-1">{review.title}</h4>
      )}

      {/* Content */}
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{review.content}</p>

      {/* Reply */}
      {review.reply && (
        <div className="mt-3 bg-primary-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-primary-700 mb-1">WildSmiles Response:</p>
          <p className="text-xs text-gray-600">{review.reply}</p>
        </div>
      )}
    </div>
  );
}
