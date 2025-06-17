import React, { useState, useEffect } from 'react';
import { getUserReservations, cancelReservationAsTenant } from '../../services/reservationService';
import { Reservation } from '../../types';
import ReservationItem from '../../components/common/ReservationItem';
import toast from 'react-hot-toast';
import { Calendar } from 'lucide-react';

const UserReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      const response = await getUserReservations();
      if (response.success && response.data) {
        setReservations(response.data);
      } else {
        toast.error(response.message || 'Bu eve zaten rezarvasyonunuz var');
      }
      setLoading(false);
    };

    fetchReservations();
  }, []);

  const handleCancel = async (id: string) => {
    const confirmed = confirm('Rezervasyonu iptal etmek istediğinize emin misiniz?');
    if (!confirmed) return;

    const response = await cancelReservationAsTenant(id);
    if (response.success) {
      toast.success('Rezervasyon iptal edildi');
      setReservations(prev =>
        prev.map(res =>
          res.reservationId.toString() === id ? { ...res, status: 'Rejected' } : res
        )
      );
    } else {
      toast.error(response.message || 'İptal işlemi başarısız');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Rezervasyonlarım</h1>

      {loading ? (
        <div className="text-center py-10">Yükleniyor...</div>
      ) : reservations.length === 0 ? (
        <div className="text-center text-slate-600">
          <div className="flex justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          Henüz bir rezervasyonunuz yok.
        </div>
      ) : (
        reservations.map(reservation => (
          <ReservationItem
            key={reservation.reservationId}
            reservation={reservation}
            showHouseName
            onCancel={handleCancel}
          />
        ))
      )}
    </div>
  );
};

export default UserReservationsPage;
