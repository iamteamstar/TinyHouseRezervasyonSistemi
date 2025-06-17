import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHouseById } from '../../services/houseService';
import { getUserReservations } from '../../services/reservationService';
import { createReview } from '../../services/reviewService';
import { House, Reservation, ReviewRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ReviewForm from '../../components/review/ReviewForm';
import toast from 'react-hot-toast';
import { ROUTES, DEFAULT_HOUSE_IMAGE } from '../../utils/constants';
import { MapPin, AlertCircle } from 'lucide-react';

const AddReviewPage = () => {
  const { houseId } = useParams<{ houseId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [house, setHouse] = useState<House | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!houseId || !currentUser) return;
      
      setLoading(true);
      try {
        // Fetch house details
        const houseResponse = await getHouseById(houseId);
        if (!houseResponse.success || !houseResponse.data) {
          toast.error('Failed to fetch house details');
          navigate(ROUTES.HOUSES);
          return;
        }
        
        setHouse(houseResponse.data);
        
        // Check if user has stayed at this house (has an approved or completed reservation)
        const reservationsResponse = await getUserReservations();
        if (reservationsResponse.success && reservationsResponse.data) {
          const hasStayed = reservationsResponse.data.some(
            (res) => 
              res.houseId === houseId && 
              (res.status === 'Approved' || res.status === 'Completed')
          );
          
          if (hasStayed) {
            setCanReview(true);
          } else {
            toast.error('You can only review houses where you have stayed');
            navigate(`/houses/${houseId}`);
          }
        }
      } catch (error) {
        console.error('Error checking review eligibility:', error);
        toast.error('An error occurred while checking if you can review this house');
        navigate(ROUTES.HOUSES);
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [houseId, currentUser, navigate]);

  const handleSubmit = async (data: ReviewRequest) => {
    setSubmitting(true);
    try {
      const response = await createReview(data);
      
      if (response.success) {
        toast.success('Review submitted successfully');
        navigate(`/houses/${houseId}`);
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!house || !canReview) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Write a Review</h1>
          <p className="text-slate-600">Share your experience at {house.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-slate-800">Your Review</h2>
              <p className="text-slate-600 text-sm mb-4">
                Your honest feedback helps other guests make decisions and hosts improve their properties.
              </p>
            </div>
            
            <ReviewForm
              houseId={house.id}
              onSubmit={handleSubmit}
              isLoading={submitting}
            />
            
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-500">
                  Once submitted, your review will be visible to anyone viewing this property. You can only review a property once.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
            <img
              src={house.imageUrl || DEFAULT_HOUSE_IMAGE}
              alt={house.title}
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{house.title}</h3>
              
              <div className="flex items-center text-slate-600 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{house.location}</span>
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">{house.description}</p>
              
              <div className="pt-3 mt-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Reviewing as</span>
                  <span className="text-sm font-medium text-slate-900">{currentUser?.fullName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewPage;