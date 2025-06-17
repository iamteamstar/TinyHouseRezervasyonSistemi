import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, isAfter } from 'date-fns';
import { Availability, Reservation } from '../../types';
import { isDateRangeAvailable } from '../../utils/helpers';
import { CalendarDays } from 'lucide-react';

interface DateRangePickerProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
  availabilities?: Availability[];
  existingReservations?: Reservation[];
}

const DateRangePicker = ({
  onDateChange,
  availabilities = [],
  existingReservations = [],
}: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startDate && endDate) {
      // Validate the selected date range
      if (isAfter(startDate, endDate)) {
        setError('End date must be after start date');
        return;
      }

      if (availabilities.length > 0 && existingReservations) {
        if (!isDateRangeAvailable(startDate, endDate, availabilities, existingReservations)) {
          setError('Selected dates are not available');
          return;
        }
      }

      setError(null);
      onDateChange(startDate, endDate);
    }
  }, [startDate, endDate, onDateChange, availabilities, existingReservations]);

  // Custom date filtering
  const isDateBlocked = (date: Date) => {
    if (availabilities.length === 0) return false;

    // Check if the date is within an available period
    const isAvailable = availabilities.some((availability) => {
      const availStartDate = new Date(availability.startDate);
      const availEndDate = new Date(availability.endDate);
      
      return date >= availStartDate && date <= availEndDate && availability.isAvailable;
    });

    if (!isAvailable) return true;

    // Check if the date is within an existing reservation
    const isReserved = existingReservations.some((reservation) => {
      if (reservation.status === 'Cancelled') return false;
      
      const reservationStartDate = new Date(reservation.startDate);
      const reservationEndDate = new Date(reservation.endDate);
      
      return date >= reservationStartDate && date <= reservationEndDate;
    });

    return isReserved;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            Check-in Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            placeholderText="Select check-in date"
            dateFormat="MMMM d, yyyy"
            className="form-input"
            filterDate={(date) => !isDateBlocked(date)}
          />
        </div>
        
        <div>
          <label className="form-label flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            Check-out Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ? addDays(startDate, 1) : new Date()}
            placeholderText="Select check-out date"
            dateFormat="MMMM d, yyyy"
            className="form-input"
            filterDate={(date) => !isDateBlocked(date)}
          />
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error-600">{error}</p>
      )}
      
      {startDate && endDate && !error && (
        <div className="mt-3 py-2 px-3 bg-primary-50 rounded text-sm text-primary-800 inline-flex items-center">
          <CalendarDays className="w-4 h-4 mr-1" />
          Selected: {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;