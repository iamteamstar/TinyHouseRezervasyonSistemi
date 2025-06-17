import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserReservations } from '../services/reservationService';
import { House, Reservation } from '../types';
import { ROUTES } from '../utils/constants';
import HouseCard from '../components/common/HouseCard';
import ReservationItem from '../components/common/ReservationItem';
import { Home, PlusCircle, Calendar, User, Mail, AlertCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { currentUser, isAdmin, isHouseOwner, isTenant } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');

        if (isHouseOwner && currentUser) {
          const ownerId = localStorage.getItem('userID');
          const resp = await axios.get<any>(
            `https://localhost:7069/api/User/${ownerId}/houses`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const raw = resp.data;
          let owned: House[] = [];
          if (Array.isArray(raw)) owned = raw;
          else if (Array.isArray(raw.data)) owned = raw.data;
          else if (raw.success && Array.isArray(raw.data)) owned = raw.data;
          else if (typeof raw === 'object') owned = [raw as House];
          setHouses(
            owned.map(h => ({
              ...h,
              id: h.id || (h as any).houseId
            }))
          );
        }

        if (isTenant) {
          const res = await getUserReservations();
          if (res.success && res.data) setReservations(res.data);
        }
      } catch (error) {
        console.error('API error:', error);
        toast.error('Veri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, isHouseOwner, isTenant]);

  const confirmDelete = (id: string) => {
    setHouseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!houseToDelete) return;
    setDeleting(true);
    try {
      const token =localStorage.getItem('authToken')
      await axios.delete(`https://localhost:7069/api/House/${houseToDelete}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      setHouses(prev => prev.filter(h => h.id.toString() !== houseToDelete));
      toast.success('İlan başarıyla silindi');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setHouseToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Hoş geldiniz, {currentUser?.fullName}!
          </h1>
          <p className="text-slate-600">
            {isAdmin
              ? 'Tüm evleri, kullanıcıları ve rezervasyonları yönetin'
              : isHouseOwner
              ? 'Mülklerinizi ve rezervasyonlarınızı yönetin'
              : 'Bir sonraki konaklamanızı bulun ve rezerve edin'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          {isHouseOwner && (
            <Link to={ROUTES.ADD_HOUSE} className="btn btn-primary">
              <PlusCircle className="w-4 h-4 mr-2" /> Yeni Ev Ekle
            </Link>
          )}
          {isTenant && (
            <Link to={ROUTES.HOUSES} className="btn btn-primary">
              <Home className="w-4 h-4 mr-2" /> Evlere Göz At
            </Link>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
        </div>
      )}

      {/* Account Summary */}
      <div className="mb-10 bg-white rounded-lg shadow-md p-6 animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Hesabınız</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Kişisel Bilgiler</h3>
              <p className="text-slate-500 mt-1">{currentUser?.fullName}</p>
              <p className="text-slate-500">{currentUser?.role}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Mail className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900">İletişim Bilgileri</h3>
              <p className="text-slate-500 mt-1">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* House Owner Section */}
      {isHouseOwner && !loading && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Mülkleriniz</h2>
            <Link to={ROUTES.OWNER_RESERVATIONS} className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
              <Calendar className="w-4 h-4 mr-1" /> Rezervasyonları Yönet
            </Link>
          </div>
          {houses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 flex items-center justify-center rounded-full mb-4">
                <Home className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Henüz Mülk Yok</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                Henüz hiç mülk eklemediniz. İlk mülkünüzü ekleyerek başlayın.
              </p>
              <Link to={ROUTES.ADD_HOUSE} className="btn btn-primary">
                <PlusCircle className="w-4 h-4 mr-2" /> İlk Mülkünüzü Ekleyin
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {houses.map(house => (
                <HouseCard
                  key={house.id}
                  house={house}
                  onDelete={() => confirmDelete(house.id.toString())}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tenant Section */}
      {isTenant && !loading && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Rezervasyonlarınız</h2>
            <Link to={ROUTES.RESERVATIONS} className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
              Tümünü Görüntüle
            </Link>
          </div>
          {reservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 flex items-center justify-center rounded-full mb-4">
                <Calendar className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Henüz Rezervasyon Yok</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                Henüz hiç rezervasyon yapmadınız. Mevcut mülklere göz atarak başlayın.
              </p>
              <Link to={ROUTES.HOUSES} className="btn btn-primary">
                Evlere Göz At
              </Link>
            </div>  
          ) : (
            <div className="space-y-4">
              {reservations.slice(0, 3).map(reservation => (
                <ReservationItem
                  key={reservation.reservationId}
                  reservation={reservation}
                  showHouseName
                  onCancel={
                    reservation.status === 'Beklemede'
                      ? () => {}
                      : undefined
                  }
                />
              ))}
              {reservations.length > 3 && (
                <div className="text-center mt-6">
                  <Link to={ROUTES.RESERVATIONS} className="btn btn-outline">
                    Tüm Rezervasyonları Görüntüle
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center text-error-600 mb-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <Dialog.Title className="text-xl font-semibold">Silinecek İlan ID: {houseToDelete}</Dialog.Title>
            </div>
            <Dialog.Description className="text-slate-700 mb-6">
              Bu evi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteDialogOpen(false)} className="btn btn-outline" disabled={deleting}>
                İptal
              </button>
              <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
                {deleting ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" /> Siliniyor...
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

export default DashboardPage;
