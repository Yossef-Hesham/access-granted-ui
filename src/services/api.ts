
import { toast } from "@/components/ui/sonner";

// Handles HTTP requests with authentication
export const api = {
  getToken: () => localStorage.getItem('token'),
  
  getHeaders: (includeContent = true) => {
    const headers: Record<string, string> = {};
    const token = localStorage.getItem('token');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (includeContent) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  },

  // Generic GET request
  async get(url: string) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      toast.error('Failed to fetch data');
      throw error;
    }
  },

  // Generic POST request
  async post(url: string, data: any, isFormData = false) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: isFormData ? this.getHeaders(false) : this.getHeaders(),
        body: isFormData ? data : JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      toast.error(error instanceof Error ? error.message : 'Operation failed');
      throw error;
    }
  },

  // Generic PATCH request
  async patch(url: string, data: any, isFormData = false) {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: isFormData ? this.getHeaders(false) : this.getHeaders(),
        body: isFormData ? data : JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API PATCH error:', error);
      toast.error('Update failed');
      throw error;
    }
  },

  // Generic DELETE request
  async delete(url: string) {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return response.status === 204 ? null : await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      toast.error('Delete operation failed');
      throw error;
    }
  }
};
