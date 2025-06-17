import { House, AuthUser, Availability, Review } from '../types';

// Mock houses data
export const mockHouses: House[] = [
  {
    id: '1',
    title: 'Cozy Mountain Cabin',
    description: 'A beautiful cabin nestled in the mountains with stunning views and modern amenities. Perfect for a peaceful getaway.',
    address: '123 Mountain View Drive, Aspen, CO',
    pricePerNight: 150,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Parking'],
    images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'],
    ownerId: 'owner1',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Modern Tiny House',
    description: 'A sleek and modern tiny house with all the essentials. Eco-friendly and perfectly designed for minimalist living.',
    address: '456 Eco Lane, Portland, OR',
    pricePerNight: 120,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Solar Power', 'Composting Toilet'],
    images: ['https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg'],
    ownerId: 'owner2',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '3',
    title: 'Lakeside Retreat',
    description: 'Wake up to beautiful lake views in this charming waterfront property. Includes kayaks and fishing equipment.',
    address: '789 Lake Shore Blvd, Lake Tahoe, CA',
    pricePerNight: 200,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['WiFi', 'Kitchen', 'Lake Access', 'Kayaks', 'Fire Pit'],
    images: ['https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg'],
    ownerId: 'owner3',
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
];

// Mock availability data
export const mockAvailabilities: Availability[] = [
  {
    id: '1',
    houseId: '1',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    isAvailable: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    houseId: '1',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    isAvailable: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '3',
    houseId: '2',
    startDate: '2024-02-10',
    endDate: '2024-02-28',
    isAvailable: true,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '4',
    houseId: '3',
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    isAvailable: true,
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
];

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: '1',
    houseId: '1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing cabin with breathtaking views! The fireplace was perfect for cozy evenings.',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '2',
    houseId: '1',
    userId: 'user2',
    userName: 'Sarah Smith',
    rating: 4,
    comment: 'Great location and very clean. Would definitely stay again!',
    createdAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString(),
  },
  {
    id: '3',
    houseId: '2',
    userId: 'user3',
    userName: 'Mike Johnson',
    rating: 5,
    comment: 'Perfect tiny house experience. Everything was thoughtfully designed and eco-friendly.',
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: '4',
    houseId: '3',
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'The lake access was incredible! Loved using the kayaks and the fire pit at night.',
    createdAt: new Date('2024-01-28').toISOString(),
    updatedAt: new Date('2024-01-28').toISOString(),
  },
];

// Mock user data
export const mockUser: AuthUser = {
  id: 'user1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  token: 'mock-jwt-token',
  role: 'User',
};

// Simulate API delay
export const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));