import { House, HouseFormData, ApiResponse } from '../types';
import { mockHouses, simulateApiDelay } from './mockData';

// In-memory storage for demo purposes
let houses = [...mockHouses];
let nextId = 4;

export const getHouses = async (): Promise<ApiResponse<House[]>> => {
  await simulateApiDelay();
  
  try {
    return {
      success: true,
      data: houses,
    };
  } catch (error) {
    console.error('Error fetching houses:', error);
    return {
      success: false,
      message: 'Failed to fetch houses',
    };
  }
};

export const getHouseById = async (id: string): Promise<ApiResponse<House>> => {
  await simulateApiDelay();
  
  try {
    const house = houses.find(h => h.id === id);
    if (house) {
      return {
        success: true,
        data: house,
      };
    } else {
      return {
        success: false,
        message: 'House not found',
      };
    }
  } catch (error) {
    console.error('Error fetching house:', error);
    return {
      success: false,
      message: 'Failed to fetch house details',
    };
  }
};

export const createHouse = async (houseData: HouseFormData): Promise<ApiResponse<House>> => {
  await simulateApiDelay();
  
  try {
    const newHouse: House = {
      id: nextId.toString(),
      ...houseData,
      ownerId: 'user1', // Mock owner ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    houses.push(newHouse);
    nextId++;
    
    return {
      success: true,
      data: newHouse,
    };
  } catch (error) {
    console.error('Error creating house:', error);
    return {
      success: false,
      message: 'Failed to create house',
    };
  }
};

export const updateHouse = async (id: string, houseData: HouseFormData): Promise<ApiResponse<House>> => {
  await simulateApiDelay();
  
  try {
    const houseIndex = houses.findIndex(h => h.id === id);
    if (houseIndex !== -1) {
      const updatedHouse: House = {
        ...houses[houseIndex],
        ...houseData,
        updatedAt: new Date().toISOString(),
      };
      
      houses[houseIndex] = updatedHouse;
      
      return {
        success: true,
        data: updatedHouse,
      };
    } else {
      return {
        success: false,
        message: 'House not found',
      };
    }
  } catch (error) {
    console.error('Error updating house:', error);
    return {
      success: false,
      message: 'Failed to update house',
    };
  }
};

export const deleteHouse = async (id: string): Promise<ApiResponse<null>> => {
  await simulateApiDelay();
  
  try {
    const houseIndex = houses.findIndex(h => h.id === id);
    if (houseIndex !== -1) {
      houses.splice(houseIndex, 1);
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: 'House not found',
      };
    }
  } catch (error) {
    console.error('Error deleting house:', error);
    return {
      success: false,
      message: 'Failed to delete house',
    };
  }
};