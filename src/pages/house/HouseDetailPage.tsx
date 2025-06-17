import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { House, Review, Availability } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { DEFAULT_HOUSE_IMAGE, ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Calendar,
  Star,
  PencilLine,
  Home,
} from 'lucide-react';

const HouseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isAdmin, isHouseOwner, isTenant } = useAuth();
  const navigate = useNavigate();

  const [house, setHouse] = useState<House | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const isOwner = house && currentUser ? house.ownerId === currentUser.id : false;
  const canEdit = isAdmin || isOwner;
  const canReserve = isTenant && !isOwner;
  const canManageAvailability = (isHouseOwner && isOwner) || isAdmin;

  useEffect(() => {
    const fetchHouseDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const houseRes = await axios.get<House>(`https://localhost:7069/api/House/${id}`);
        setHouse(houseRes.data);

        const reviewsRes = await axios.get<Review[]>(`https://localhost:7069/api/Review/house/${id}`);
        setReviews(reviewsRes.data);

        const availRes = await axios.get<Availability[]>(`https://localhost:7069/api/houses/${id}/availability`);
        setAvailabilities(availRes.data);
      } catch (error) {
        console.error('Error fetching house details:', error);
        navigate(ROUTES.NOT_FOUND);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseDetails();
  }, [id, navigate]);

  const handleReserveRedirect = () => {
    if (!house) return;
    navigate(`/houses/${house.houseId}/reserve`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mx-auto w-16 h-16 bg-slate-100 flex items-center justify-center rounded-full mb-4">
            <Home className="w-8 h-8 text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">House Not Found</h1>
          <p className="text-slate-600 mb-6">
            The house you are looking for could not be found. It may have been removed or you may have followed an invalid link.
          </p>
          <Link to={ROUTES.HOUSES} className="btn btn-primary">
            Browse Houses
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 md:h-96 bg-slate-200">
          <img
            src={house.imageUrl || DEFAULT_HOUSE_IMAGE}
            alt={house.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{house.title}</h1>
              <div className="flex items-center text-slate-600 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{house.location}</span>
              </div>

              {reviews.length > 0 && (
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(averageRating)
                            ? 'text-secondary-500 fill-secondary-500'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-slate-700">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-0">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {formatCurrency(house.pricePerNight)}{' '}
                <span className="text-sm text-slate-500 font-normal">per night</span>
              </div>

              <div className="flex space-x-3 mt-4">
                {canReserve && (
                  <button onClick={handleReserveRedirect} className="btn btn-primary">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reserve
                  </button>
                )}

                {canEdit && (
                  <Link to={`/houses/${house.id}/edit`} className="btn btn-outline">
                    <PencilLine className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                )}

                {canManageAvailability && (
                  <Link to={`/manage-availability/${house.houseId}`} className="btn btn-outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Availability
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Diğer içerikler burada olabilir (özellikler, açıklama, yorumlar vs.) */}
        </div>
      </div>
    </div>
  );
};

export default HouseDetailPage;
