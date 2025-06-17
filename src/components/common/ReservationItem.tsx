import React from 'react';
import { Reservation } from '../../types';

interface Props {
  reservation: Reservation;
  showHouseName?: boolean;
  onCancel?: (id: string) => void;
}

const ReservationItem: React.FC<Props> = ({ reservation, showHouseName, onCancel }) => {
  const { reservationId, startDate, endDate, status, house, payment } = reservation;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) =>
    amount.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    });

  const statusMap: Record<string, { label: string; style: string }> = {
    Pending: { label: 'Beklemede', style: 'bg-yellow-100 text-yellow-800' },
    Approved: { label: 'Onaylandı', style: 'bg-green-100 text-green-800' },
    Rejected: { label: 'İptal Edildi', style: 'bg-red-100 text-red-800' },
  };

  const { label: statusLabel, style: statusStyle } = statusMap[status] || {
    label: status,
    style: 'bg-gray-100 text-gray-800',
  };

  const canCancel = onCancel && (status === 'Pending' || status === 'Approved');

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-semibold">
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
          {showHouseName && house && (
            <div className="text-sm text-slate-600">{house.title}</div>
          )}
        </div>
        <div className="text-sm text-slate-500 flex items-center">
          <span className={`inline-block px-2 py-1 rounded text-xs ${statusStyle}`}>
            {statusLabel}
          </span>

          {canCancel && (
            <button
              onClick={() => onCancel(reservationId.toString())}
              className="text-red-600 hover:underline ml-4 text-sm"
            >
              İptal Et
            </button>
          )}
        </div>
      </div>

      {payment?.amount !== undefined && (
        <div className="text-sm text-slate-700">
          {formatAmount(payment.amount)}
        </div>
      )}
    </div>
  );
};

export default ReservationItem;
