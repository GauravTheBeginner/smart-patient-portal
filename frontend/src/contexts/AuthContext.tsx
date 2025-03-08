
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, logout, isUserAuthenticated, getCurrentUser, signup } from '@/utils/auth';
import { toast } from "sonner";

type User = {
  name: string;
} | null;

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuthStatus = () => {
      const authStatus = isUserAuthenticated();
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        // Get user data from localStorage
        const userData = getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    checkAuthStatus();
    
    // Set up event listener for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated' || e.key === 'user') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const success = await login(email, password);
      
      if (success) {
        setIsAuthenticated(true);
        const userData = getCurrentUser();
        setUser(userData);
        toast.success('Signed in successfully');
      } else {
        toast.error('Invalid credentials');
      }
      
      return success;
    } catch (error) {
      toast.error('There was a problem signing you in.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await signup(name, email, password);
      
      if (response) {
        setIsAuthenticated(true);
        setUser({ name: response.name });
        toast.success('Account created successfully');
        return true;
      } else {
        toast.error('Failed to create account');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create account';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await logout();
      setIsAuthenticated(false);
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('There was a problem signing you out.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
