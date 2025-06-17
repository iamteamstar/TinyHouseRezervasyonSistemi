// User types
export interface User {
  id: string;
  fullName: string;
  email: string;
  roleId: number;
  role?: string;
  isActive?: boolean;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserRequest {
  fullName: string;
  isActive: boolean;
  roleId: number;
}

// House types
export interface House {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  bedrooms?: number;
  bathrooms?: number;
  maxOccupancy?: number;
  amenities?: string;
  ownerId: string;
  ownerName?: string;
  imageUrl?: string;
  rating?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HouseFormData {
  Title: string;
  Description: string;
  Location: string;
  PricePerNight: number;
  startDate: string;
  endDate: string;
  bedrooms?: number;
  bathrooms?: number;
  maxOccupancy?: number;
  amenities?: string;
  imageUrl?: string;
  isActive?: boolean;
}

// Reservation types
export interface Reservation {
  id: string;
  houseId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalAmount?: number;
  status: string;
  createdAt: string;
  userName?: string;
  houseName?: string;
}

export interface ReservationRequest {
  houseId: string;
  startDate: string;
  endDate: string;
}

// Availability types
export interface Availability {
  id: string;
  houseId: string;
  startDate: string;
  endDate: string;
  isAvailable?: boolean;
}

export interface AvailabilityRequest {
  houseId: string;
  startDate: string;
  endDate: string;
}

// Review types
export interface Review {
  id: string;
  houseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName?: string;
}

export interface ReviewRequest {
  houseId: string;
  rating: number;
  comment: string;
}

// Role types
export enum Role {
  Admin = 1,
  HouseOwner = 2,
  Tenant = 3,
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  errors?: string[];
}