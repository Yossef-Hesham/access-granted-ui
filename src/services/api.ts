
import { toast } from "@/hooks/use-toast";

const API_URL = "http://127.0.0.1:8000/api";

// Response type for consistent error handling
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Generic fetch function with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    
    // Set default headers if not provided
    if (!options.headers) {
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    
    // Add auth token if available
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
      // Handle API error responses
      const errorMessage = data.detail || data.message || "An error occurred";
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
