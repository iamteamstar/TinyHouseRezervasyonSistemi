import api from './authService';
import { User, UpdateUserRequest, ApiResponse } from '../types';

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await api.get<User[]>('/User');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: 'Failed to fetch users',
    };
  }
};

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get<User>(`/User/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      message: 'Failed to fetch user details',
    };
  }
};

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
  try {
    const response = await api.put<User>(`/User/${id}`, data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: 'Failed to update user',
    };
  }
};

export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await api.delete(`/User/${id}`);
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Failed to delete user',
    };
  }
};