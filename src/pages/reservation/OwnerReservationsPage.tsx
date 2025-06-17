import React, { useEffect, useState } from 'react';
import { getOwnerReservations, approveReservation, rejectReservation } from '../../services/reservationService';
import { Reservation } from '../../types';
import ReservationItem from '../../components/common/ReservationItem';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

const OwnerReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'deny' | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await getOwnerReservations();
        if (response.success && response.data) {
          setReservations(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch reservations');
        }
      } catch (error) {
        console.error('Error fetching owner reservations:', error);
        toast.error('An error occurred while fetching reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const confirmAction = (id: string, action: 'approve' | 'deny') => {
    setReservationId(id);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleAction = async () => {
    if (!reservationId || !actionType) return;

    setProcessing(true);
    try {
      let response;
      if (actionType === 'approve') {
        response = await approveReservation(reservationId);
      } else {
        response = await rejectReservation(reservationId);
      }

      if (response.success) {
        const newStatus = actionType === 'approve' ? 'Approved' : 'Rejected';
        const updated = reservations.map(r =>
          r.reservationId === reservationId ? { ...r, status: newStatus } : r
        );
        setReservations(updated);
        toast.success(
          actionType === 'approve'
            ? 'Reservation approved successfully'
            : 'Reservation rejected successfully'
        );
      } else {
        toast.error(response.message || `Failed to ${actionType} reservation`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${actionType === 'approve' ? 'approving' : 'rejecting'} the reservation`);
    } finally {
      setProcessing(false);
      setActionDialogOpen(false);
      setReservationId(null);
      setActionType(null);
    }
  };

  const pending = reservations.filter(r => r.status === 'Pending');
  const upcoming = reservations.filter(r => r.status === 'Approved');
  const past = reservations.filter(r =>
    ['Completed', 'Cancelled', 'Rejected'].includes(r.status)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Bookings</h1>
        <p className="text-slate-600 ml-4">Manage reservation requests for your properties</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Requests */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-secondary-500 mr-2" />
              <h2 className="text-xl font-semibold text-slate-800">
                Pending Requests {pending.length > 0 && `(${pending.length})`}
              </h2>
            </div>
            {pending.length > 0 ? (
              <div className="space-y-4">
                {pending.map(reservation => (
                  <div key={reservation.reservationId} className="border rounded-lg p-4">
                    <ReservationItem
                      reservation={reservation}
                      showUserName
                      showHouseName
                    />
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => confirmAction(reservation.reservationId, 'approve')}
                        className="btn btn-primary flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          confirmAction(reservation.reservationId, 'deny');
                        }}
                        className="btn btn-danger flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic py-3">No pending reservation requests.</p>
            )}
          </section>

          {/* Upcoming Stays */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-success-500 mr-2" />
              <h2 className="text-xl font-semibold text-slate-800">
                Upcoming Stays {upcoming.length > 0 && `(${upcoming.length})`}
              </h2>
            </div>
            {upcoming.length > 0 ? (
              <div className="space-y-4">
                {upcoming.map(reservation => (
                  <ReservationItem
                    key={reservation.reservationId}
                    reservation={reservation}
                    showUserName
                    showHouseName
                    onCancel={(id) => confirmAction(id, 'deny')}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic py-3">No upcoming stays.</p>
            )}
          </section>

          {/* Past Reservations */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <XCircle className="w-5 h-5 text-slate-500 mr-2" />
              <h2 className="text-xl font-semibold text-slate-800">
                Past Reservations {past.length > 0 && `(${past.length})`}
              </h2>
            </div>
            {past.length > 0 ? (
              <div className="space-y-4">
                {past.map(reservation => (
                  <ReservationItem
                    key={reservation.reservationId}
                    reservation={reservation}
                    showUserName
                    showHouseName
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic py-3">No past reservations.</p>
            )}
          </section>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center mb-4">
              {actionType === 'approve' ? (
                <CheckCircle className="w-6 h-6 mr-2 text-success-600" />
              ) : (
                <XCircle className="w-6 h-6 mr-2 text-error-600" />
              )}
              <Dialog.Title className="text-xl font-semibold">
                {actionType === 'approve' ? 'Approve Reservation' : 'Deny Reservation'}
              </Dialog.Title>
            </div>
            <Dialog.Description className="text-slate-700 mb-6">
              {actionType === 'approve'
                ? 'Are you sure you want to approve this reservation? This will confirm the booking.'
                : 'Are you sure you want to deny this reservation? This action cannot be undone.'}
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
                    {actionType === 'approve' ? 'Approving...' : 'Denying...'}
                  </span>
                ) : (
                  actionType === 'approve' ? 'Approve' : 'Deny'
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default OwnerReservationsPage;
