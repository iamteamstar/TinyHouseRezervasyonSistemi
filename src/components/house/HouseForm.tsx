import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { HouseFormData } from '../../types';
import { ROUTES, VALIDATION_MESSAGES } from '../../utils/constants';
import { Home, MapPin, DollarSign, Bed, Bath, Users, List } from 'lucide-react';

interface HouseFormProps {
  initialData?: HouseFormData;
  onSubmit: (data: HouseFormData) => Promise<void>;
  isLoading: boolean;
  title: string;
  buttonText: string;
}

const HouseForm = ({
  initialData,
  onSubmit,
  isLoading,
  title,
  buttonText,
}: HouseFormProps) => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | undefined>(initialData?.imageUrl);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HouseFormData>({
    defaultValues: initialData || {
      title: '',
      description: '',
      location: '',
      pricePerNight: 0,
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 1,
      amenities: '',
      imageUrl: '',
      isActive: true,
    },
  });
  
  const watchImageUrl = watch('imageUrl');
  
  React.useEffect(() => {
    if (watchImageUrl && watchImageUrl !== preview) {
      setPreview(watchImageUrl);
    }
  }, [watchImageUrl, preview]);
  
  const handleFormSubmit = async (data: HouseFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{title}</h1>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="form-label flex items-center gap-1">
              <Home className="w-4 h-4" /> Title
            </label>
            <input
              id="title"
              type="text"
              className={`form-input ${errors.title ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              placeholder="Cozy Mountain Cabin"
              {...register('title', {
                required: VALIDATION_MESSAGES.REQUIRED,
              })}
            />
            {errors.title && (
              <p className="form-error">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="form-label flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Location
            </label>
            <input
              id="location"
              type="text"
              className={`form-input ${errors.location ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              placeholder="Aspen, Colorado"
              {...register('location', {
                required: VALIDATION_MESSAGES.REQUIRED,
              })}
            />
            {errors.location && (
              <p className="form-error">{errors.location.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="pricePerNight" className="form-label flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> Price per night
            </label>
            <input
              id="pricePerNight"
              type="number"
              step="0.01"
              className={`form-input ${errors.pricePerNight ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              placeholder="149.99"
              {...register('pricePerNight', {
                required: VALIDATION_MESSAGES.REQUIRED,
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: VALIDATION_MESSAGES.PRICE_MIN,
                },
              })}
            />
            {errors.pricePerNight && (
              <p className="form-error">{errors.pricePerNight.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="form-label">Image URL</label>
            <input
              id="imageUrl"
              type="text"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
            />
          </div>
          
          <div>
            <label htmlFor="bedrooms" className="form-label flex items-center gap-1">
              <Bed className="w-4 h-4" /> Bedrooms
            </label>
            <input
              id="bedrooms"
              type="number"
              min="0"
              className={`form-input ${errors.bedrooms ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('bedrooms', {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: 'Must be 0 or more bedrooms',
                },
              })}
            />
            {errors.bedrooms && (
              <p className="form-error">{errors.bedrooms.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="bathrooms" className="form-label flex items-center gap-1">
              <Bath className="w-4 h-4" /> Bathrooms
            </label>
            <input
              id="bathrooms"
              type="number"
              min="0"
              step="0.5"
              className={`form-input ${errors.bathrooms ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('bathrooms', {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: 'Must be 0 or more bathrooms',
                },
              })}
            />
            {errors.bathrooms && (
              <p className="form-error">{errors.bathrooms.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="maxOccupancy" className="form-label flex items-center gap-1">
              <Users className="w-4 h-4" /> Max Guests
            </label>
            <input
              id="maxOccupancy"
              type="number"
              min="1"
              className={`form-input ${errors.maxOccupancy ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('maxOccupancy', {
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: 'Must accommodate at least 1 guest',
                },
              })}
            />
            {errors.maxOccupancy && (
              <p className="form-error">{errors.maxOccupancy.message}</p>
            )}
          </div>
          
          <div>
            <label className="form-label">Status</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                className="mr-2"
                {...register('isActive')}
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">
                Active (visible to users)
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            rows={4}
            className={`form-input ${errors.description ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            placeholder="Describe your property..."
            {...register('description', {
              required: VALIDATION_MESSAGES.REQUIRED,
              minLength: {
                value: 20,
                message: 'Description must be at least 20 characters',
              },
            })}
          />
          {errors.description && (
            <p className="form-error">{errors.description.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="amenities" className="form-label flex items-center gap-1">
            <List className="w-4 h-4" /> Amenities
          </label>
          <textarea
            id="amenities"
            rows={2}
            className={`form-input ${errors.amenities ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            placeholder="WiFi, Kitchen, Free parking, Pool, etc."
            {...register('amenities')}
          />
          {errors.amenities && (
            <p className="form-error">{errors.amenities.message}</p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Enter amenities separated by commas
          </p>
        </div>
        
        {preview && (
          <div>
            <p className="form-label">Image Preview</p>
            <img
              src={preview}
              alt="Property preview"
              className="mt-2 rounded-lg max-h-64 object-cover"
              onError={() => setPreview(undefined)}
            />
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary py-2.5 px-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                {buttonText}...
              </span>
            ) : (
              buttonText
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HouseForm;