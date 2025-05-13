
/**
 * Base API client for communicating with Django REST Framework backend
 */

import { BASE_API_URL } from './apiEndpoints';

// Response type for consistent error handling
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 * Generic fetch function with error handling for Django REST Framework
 * @param endpoint - API endpoint (without base URL)
 * @param options - Request options
 * @returns ApiResponse with data, error and success status
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${BASE_API_URL}${endpoint}`;
    
    // Set default headers if not provided
    if (!options.headers) {
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    
    // Add auth token if available (JWT token for Django REST Framework)
    const token = localStorage.getItem("authToken");
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    
    const response = await fetch(url, options);
    
    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      // Handle Django REST Framework error responses
      const errorMessage = data.detail || data.message || data.error || "An error occurred";
      return { data: null, error: errorMessage, success: false };
    }
    
    return { data, error: null, success: true };
  } catch (error) {
    console.error("API Error:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : "Network error", 
      success: false 
    };
  }
}

export default fetchApi;
