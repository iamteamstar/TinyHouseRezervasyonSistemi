import { format, differenceInDays, parse, isValid, isBefore, isAfter } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Availability, Reservation } from '../types';

// Tarihi YYYY-MM-DD formatına çevir
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Tarihi okunabilir formata çevir
export const formatReadableDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'd MMMM yyyy', { locale: tr });
};

// İki tarih arasındaki gece sayısını hesapla
export const calculateNights = (startDate: Date, endDate: Date): number => {
  return differenceInDays(endDate, startDate);
};

// Toplam fiyatı hesapla
export const calculateTotalPrice = (pricePerNight: number, startDate: Date, endDate: Date): number => {
  const nights = calculateNights(startDate, endDate);
  return pricePerNight * nights;
};

// Tarih string'ini Date objesine çevir
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const parsedDate = new Date(dateString);
  return isValid(parsedDate) ? parsedDate : null;
};

// Tarih aralığının müsait olup olmadığını kontrol et
export const isDateRangeAvailable = (
  startDate: Date,
  endDate: Date,
  availabilities: Availability[],
  reservations: Reservation[]
): boolean => {
  // Tarihlerin müsait dönemler içinde olup olmadığını kontrol et
  const isWithinAvailablePeriod = availabilities.some((availability) => {
    const availStartDate = new Date(availability.startDate);
    const availEndDate = new Date(availability.endDate);
    
    return (
      isValid(availStartDate) &&
      isValid(availEndDate) &&
      !isBefore(startDate, availStartDate) &&
      !isAfter(endDate, availEndDate)
    );
  });
  
  if (!isWithinAvailablePeriod) return false;
  
  // Mevcut rezervasyonlarla çakışma olup olmadığını kontrol et
  const hasConflict = reservations.some((reservation) => {
    if (reservation.status === 'İptal Edildi') return false;
    
    const reservationStartDate = new Date(reservation.startDate);
    const reservationEndDate = new Date(reservation.endDate);
    
    return (
      isValid(reservationStartDate) &&
      isValid(reservationEndDate) &&
      !(isBefore(endDate, reservationStartDate) || isAfter(startDate, reservationEndDate))
    );
  });
  
  return !hasConflict;
};

// Metni üç nokta ile kısalt
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Rol ID'sini rol adına çevir
export const getRoleName = (roleId: number): string => {
  switch (roleId) {
    case 1:
      return 'Yönetici';
    case 2:
      return 'Ev Sahibi';
    case 3:
      return 'Kiracı';
    default:
      return 'Bilinmeyen';
  }
};

// Para birimini formatla
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};