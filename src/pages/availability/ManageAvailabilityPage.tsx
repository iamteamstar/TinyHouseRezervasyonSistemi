import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageAvailabilityPage = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error('Lütfen başlangıç ve bitiş tarihlerini seç');
      return;
    }

    if (!houseId) {
      toast.error('Ev ID bulunamadı');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('Bitiş tarihi başlangıç tarihinden sonra olmalıdır');
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); 
      const response = await axios.post(
        'https://localhost:7069/api/Availability',
        {
          houseId: parseInt(houseId),
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        toast.success('Tarihler başarıyla gönderildi!');
        setStartDate('');
        setEndDate('');
      } else {
        toast.success('Tarihler başarıyla gönderildi!');
      }
    } catch (error) {
      console.error('POST error:', error);
      toast.error(error.response?.data?.message || 'Gönderim sırasında hata oluştu');
    }
  };

  const handleGoBack = () => {
    navigate(`/houses/${houseId}`);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-center text-slate-800">Availability Gönder</h2>
        <button 
          onClick={handleGoBack}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          ← Geri Dön
        </button>
      </div>
      
      {houseId && (
        <p className="text-sm text-gray-600 text-center mb-4">Ev ID: {houseId}</p>
      )}

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-slate-700">Başlangıç Tarihi:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={new Date().toISOString().split('T')[0]}
        />

        <label className="font-medium text-slate-700 mt-4">Bitiş Tarihi:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={startDate || new Date().toISOString().split('T')[0]}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!houseId || !startDate || !endDate}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Availability Gönder
      </button>
    </div>
  );
};

export default ManageAvailabilityPage;