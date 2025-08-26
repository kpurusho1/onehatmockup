import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthResponse, BackendAuthResponse, User, RefreshTokenResponse, GenericResponse } from '../types/api';
import { setAuthToken } from './pradhiApi';
import { setVhrAuthToken } from './vhrApi';

const BASE_URL = 'https://vhrbackend1-staging.up.railway.app';

// Storage keys - using only alphanumeric and allowed special chars for SecureStore
const TOKEN_KEY = 'OneHat_auth_token';
const REFRESH_TOKEN_KEY = 'OneHat_refresh_token';
const USER_KEY = 'OneHat_user_data';
const HOSPITAL_KEY = 'OneHat_selected_hospital';

// Token refresh interval in milliseconds (5 minutes before expiry)
const REFRESH_INTERVAL = 25 * 60 * 1000; // 25 minutes if token expires in 30 minutes

// Auth service
export const authService = {
  // Login with username and password
  login: async (username: string, password: string, hospital_id?: string | number): Promise<AuthResponse> => {
    try {
      // Ensure hospital_id is sent as a number (integer) as required by the API
      const hospitalIdInt = typeof hospital_id === 'string' ? parseInt(hospital_id, 10) : 
                          (hospital_id !== undefined ? hospital_id : 1); // Default to hospital_id 1 if not provided
      
      const payload = {
        username,
        password,
        hospital_id: hospitalIdInt
      };
      
      console.log('Login payload:', payload);
      
      const response = await axios.post(`${BASE_URL}/auth/login`, payload);
      
      // Handle the backend response format
      const backendData = response.data as BackendAuthResponse;
      
      // Transform to our internal AuthResponse format
      const authResponse: AuthResponse = {
        success: true, // If we got here without an error, it's successful
        token: backendData.access_token,
        refresh_token: backendData.refresh_token,
        user: {
          id: backendData.doctor_id,
          name: backendData.doctor_name,
          email: '', // Not provided in the response
          role: 'doctor',
          hospital_id: hospital_id?.toString(),
          onehat_doctor_id: backendData.onehat_doctor_id,
          specialty: backendData.specialty
        }
      };
      
      // Store tokens in SecureStore and user data in AsyncStorage
      await SecureStore.setItemAsync(TOKEN_KEY, authResponse.token);
      if (authResponse.refresh_token) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, authResponse.refresh_token);
      }
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
      
      // Set token for API requests
      setAuthToken(authResponse.token);
      // Also set token for VHR API
      setVhrAuthToken(authResponse.token);
      
      return authResponse;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract detailed error message if available
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      // Create a failed response
      const failedResponse: AuthResponse = {
        success: false,
        token: '',
        user: null,
        error: errorMessage
      };
      
      return failedResponse;
    }
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Get the token for the logout request
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      
      if (token) {
        // Make a logout request to the server to invalidate the token
        try {
          await axios.post(`${BASE_URL}/auth/logout`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (logoutError) {
          // If server logout fails, continue with local logout
          console.warn('Server logout failed, continuing with local logout', logoutError);
        }
      }
      
      // Clear stored data
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await AsyncStorage.multiRemove([USER_KEY, HOSPITAL_KEY]);
      
      // Remove auth header
      setAuthToken('');
      setVhrAuthToken('');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  // Refresh the access token using the refresh token
  refreshToken: async (): Promise<boolean> => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        console.error('No refresh token available');
        return false;
      }
      
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken
      });
      
      const data = response.data as RefreshTokenResponse;
      
      if (data.access_token) {
        // Update the stored tokens
        await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
        if (data.refresh_token) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);
        }
        
        // Update the auth headers
        setAuthToken(data.access_token);
        setVhrAuthToken(data.access_token);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  },
  
  // Get refresh token
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Get refresh token error:', error);
      return null;
    }
  },
  
  // Check if user is logged in
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },
  
  // Get current auth token
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },
  
  // Get current user data
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },
  
  // Set selected hospital
  setSelectedHospital: async (hospitalId: string, hospitalName: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(HOSPITAL_KEY, JSON.stringify({ id: hospitalId, name: hospitalName }));
    } catch (error) {
      console.error('Set hospital error:', error);
      throw error;
    }
  },
  
  // Get selected hospital
  getSelectedHospital: async () => {
    try {
      const hospitalData = await AsyncStorage.getItem(HOSPITAL_KEY);
      return hospitalData ? JSON.parse(hospitalData) : null;
    } catch (error) {
      console.error('Get hospital error:', error);
      return null;
    }
  },
  
  // Initialize auth state on app start
  initialize: async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        // Set token for API requests
        setAuthToken(token);
        setVhrAuthToken(token);
        
        // Set up automatic token refresh
        setTimeout(() => {
          authService.refreshToken().catch(error => {
            console.error('Auto token refresh failed:', error);
          });
        }, REFRESH_INTERVAL);
      } else {
        // Try to refresh token if access token is missing but refresh token exists
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const success = await authService.refreshToken();
          if (!success) {
            // If refresh fails, clear all auth data
            await authService.logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  },
  
// Sync doctor with OneHat
async syncDoctorWithOneHat(onehatDoctorId: number): Promise<GenericResponse> {
try {
const response = await axios.post(`${BASE_URL}/auth/sync-doctor/${onehatDoctorId}`, {}, {
headers: {
Authorization: `Bearer ${await this.getToken()}`
}
});
return response.data as GenericResponse;
}
catch (error) {
console.error('Error syncing doctor with OneHat:', error);
throw error;
}
}
};

export default authService;
