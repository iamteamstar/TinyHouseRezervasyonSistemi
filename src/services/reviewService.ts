// services/reviewService.ts
import axios from 'axios';
import { ReviewRequest, Review, ApiResponse } from '../types';

export const createReview = async (data: ReviewRequest): Promise<ApiResponse<Review>> => {
  try {
    const response = await axios.post('/api/Review', data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Yorum gönderilemedi',
    };
  }
};
