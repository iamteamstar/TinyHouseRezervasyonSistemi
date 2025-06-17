import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Availability } from '../../types';
import { formatDate } from '../../utils/helpers';
import { CalendarDays, Plus, X } from 'lucide-react';

interface AvailabilityCalendarProps {
  availabilities: Availability[];
  onAddAvailability: (startDate: Date, endDate: Date, isAvailable: boolean) => Promise<void>;
  onRemoveAvailability: (id: string) => Promise<void>;
}

const AvailabilityCalendar = ({
  availabilities,
  onAddAvailability,
  onRemoveAvailability,
}: AvailabilityCalendarProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onAddAvailability(startDate, endDate, isAvailable);
      setStartDate(null);
      setEndDate(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort availabilities by date
  const sortedAvailabilities = [...availabilities].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Add Availability Period</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                placeholderText="Select start date"
                dateFormat="MMMM d, yyyy"
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Select end date"
                dateFormat="MMMM d, yyyy"
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              <span className="ms-3 text-sm font-medium text-slate-700">
                {isAvailable ? 'Available for booking' : 'Blocked (unavailable)'}
              </span>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={!startDate || !endDate || isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Adding...
                </span>
              ) : (
                <span className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Period
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Current Availability Periods</h3>
        
        {sortedAvailabilities.length === 0 ? (
          <p className="text-slate-500 italic">No availability periods set. Add one to start accepting bookings.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {sortedAvailabilities.map((availability) => (
              <div 
                key={availability.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  availability.isAvailable ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'
                }`}
              >
                <div>
                  <span className={`text-sm font-medium ${availability.isAvailable ? 'text-success-800' : 'text-error-800'}`}>
                    {new Date(availability.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {' - '}
                    {new Date(availability.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <p className={`text-xs ${availability.isAvailable ? 'text-success-700' : 'text-error-700'}`}>
                    {availability.isAvailable ? 'Available' : 'Blocked'}
                  </p>
                </div>
                
                <button
                  onClick={() => onRemoveAvailability(availability.id)}
                  className={`p-1 rounded-full ${
                    availability.isAvailable ? 'text-success-700 hover:bg-success-100' : 'text-error-700 hover:bg-error-100'
                  }`}
                  aria-label="Remove availability"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;