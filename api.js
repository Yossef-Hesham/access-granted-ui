
// API base URL (Change this to your Django server URL in production)
const API_URL = 'http://127.0.0.1:8000/api';

// Helper function to get the authentication token
function getAuthToken() {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
  return user ? user.token : null;
}

// Helper function to check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
}

// Helper function to get the current user data
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
}

// Helper function for API requests with authentication
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Token ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token expired or invalid, logout
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      window.location.href = 'index.html';
      return null;
    }
    
    // For 204 No Content responses
    if (response.status === 204) {
      return { success: true };
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw { status: response.status, data };
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Expose the functions
window.api = {
  login: async (email, password) => {
    return await apiRequest('/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  register: async (userData) => {
    return await apiRequest('/user/register/', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  getCurrentUser,
  isAuthenticated,
  getAuthToken
};
