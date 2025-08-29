import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient';
import pradhiRecorder from '../services/pradhiService';
import { UUID } from 'crypto';

// Types
interface User {
  id: UUID;
  name: string;
  email: string;
  role: string;
  hospital_id: string;
  onehat_doctor_id: number;
  specialty?: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  doctor_id: UUID | null;
  doctor_name: string;
  onehat_doctor_id: number;
  specialty?: string;
  hospital_name?: string;
}

export interface AuthContextType {
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

// Create the context with undefined as default
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [doctorId, setDoctorId] = useState<UUID | null>(null);
  const [hospital, setHospitalState] = useState<{ id: string; name: string } | null>(null);

  // Helper functions to set auth tokens for API clients
  const setAuthToken = (token: string) => {
    // apiClient already handles token via interceptor, no need to set it manually
    console.log('Auth token updated for API client');
  };
  
  const setVhrAuthToken = (token: string) => {
    // Set token for VHR API if needed
    console.log('Auth token updated for VHR API client');
  };

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 AuthContext.initializeAuth() - Starting authentication initialization');
      try {
        // Check if user is authenticated or can be re-authenticated with refresh token
        console.log('🔍 AuthContext.initializeAuth() - Checking if user is authenticated');
        const authenticated = await authService.isAuthenticated();
        console.log('🔍 AuthContext.initializeAuth() - Authentication check result:', authenticated);
        
        if (!authenticated) {
          console.log('❌ AuthContext.initializeAuth() - Not authenticated, no token refresh available');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        console.log('✅ AuthContext.initializeAuth() - User is authenticated, setting up session');
        setIsAuthenticated(true);
        
        // Get token and set it for API requests
        console.log('🔑 AuthContext.initializeAuth() - Getting token for API requests');
        const token = await authService.getToken();
        if (token) {
          console.log('🔑 AuthContext.initializeAuth() - Token found, setting for API clients');
          setAuthToken(token);
          setVhrAuthToken(token);
          
          // Set token for pradhiRecorder if needed
          // Note: pradhiRecorder might handle token differently
        } else {
          console.log('⚠️ AuthContext.initializeAuth() - No token found despite being authenticated');
        }

        // Get user data
        console.log('👤 AuthContext.initializeAuth() - Getting user data');
        const userData = await authService.getCurrentUser();
        console.log('👤 AuthContext.initializeAuth() - User data:', userData);
        setUser(userData);
        
        // Set doctor ID if available
        if (userData?.id) {
          console.log('👨‍⚕️ AuthContext.initializeAuth() - Setting doctor ID:', userData.id);
          setDoctorId(userData.id);
        }

        // Get selected hospital
        console.log('🏥 AuthContext.initializeAuth() - Getting selected hospital');
        const hospitalData = await authService.getSelectedHospital();
        console.log('🏥 AuthContext.initializeAuth() - Hospital data:', hospitalData);
        setHospitalState(hospitalData);
        
        console.log('✅ AuthContext.initializeAuth() - Initialization complete, user authenticated');
      } catch (error) {
        console.error('❌ AuthContext.initializeAuth() - Error initializing auth:', error);
        setIsAuthenticated(false);
      } finally {
        console.log('🏁 AuthContext.initializeAuth() - Setting loading to false');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string, hospital_id?: string | number): Promise<AuthResponse> => {
    console.log('🔐 AuthContext.login() - Starting login process for user:', username, 'hospital:', hospital_id);
    try {
      // Ensure hospital_id is converted to string or use a default value if undefined
      const hospitalIdString = hospital_id !== undefined ? String(hospital_id) : '';
      console.log('🔐 AuthContext.login() - Calling authService.login()');
      const response = await authService.login(username, password, hospitalIdString);
      console.log('🔐 AuthContext.login() - Login API response received:', { ...response, access_token: response.access_token ? '***' : null });
      
      // If we get here, the login was successful
      console.log('✅ AuthContext.login() - Login successful, setting authenticated state');
      setIsAuthenticated(true);
      
      // Create a user object from the response
      const userData: User = {
        id: response.doctor_id,
        name: response.doctor_name,
        email: '', // Email might not be available in the response
        role: 'doctor',
        hospital_id: hospitalIdString,
        onehat_doctor_id: response.onehat_doctor_id,
        specialty: response.specialty
      };
      
      console.log('👤 AuthContext.login() - Setting user data:', userData);
      setUser(userData);
      
      // Set doctor ID
      console.log('👨‍⚕️ AuthContext.login() - Setting doctor ID:', response.doctor_id);
      setDoctorId(response.doctor_id);
      
      
      // Store doctor ID in AsyncStorage for API calls
      await AsyncStorage.setItem('doctorId', response.doctor_id);
      
      // Set token for API requests
      if (response.access_token) {
        console.log('🔑 AuthContext.login() - Setting tokens for API clients');
        setAuthToken(response.access_token);
        setVhrAuthToken(response.access_token);
      } else {
        console.log('⚠️ AuthContext.login() - No access token in response');
      }
      
      console.log('✅ AuthContext.login() - Login process completed successfully');
      return response;
    } catch (error) {
      console.error('❌ AuthContext.login() - Login error:', error);
      console.log('❌ AuthContext.login() - Resetting authentication state due to error');
      setIsAuthenticated(false);
      setUser(null);
      setDoctorId(null);
      
      // Create a minimal AuthResponse object to satisfy the return type
      return {
        access_token: '',
        refresh_token: '',
        token_type: '',
        expires_in: 0,
        doctor_id: null,
        doctor_name: '',
        hospital_name: '',
        specialty: '',
        onehat_doctor_id: 0
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
      // Note: Token refresh functionality not available as endpoints not documented
      console.log('⚠️ AuthContext.refreshUserSession() - Token refresh not available');
      return false;
    } catch (error) {
      console.error('Error in refreshUserSession:', error);
      return false;
    }
  };

  const contextValue = {
    isAuthenticated,
    isLoading,
    user,
    doctorId,
    hospital,
    login,
    logout,
    setHospital,
    refreshUserSession,
  };


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

