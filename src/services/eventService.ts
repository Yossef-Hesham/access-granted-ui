
import { api } from './api';
import { EVENT_ENDPOINTS } from './apiEndpoints';
import { toast } from "@/components/ui/sonner";

export interface Event {
  id: string | number;
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  image?: File;
}

export type UpdateEventRequest = Partial<CreateEventRequest>;

export const eventService = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    return api.get(EVENT_ENDPOINTS.GET_ALL);
  },
  
  // Get single event
  async getEvent(id: string | number): Promise<Event> {
    return api.get(EVENT_ENDPOINTS.GET_ONE(id));
  },
  
  // Create new event (admin only)
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    // Convert to FormData for image upload
    const formData = new FormData();
    
    Object.keys(eventData).forEach(key => {
      const value = eventData[key as keyof CreateEventRequest];
      if (value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    
    try {
      const response = await api.post(EVENT_ENDPOINTS.CREATE, formData, true);
      toast.success('Event created successfully');
      return response;
    } catch (error) {
      console.error('Create event error:', error);
      toast.error('Failed to create event');
      throw error;
    }
  },
  
  // Update event (admin only)
  async updateEvent(id: string | number, eventData: UpdateEventRequest): Promise<Event> {
    // Convert to FormData for image upload
    const formData = new FormData();
    
    Object.keys(eventData).forEach(key => {
      const value = eventData[key as keyof UpdateEventRequest];
      if (value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    
    try {
      const response = await api.patch(EVENT_ENDPOINTS.UPDATE(id), formData, true);
      toast.success('Event updated successfully');
      return response;
    } catch (error) {
      console.error('Update event error:', error);
      toast.error('Failed to update event');
      throw error;
    }
  },
  
  // Delete event (admin only)
  async deleteEvent(id: string | number): Promise<void> {
    try {
      await api.delete(EVENT_ENDPOINTS.DELETE(id));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Failed to delete event');
      throw error;
    }
  }
};
