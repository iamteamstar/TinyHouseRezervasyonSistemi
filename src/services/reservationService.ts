import api from './authService';
import { Reservation, ReservationRequest, ApiResponse } from '../types';

export const getAllReservations = async (): Promise<ApiResponse<Reservation[]>> => {
  try {
    const response = await api.get<Reservation[]>('/Reservation/all');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    return { success: false, message: 'Failed to fetch reservations' };
  }
};

export const getOwnerReservations = async (): Promise<ApiResponse<Reservation[]>> => {
  try {
    const response = await api.get<Reservation[]>('/Reservation/owner');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching owner reservations:', error);
    return { success: false, message: 'Failed to fetch your reservations' };
  }
};

export const getUserReservations = async (): Promise<ApiResponse<Reservation[]>> => {
  try {
    const response = await api.get<Reservation[]>('/Reservation/mine');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    return { success: false, message: 'Failed to fetch your reservations' };
  }
};

export const getReservationById = async (id: string): Promise<ApiResponse<Reservation>> => {
  try {
    const response = await api.get<Reservation>(`/Reservation/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return { success: false, message: 'Failed to fetch reservation details' };
  }
};

export const createReservation = async (data: ReservationRequest): Promise<ApiResponse<Reservation>> => {
  try {
    const response = await api.post<Reservation>('/Reservation', data);

    // backend'den payment bilgisi varsa burada da kontrol edebiliriz
    const paymentAmount = response.data?.payment?.amount;

    if (paymentAmount !== undefined) {
      console.info(
        `Rezervasyon başarıyla oluşturuldu. Tutar: ${paymentAmount.toLocaleString('tr-TR', {
          style: 'currency',
          currency: 'TRY'
        })}`
      );
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating reservation:', error);
    return { success: false, message: 'Failed to create reservation' };
  }
};

// ✅ Kiracının kendi rezervasyonunu iptal etmesi (DELETE)
export const cancelReservationAsTenant = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await api.delete(`/Reservation/${id}`);
    return { success: true, message: 'Reservation cancelled successfully' };
  } catch (error: any) {
    const apiMsg = error.response?.data || 'Failed to cancel reservation';
    console.error('Error cancelling reservation:', apiMsg);
    return {
      success: false,
      message: typeof apiMsg === 'string' ? apiMsg : apiMsg?.title || 'Failed to cancel reservation',
    };
  }
};

// ✅ Ev sahibi veya admin reddederse (status = 2)
export const rejectReservation = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await api.put(`/Reservation/${id}/status?status=2`);
    return { success: true, message: 'Reservation rejected successfully' };
  } catch (error) {
    console.error('Error rejecting reservation:', error);
    return { success: false, message: 'Failed to reject reservation' };
  }
};

// ✅ Ev sahibi veya admin onaylarsa (status = 1)
export const approveReservation = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await api.put(`/Reservation/${id}/status?status=1`);
    return { success: true, message: 'Reservation approved successfully' };
  } catch (error) {
    console.error('Error approving reservation:', error);
    return { success: false, message: 'Failed to approve reservation' };
  }
};
