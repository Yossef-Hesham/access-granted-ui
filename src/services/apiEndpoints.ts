
/**
 * Centralized API endpoints configuration for Django REST Framework backend
 * This file defines all API endpoints used in the application
 */

// Base API URL
export const BASE_API_URL = "http://127.0.0.1:8000/api";

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  USER_REGISTER: "/user/register/",
  ADMIN_REGISTER: "/admin/register/",
  LOGIN: "/login/",
};

// Event endpoints
export const EVENT_ENDPOINTS = {
  BASE: "/events/",
  SINGLE: (id: number) => `/events/${id}/`,
};

// Booking endpoints
export const BOOKING_ENDPOINTS = {
  BASE: "/bookings/",
  USER: "/bookings/user/",
  CHECK: (eventId: number) => `/bookings/check/${eventId}/`,
  CANCEL: (id: number) => `/bookings/${id}/`,
};

/**
 * Complete endpoint URL builder
 * @param endpoint - The API endpoint path
 * @returns Full API URL
 */
export const getFullEndpoint = (endpoint: string): string => {
  return `${BASE_API_URL}${endpoint}`;
};
