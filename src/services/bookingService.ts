
/**
 * Service for handling booking-related API requests to Django REST Framework
 */

import fetchApi from './api';
import { BOOKING_ENDPOINTS } from './apiEndpoints';
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
    return await fetchApi<Booking>(BOOKING_ENDPOINTS.BASE, {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    });
  },
  
  // Get all bookings for the current user
  getUserBookings: async () => {
    return await fetchApi<Booking[]>(BOOKING_ENDPOINTS.USER);
  },
  
  // Get all bookings (admin only)
  getAllBookings: async () => {
    return await fetchApi<Booking[]>(BOOKING_ENDPOINTS.BASE);
  },
  
  // Check if a user has booked a specific event
  checkEventBooking: async (eventId: number) => {
    return await fetchApi<{isBooked: boolean}>(BOOKING_ENDPOINTS.CHECK(eventId));
  },
  
  // Cancel a booking
  cancelBooking: async (bookingId: number) => {
    return await fetchApi(BOOKING_ENDPOINTS.CANCEL(bookingId), {
      method: 'DELETE',
    });
  },
};
