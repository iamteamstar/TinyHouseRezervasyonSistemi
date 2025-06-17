import React from 'react';
import { Review } from '../../types';
import { formatReadableDate } from '../../utils/helpers';
import { Star, Trash2 } from 'lucide-react';

interface ReviewItemProps {
  review: Review;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

const ReviewItem = ({ review, canDelete = false, onDelete }: ReviewItemProps) => {
  return (
    <div className="p-4 border-b border-slate-200 last:border-b-0 animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center">
            <div className="font-medium text-slate-900">{review.userName || 'Anonymous'}</div>
            <span className="mx-2 text-slate-400">•</span>
            <div className="text-sm text-slate-500">{formatReadableDate(review.createdAt)}</div>
          </div>
          
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? 'text-secondary-500 fill-secondary-500' : 'text-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="text-error-500 hover:text-error-700 transition-colors"
            aria-label="Delete review"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <p className="text-slate-700 mt-2 whitespace-pre-line">{review.comment}</p>
    </div>
  );
};

export default ReviewItem;