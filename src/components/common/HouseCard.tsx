// components/common/HouseCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DEFAULT_HOUSE_IMAGE, ROUTES } from '../../utils/constants';
import { House } from '../../types';
import { MapPin, Bed, Bath, Users, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

interface HouseCardProps {
  house: House;
  onDelete?: (id: string) => void;
}

const HouseCard: React.FC<HouseCardProps> = ({ house, onDelete }) => {
  const { isAdmin, isHouseOwner, currentUser } = useAuth();
  const canModify =
    isAdmin ||
    (isHouseOwner && house.ownerId === currentUser?.id);

  const editLink = ROUTES.EDIT_HOUSE.replace(':id', house.id.toString());

  return (
    <div className="card group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={house.imageUrl || DEFAULT_HOUSE_IMAGE}
          alt={house.title}
          className="h-48 w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />

        {house.rating != null && (
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center shadow-md">
            <Star className="w-4 h-4 text-secondary-500 mr-1" fill="#f59e0b" />
            <span className="text-xs font-semibold">{house.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-xl mb-1 text-slate-800 leading-tight">
            {house.title}
          </h3>

          <div className="flex items-center text-slate-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{house.location}</span>
          </div>

          <p className="text-slate-500 text-sm mb-3 line-clamp-2">
            {house.description}
          </p>

          {(house.bedrooms || house.bathrooms || house.maxOccupancy) && (
            <div className="flex gap-3 text-sm text-slate-600 mb-4">
              {house.bedrooms != null && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{house.bedrooms} Yatak Odası</span>
                </div>
              )}

              {house.bathrooms != null && (
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{house.bathrooms} Banyo</span>
                </div>
              )}

              {house.maxOccupancy != null && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{house.maxOccupancy} Misafir</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-semibold text-lg text-primary-700">
              {formatCurrency(house.pricePerNight)}
            </span>
            <span className="text-slate-500 text-sm">gecelik</span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/houses/${house.id}`}
              className="flex-1 btn btn-primary"
            >
              Detayları Gör
            </Link>

            {canModify && (
              <div className="flex gap-2">
                <Link
                  to={editLink}
                  className="btn btn-outline"
                >
                  Düzenle
                </Link>

                {onDelete && (
                  <button
                    onClick={() => onDelete(house.id)}
                    className="btn btn-danger"
                  >
                    Sil
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
