
/**
 * Service for handling booking-related API requests to Django REST Framework
 */

import fetchApi from './api';
import { Event } from './eventService';

export interface Booking {
  id: number;
  event: Event;
  createdAt: string;
  userId: number;
}

export const bookingService = {
  // Book an event for the current user
  bookEvent: async (eventId: number) => {
    return await fetchApi<Booking>('/bookings/', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    });
  },
  
  // Get all bookings for the current user
  getUserBookings: async () => {
    return await fetchApi<Booking[]>('/bookings/user/');
  },
  
  // Get all bookings (admin only)
  getAllBookings: async () => {
    return await fetchApi<Booking[]>('/bookings/');
  },
  
  // Check if a user has booked a specific event
  checkEventBooking: async (eventId: number) => {
    return await fetchApi<{isBooked: boolean}>(`/bookings/check/${eventId}/`);
  },
  
  // Cancel a booking
  cancelBooking: async (bookingId: number) => {
    return await fetchApi(`/bookings/${bookingId}/`, {
      method: 'DELETE',
    });
  },
};
