// services/availabilityService.ts
import axios from 'axios';
import { Availability, AvailabilityRequest, ApiResponse } from '../types';

const API_BASE_URL = 'https://localhost:7069/api/Availability'; 

export const getHouseAvailability = async (
  houseId: string
): Promise<ApiResponse<Availability[]>> => {
  try {
    const response = await axios.get<ApiResponse<Availability[]>>(
      `${API_BASE_URL}/house/${houseId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching house availability:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch availability',
    };
  }
};

export const createAvailability = async (
  data: AvailabilityRequest
): Promise<ApiResponse<Availability>> => {
  try {
    const response = await axios.post<ApiResponse<Availability>>(
      API_BASE_URL,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error('Error creating availability:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create availability',
    };
  }
};

export const deleteAvailability = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axios.delete<ApiResponse<null>>(
      `${API_BASE_URL}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error deleting availability:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete availability',
    };
  }
};
