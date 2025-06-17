import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ROUTES } from '../../utils/constants';

// Don't forget to add this route in your router (e.g. App.tsx):
// <Route path="/houses/:id/reserve" element={<ReservationPage />} />

const ReservationPage: React.FC = () => {
  // Get the selected house's ID from URL params
  const { id } = useParams<{ id: string }>();
  const houseId = id ? Number(id) : null;
  const navigate = useNavigate();

  // Reservation dates
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Availability state
  const [availability, setAvailability] = useState<{ available: boolean; message?: string } | null>(null);
  const [checking, setChecking] = useState<boolean>(false);

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Check availability whenever dates or houseId change
  useEffect(() => {
    if (!houseId || !startDate || !endDate) {
      setAvailability(null);
      return;
    }

    const checkAvailability = async () => {
      setChecking(true);
      try {
        const payload = {
          houseId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        };
        const token = localStorage.getItem('authToken');
        const response = await axios.post(
          'https://localhost:7069/api/availability',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvailability(response.data);
      } catch (error) {
        console.error('Error checking availability:', error);
        toast.error('Could not check availability. Please try again later.');
        setAvailability(null);
      } finally {
        setChecking(false);
      }
    };

    checkAvailability();
  }, [houseId, startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }
    if (houseId === null) {
      toast.error('Invalid house ID.');
      return;
    }
    if (availability && !availability.available) {
      toast.error(availability.message || 'Selected dates are not available.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        houseId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };
      const token = localStorage.getItem('authToken');
      await axios.post(
        'https://localhost:7069/api/Reservation',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Reservation successful!');
      navigate(`/houses/${houseId}`);
    } catch (error) {
      console.error('Error making reservation:', error);
      toast.error('Seçtiğiniz tarihlerde uygun değil.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reserve House</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Availability status */}
        {checking && (
          <p className="text-sm text-gray-500">Checking availability…</p>
        )}
        {!checking && availability && (
          <p
            className={`text-sm font-medium ${
              availability.available ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {availability.available
              ? availability.message || 'Dates are available!'
              : availability.message || 'Selected dates are not available.'}
          </p>
        )}

        <div className="flex justify-between items-center">
          <Link to={`/houses/${houseId}`} className="text-slate-600 hover:underline">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || checking || (availability && !availability.available)}
            className="btn btn-primary"
          >
            {submitting ? 'Reserving…' : 'Reserve'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationPage;
