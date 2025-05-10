
import fetchApi from './api';

export interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  image: string;
  isBooked?: boolean;
}

export interface EventCreateData {
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  image?: File;
}

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    return await fetchApi<Event[]>('/events/');
  },

  // Get single event by ID
  getEvent: async (eventId: number) => {
    return await fetchApi<Event>(`/events/${eventId}/`);
  },

  // Create new event (admin only)
  createEvent: async (eventData: EventCreateData) => {
    // Handle file upload with FormData
    const formData = new FormData();
    
    // Add all event data to FormData
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    
    return await fetchApi<Event>('/events/', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content type with boundary
    });
  },

  // Update existing event (admin only)
  updateEvent: async (eventId: number, eventData: Partial<EventCreateData>) => {
    // Handle file upload with FormData for partial updates
    const formData = new FormData();
    
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    
    return await fetchApi<Event>(`/events/${eventId}/`, {
      method: 'PATCH',
      body: formData,
      headers: {}, // Let browser set content type with boundary
    });
  },

  // Delete event (admin only)
  deleteEvent: async (eventId: number) => {
    return await fetchApi(`/events/${eventId}/`, {
      method: 'DELETE',
    });
  },
};
