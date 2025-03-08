
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Get the authenticated state
export const isUserAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Sign up function
export const signup = async (name: string, email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
    });
    
    if (response.data && response.data.token) {
      // Store token and authentication status
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      }));
      
      return response.data;
    }
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Login function
export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL}/signin`, {
      email,
      password,
    });
    
    if (response.data && response.data.token) {
      // Store token and authentication status
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      }));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Remove authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    resolve();
  });
};

// Get current user
export const getCurrentUser = (): { name: string } | null => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString);
      return { name: user.name };
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Handle the authentication callback from SMART on FHIR OAuth
export const handleAuthCallback = async (code: string, state: string): Promise<void> => {
  // In a real implementation, this would:
  // 1. Validate the state parameter to prevent CSRF attacks
  // 2. Exchange the authorization code for access/refresh tokens
  // 3. Store the tokens securely for future API calls
  // 4. Fetch user information or FHIR resources as needed
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a successful auth flow
      localStorage.setItem('isAuthenticated', 'true');
      resolve();
    }, 1500);
  });
};

// Get auth token for API requests
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Create auth header with Bearer token
export const authHeader = (): { Authorization: string } | {} => {
  const token = getToken();
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  
  return {};
};
