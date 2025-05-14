
import { api } from './api';
import { BOOKING_ENDPOINTS } from './apiEndpoints';
import { toast } from "@/components/ui/sonner";

export interface Booking {
  id: string | number;
  eventId: string | number;
  userId: string | number;
  bookingDate: string;
  eventName?: string;
  eventDate?: string;
  eventVenue?: string;
}

export interface CreateBookingRequest {
  eventId: string | number;
}

export interface BookingStatus {
  isBooked: boolean;
}

export const bookingService = {
  // Get all bookings (admin only)
  async getAllBookings(): Promise<Booking[]> {
    return api.get(BOOKING_ENDPOINTS.GET_ALL);
  },
  
  // Get current user's bookings
  async getUserBookings(): Promise<Booking[]> {
    return api.get(BOOKING_ENDPOINTS.GET_USER_BOOKINGS);
  },
  
  // Create a booking
  async createBooking(eventId: string | number): Promise<Booking> {
    try {
      const response = await api.post(BOOKING_ENDPOINTS.CREATE, { eventId });
      toast.success('Event booked successfully!');
      return response;
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book event');
      throw error;
    }
  },
  
  // Check if user has booked an event
  async checkBookingStatus(eventId: string | number): Promise<BookingStatus> {
    return api.get(BOOKING_ENDPOINTS.CHECK_STATUS(eventId));
  },
  
  // Cancel booking
  async cancelBooking(id: string | number): Promise<void> {
    try {
      await api.delete(BOOKING_ENDPOINTS.CANCEL(id));
      toast.success('Booking canceled successfully');
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error('Failed to cancel booking');
      throw error;
    }
  }
};
