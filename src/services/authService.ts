
import { api } from './api';
import { AUTH_ENDPOINTS } from './apiEndpoints';
import { toast } from "@/components/ui/sonner";

export interface AuthUser {
  id: string | number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterAdminRequest extends RegisterUserRequest {
  secretKey: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authService = {
  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
  
  // Check if current user is an admin
  isAdmin(): boolean {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr) as AuthUser;
      return user.isAdmin === true;
    } catch (e) {
      return false;
    }
  },
  
  // Get current user data
  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as AuthUser;
    } catch (e) {
      return null;
    }
  },

  // Login user
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
      this.setSession(response);
      toast.success('Login successful');
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  },

  // Register normal user
  async registerUser(userData: RegisterUserRequest): Promise<AuthUser> {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER_USER, userData);
      this.setSession(response);
      toast.success('Registration successful');
      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  },

  // Register admin user
  async registerAdmin(userData: RegisterAdminRequest): Promise<AuthUser> {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER_ADMIN, userData);
      this.setSession(response);
      toast.success('Admin registration successful');
      return response.user;
    } catch (error) {
      console.error('Admin registration error:', error);
      toast.error('Admin registration failed. Please check the secret key and try again.');
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  },

  // Set auth session after login/register
  setSession(authResponse: AuthResponse) {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  }
};
