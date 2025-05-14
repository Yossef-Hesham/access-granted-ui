
// API endpoints configuration
const API_BASE_URL = '/api'; // Replace with your actual API base URL when deploying

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login/`,
  REGISTER_USER: `${API_BASE_URL}/user/register/`,
  REGISTER_ADMIN: `${API_BASE_URL}/admin/register/`,
};

export const EVENT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/events/`,
  GET_ONE: (id: string | number) => `${API_BASE_URL}/events/${id}/`,
  CREATE: `${API_BASE_URL}/events/`,
  UPDATE: (id: string | number) => `${API_BASE_URL}/events/${id}/`,
  DELETE: (id: string | number) => `${API_BASE_URL}/events/${id}/`,
};

export const BOOKING_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/bookings/`,
  GET_USER_BOOKINGS: `${API_BASE_URL}/bookings/user/`,
  CREATE: `${API_BASE_URL}/bookings/`,
  CHECK_STATUS: (eventId: string | number) => `${API_BASE_URL}/bookings/check/${eventId}/`,
  CANCEL: (id: string | number) => `${API_BASE_URL}/bookings/${id}/`,
};
