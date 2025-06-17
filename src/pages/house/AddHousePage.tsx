import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HouseFormData } from '../../types';
import HouseForm from '../../components/house/HouseForm';
import toast from 'react-hot-toast';
import { ROUTES } from '../../utils/constants';

const AddHousePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: HouseFormData) => {
    if (!currentUser) {
      toast.error('You must be logged in to add a house');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('https://localhost:7069/api/House', data,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      
      if (response.status === 201 && response.data) {
        toast.success('House added successfully');
        navigate(`/houses/${response.data.id}`);
      } else {
        toast.error(response.statusText || 'Failed to add house');
      }
    } catch (error) {
      console.error('Error adding house:', error);
      toast.error('An error occurred while adding the house');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New House</h1>
          <p className="text-slate-600">
            List your property to start receiving bookings
          </p>
        </div>
      </div>

      <HouseForm
        onSubmit={handleSubmit}
        isLoading={loading}
        title="House Details"
        buttonText="Add House"
      />
    </div>
  );
};

export default AddHousePage;
