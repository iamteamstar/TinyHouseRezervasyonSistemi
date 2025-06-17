// pages/HouseListPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { House } from '../../types';
import HouseCard from '../../components/common/HouseCard';
import HouseFilters from '../../components/house/HouseFilters';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Home, AlertCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface FilterOptions {
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  location: string;
  searchTerm: string;
}

const HouseListPage: React.FC = () => {
  const { isAdmin, isHouseOwner, currentUser } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchHouses = async () => {
      setLoading(true);
      try {
        const response = await axios.get<House[]>('https://localhost:7069/api/House');
        const mapped = response.data.map(h => ({ ...h, id: h.houseId }));
        setHouses(mapped);
        setFilteredHouses(mapped);
      } catch (err) {
        console.error('Error fetching houses:', err);
        toast.error('Failed to load houses');
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const confirmDelete = (id: string) => {
    setHouseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!houseToDelete) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`https://localhost:7069/api/House/${houseToDelete}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      // Remove from both lists
      setHouses(prev => prev.filter(h => h.id.toString() !== houseToDelete));
      setFilteredHouses(prev => prev.filter(h => h.id.toString() !== houseToDelete));
      toast.success('House deleted successfully');
    } catch (err) {
      console.error('Error deleting house:', err);
      toast.error('An error occurred while deleting the house');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setHouseToDelete(null);
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    let result = [...houses];

    if (filters.searchTerm.trim()) {
      const t = filters.searchTerm.toLowerCase();
      result = result.filter(h =>
        h.title.toLowerCase().includes(t) ||
        h.description.toLowerCase().includes(t) ||
        h.location.toLowerCase().includes(t) ||
        (h.amenities || '').toLowerCase().includes(t)
      );
    }
    if (filters.location.trim()) {
      const loc = filters.location.toLowerCase();
      result = result.filter(h => h.location.toLowerCase().includes(loc));
    }
    if (filters.minPrice.trim()) {
      const min = parseFloat(filters.minPrice);
      result = result.filter(h => h.pricePerNight >= min);
    }
    if (filters.maxPrice.trim()) {
      const max = parseFloat(filters.maxPrice);
      result = result.filter(h => h.pricePerNight <= max);
    }
    if (filters.minBedrooms.trim()) {
      const minB = parseInt(filters.minBedrooms, 10);
      result = result.filter(h => h.bedrooms >= minB);
    }

    setFilteredHouses(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Houses</h1>
        <p className="text-slate-600">Discover and book your perfect stay</p>
      </div>

      <HouseFilters onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
        </div>
      ) : filteredHouses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouses.map(house => {
            const canModify = isAdmin || (isHouseOwner && house.ownerId === currentUser?.id);
            return (
              <HouseCard
                key={house.id}
                house={house}
                onDelete={canModify ? () => confirmDelete(house.id.toString()) : undefined}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-16 h-16 bg-slate-100 flex items-center justify-center rounded-full mb-4">
            <Home className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Houses Found</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            We couldn't find any houses matching your filters. Try adjusting your search criteria.
          </p>
          <button
            onClick={() => handleFilterChange({ minPrice: '', maxPrice: '', minBedrooms: '', location: '', searchTerm: '' })}
            className="btn btn-outline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center text-error-600 mb-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <Dialog.Title className="text-xl font-semibold">
                Silinecek İlan ID: {houseToDelete}
              </Dialog.Title>
            </div>
            <Dialog.Description className="text-slate-700 mb-6">
              Bu evi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="btn btn-outline"
                disabled={deleting}
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                    Siliniyor...
                  </span>
                ) : (
                  'Sil'
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default HouseListPage;
