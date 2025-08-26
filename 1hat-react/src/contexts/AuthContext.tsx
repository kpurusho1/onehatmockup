import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import authService from '../services/authService';
import { AuthResponse, User } from '../types/api';
import { setAuthToken } from '../services/pradhiApi';
import { setVhrAuthToken } from '../services/vhrApi';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  doctorId: string | null;
  hospital: { id: string; name: string } | null;
  login: (username: string, password: string, hospital_id?: string | number) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  setHospital: (hospitalId: string, hospitalName: string) => Promise<void>;
  refreshUserSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [hospital, setHospitalState] = useState<{ id: string; name: string } | null>(null);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated or can be re-authenticated with refresh token
        const authenticated = await authService.isAuthenticated();
        
        if (!authenticated) {
          // Try to refresh the token if we have a refresh token
          const refreshed = await authService.refreshToken();
          if (!refreshed) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
        }
        
        setIsAuthenticated(true);
        
        // Get token and set it for API requests
        const token = await authService.getToken();
        if (token) {
          setAuthToken(token);
          setVhrAuthToken(token);
        }

        // Get user data
        const userData = await authService.getCurrentUser();
        setUser(userData);
        
        // Set doctor ID if available
        if (userData?.onehat_doctor_id) {
          setDoctorId(userData.onehat_doctor_id);
        }

        // Get selected hospital
        const hospitalData = await authService.getSelectedHospital();
        setHospitalState(hospitalData);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string, hospital_id?: string | number): Promise<AuthResponse> => {
    try {
      const response = await authService.login(username, password, hospital_id);
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        
        // Set doctor ID if available
        if (response.user?.onehat_doctor_id) {
          setDoctorId(String(response.user.onehat_doctor_id));
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setDoctorId(null);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        token: '',
        refresh_token: '',
        user: null,
        error: 'An unexpected error occurred during login.'
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setDoctorId(null);
      setHospitalState(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Set hospital function
  const setHospital = async (hospitalId: string, hospitalName: string): Promise<void> => {
    try {
      await authService.setSelectedHospital(hospitalId, hospitalName);
      setHospitalState({ id: hospitalId, name: hospitalName });
    } catch (error) {
      console.error('Set hospital error:', error);
    }
  };
  
  // Refresh user session
  const refreshUserSession = async (): Promise<boolean> => {
    try {
      const refreshed = await authService.refreshToken();
      
      if (refreshed) {
        // Update token for API requests
        const token = await authService.getToken();
        if (token) {
          setAuthToken(token);
          setVhrAuthToken(token);
        }
        
        // Get updated user data
        const userData = await authService.getCurrentUser();
        setUser(userData);
        
        // Update doctor ID if available
        if (userData?.onehat_doctor_id) {
          setDoctorId(userData.onehat_doctor_id);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        doctorId,
        hospital,
        login,
        logout,
        setHospital,
        refreshUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
