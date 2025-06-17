import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HouseForm from '../../components/house/HouseForm';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Role, HouseFormData } from '../../types';

const EditHousePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [initialData, setInitialData] = useState<HouseFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchHouseData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch the house by ID
        const { data } = await axios.get<HouseFormData>(`https://localhost:7069/api/House/${id}`);

        // Permission check
        if (
          currentUser?.roleId === Role.Admin ||
          (currentUser?.roleId === Role.HouseOwner && data.ownerId === currentUser.id)
        ) {
          // Remove fields not part of the form
          const { id: _, ownerId: __, ownerName: ___, ...formData } = data;
          setInitialData(formData as HouseFormData);
        } else {
          toast.error('You do not have permission to edit this house');
          navigate('/houses');
        }
      } catch (error) {
        console.error('Error fetching house:', error);
        toast.error('An error occurred while fetching house data');
        navigate('/houses');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchHouseData();
    }
  }, [id, currentUser, navigate]);

  const handleSubmit = async (data: HouseFormData) => {
    if (!id) return;

    setSubmitting(true);
    try {
      // Send PUT request to update the house
      const token = localStorage.getItem('authToken')
      await axios.put(`https://localhost:7069/api/House/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

      toast.success('House updated successfully');
      navigate(`/houses/${id}`);
    } catch (error) {
      console.error('Error updating house:', error);
      toast.error('An error occurred while updating the house');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit House</h1>
          <p className="text-slate-600">Update your property details</p>
        </div>
      </div>

      <HouseForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={submitting}
        title="Update House Details"
        buttonText="Save Changes"
      />
    </div>
  );
};

export default EditHousePage;
