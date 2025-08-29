import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

import StorageUtil, { STORAGE_KEYS } from '../utils/storageUtil';
import navigationUtil from '../utils/navigationUtil';

// Base API configuration - loaded directly from .env file
// Using process.env for TypeScript compatibility
const API_BASE_URL = process.env.VITE_API_URL;

// Create axios instance with retry configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token and return a Promise that resolves with the modified config
    try {
      const token = await StorageUtil.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        // Make sure headers exists before setting Authorization
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

// Response interceptor for handling retries and 401 errors with user-friendly messages
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // First, handle retry logic for network/timeout errors
    const shouldRetry = !error.response && 
                       (error.code === 'ECONNABORTED' || 
                        error.message.includes('timeout') || 
                        error.message.includes('Network Error'));
    
    if (shouldRetry && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(`🔄 Retrying request to ${originalRequest.url} due to ${error.message}`);
      
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return apiClient(originalRequest);
    }
    
    // If error is 401, handle gracefully with user-friendly messaging
    // But exclude login requests and embedded-login requests - let them handle their own 401 errors
    if (error.response?.status === 401 && 
        !originalRequest.url?.includes('/auth/login') && 
        !originalRequest.url?.includes('/auth/embedded-login')) {
      
      // Check if we're in embedded mode - don't redirect to login in embedded mode
      const authMode = await StorageUtil.getSecureItem('authMode');
      // Handle URL params in a cross-platform way
      let isEmbeddedMode = authMode === 'embedded';
      
      // Only check URL params in web environment
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const refreshParam = urlParams.get('refresh');
        const dIdParam = urlParams.get('dId');
        isEmbeddedMode = isEmbeddedMode || (!!refreshParam && !!dIdParam);
      }
      
      if (isEmbeddedMode) {
        console.log('🔒 API Client: 401 error in embedded mode - letting embedded auth handle it');
        return Promise.reject(error);
      }
      
      console.log('🔒 API Client: 401 error detected - session expired or backend restarted');
      
      // Clear all session data
      await StorageUtil.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_ID);
      await StorageUtil.removeSecureItem('doctorName');
      await StorageUtil.removeSecureItem(STORAGE_KEYS.HOSPITAL_NAME);
      await StorageUtil.removeSecureItem('doctorSpecialty');
      await StorageUtil.removeSecureItem('sessionTimestamp');
      
      // Show user-friendly notification
      console.log('🔄 Redirecting to login due to session expiry...');
      
      // Create a user-friendly error message
      const userMessage = 'Your session has expired or the server was restarted. Please log in again to continue. Your data has been saved.';
      
      // Try to show a toast notification if available in web environment
      if (typeof window !== 'undefined') {
        interface ToastFunction {
          (options: { type: string; title: string; message: string; duration: number }): void;
        }
        
        const windowWithToast = window as { showToast?: ToastFunction };
        
        if (windowWithToast.showToast) {
          windowWithToast.showToast({
            type: 'warning',
            title: 'Session Expired',
            message: userMessage,
            duration: 4000
          });
        } else {
          // Fallback to alert if toast is not available and we're in a web environment
          if (typeof alert !== 'undefined') {
            alert(userMessage);
          }
        }
        
        // Redirect to login after a brief delay to let user see the message
        setTimeout(() => {
          navigationUtil.navigateToLogin();
        }, 4000);
      } else {
        // In React Native, just navigate immediately
        navigationUtil.navigateToLogin();
      }
      
      return Promise.reject(new Error(userMessage));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
