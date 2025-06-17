import React, { useState, useEffect } from 'react';
import {
  getAllReservations,
  approveReservation,
  rejectReservation, // 👈 değişiklik burada
} from '../../services/reservationService';
import { Reservation } from '../../types';
import ReservationItem from '../../components/common/ReservationItem';
import toast from 'react-hot-toast';
import { Calendar, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'cancel' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled' | 'completed'>('all');

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await getAllReservations();
        if (response.success && response.data) {
          setReservations(response.data);
          setFilteredReservations(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch reservations');
        }
      } catch (error) {
        console.error('Error fetching all reservations:', error);
        toast.error('An error occurred while fetching reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredReservations(reservations);
    } else {
      const statusMap: Record<string, string> = {
        pending: 'Pending',
        approved: 'Approved',
        cancelled: 'Cancelled',
        completed: 'Completed',
      };
      const filtered = reservations.filter(
        (r) => r.status === statusMap[filter]
      );
      setFilteredReservations(filtered);
    }
  }, [filter, reservations]);

  const confirmAction = (id: string, action: 'approve' | 'cancel') => {
    setReservationId(id);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleAction = async () => {
    if (!reservationId || !actionType) return;

    setProcessing(true);
    try {
      const actionFn = actionType === 'approve' ? approveReservation : rejectReservation; // 👈 düzeltildi
      const response = await actionFn(reservationId);

      if (response.success) {
        const newStatus = actionType === 'approve' ? 'Approved' : 'Rejected'; // 👈 düzeltildi
        const updatedReservations = reservations.map((res) =>
          res.reservationId === reservationId
            ? { ...res, status: newStatus }
            : res
        );

        setReservations(updatedReservations);
        toast.success(
          `Reservation ${actionType === 'approve' ? 'approved' : 'cancelled'} successfully`
        );
      } else {
        toast.error(response.message || `Failed to ${actionType} reservation`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${actionType}ing the reservation`);
    } finally {
      setProcessing(false);
      setActionDialogOpen(false);
      setReservationId(null);
      setActionType(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">All Reservations</h1>
          <p className="text-slate-600">Manage all reservations across the platform</p>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              className="pl-10 form-input py-2 pr-10 appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Reservations</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredReservations.length > 0 ? (
        <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
          {filteredReservations.map((reservation) => (
            <ReservationItem
              key={reservation.reservationId}
              reservation={reservation}
              showUserName
              showHouseName
              onApprove={reservation.status === 'Pending' ? (id) => confirmAction(id, 'approve') : undefined}
              onCancel={
                reservation.status !== 'Cancelled' && reservation.status !== 'Completed'
                  ? (id) => confirmAction(id, 'cancel')
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 flex items-center justify-center rounded-full mb-4">
            <Calendar className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {filter === 'all' ? 'No Reservations Found' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Reservations`}
          </h3>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            {filter === 'all'
              ? 'There are no reservations in the system yet.'
              : `There are no reservations with ${filter} status.`}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="btn btn-outline"
            >
              Show All Reservations
            </button>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className={`flex items-center ${actionType === 'approve' ? 'text-success-600' : 'text-error-600'} mb-4`}>
              {actionType === 'approve' ? (
                <CheckCircle className="w-6 h-6 mr-2" />
              ) : (
                <XCircle className="w-6 h-6 mr-2" />
              )}
              <Dialog.Title className="text-xl font-semibold">
                {actionType === 'approve' ? 'Approve Reservation' : 'Cancel Reservation'}
              </Dialog.Title>
            </div>
            <Dialog.Description className="text-slate-700 mb-6">
              {actionType === 'approve'
                ? 'Are you sure you want to approve this reservation? This will confirm the booking.'
                : 'Are you sure you want to cancel this reservation? This action cannot be undone.'}
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActionDialogOpen(false)}
                className="btn btn-outline"
                disabled={processing}
              >
                {actionType === 'approve' ? "Don't Approve" : 'Keep Reservation'}
              </button>
              <button
                onClick={handleAction}
                disabled={processing}
                className={actionType === 'approve' ? 'btn btn-primary' : 'btn btn-danger'}
              >
                {processing ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    {actionType === 'approve' ? 'Approving...' : 'Cancelling...'}
                  </span>
                ) : (
                  actionType === 'approve' ? 'Approve' : 'Cancel'
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminReservationsPage;
