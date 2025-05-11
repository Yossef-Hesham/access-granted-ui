
/**
 * Service for handling authentication-related API requests to Django REST Framework
 */

import fetchApi from './api';
import { toast } from "@/hooks/use-toast";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export const authService = {
  register: async (userData: RegisterData) => {
    const response = await fetchApi<{ user: User; token: string }>('/user/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      // Store token in local storage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  login: async (credentials: LoginData) => {
    const response = await fetchApi<{ user: User; token: string }>('/user/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      // Store token in local storage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  },

  getCurrentUser: (): User | null => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      return JSON.parse(userString) as User;
    } catch (e) {
      return null;
    }
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  }
};
