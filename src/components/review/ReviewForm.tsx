import React from 'react';
import { useForm } from 'react-hook-form';
import { ReviewRequest } from '../../types';
import { VALIDATION_MESSAGES } from '../../utils/constants';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  houseId: string;
  onSubmit: (data: ReviewRequest) => Promise<void>;
  isLoading: boolean;
}

const ReviewForm = ({ houseId, onSubmit, isLoading }: ReviewFormProps) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewRequest>({
    defaultValues: {
      houseId,
      rating: 5,
      comment: '',
    },
  });
  
  const watchRating = watch('rating', 5);

  const handleFormSubmit = async (data: ReviewRequest) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Rating</label>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue('rating', star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  star <= (hoverRating || watchRating)
                    ? 'text-secondary-500 fill-secondary-500'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
        <input
          type="hidden"
          {...register('rating', {
            required: VALIDATION_MESSAGES.REQUIRED,
            min: {
              value: 1,
              message: VALIDATION_MESSAGES.RATING_RANGE,
            },
            max: {
              value: 5,
              message: VALIDATION_MESSAGES.RATING_RANGE,
            },
          })}
        />
        {errors.rating && (
          <p className="form-error">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="form-label">
          Your Review
        </label>
        <textarea
          id="comment"
          rows={4}
          className={`form-input ${errors.comment ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          placeholder="Share your experience with this property..."
          {...register('comment', {
            required: VALIDATION_MESSAGES.REQUIRED,
            minLength: {
              value: 10,
              message: 'Please provide a more detailed review (minimum 10 characters)',
            },
          })}
        />
        {errors.comment && (
          <p className="form-error">{errors.comment.message}</p>
        )}
      </div>

      <input type="hidden" {...register('houseId')} value={houseId} />

      <div className="mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
              Submitting...
            </span>
          ) : (
            'Submit Review'
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;