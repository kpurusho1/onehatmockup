import apiClient from './apiClient';
import StorageUtil, { STORAGE_KEYS } from '../utils/storageUtil';
import navigationUtil from '../utils/navigationUtil';
import { UUID } from 'crypto';

// Helper function to check if an object has default_dispatch_sections property
function hasDefaultDispatchSections(obj: unknown): obj is { default_dispatch_sections: string[] } {
  return !!obj && typeof obj === 'object' && 'default_dispatch_sections' in obj && 
    Array.isArray((obj as Record<string, unknown>).default_dispatch_sections);
}

export interface Hospital {
  id: number;
  name: string;
}

export interface HospitalResponse {
  hospitals: Hospital[];
  total_count: number;
}

export interface User {
  id: UUID;
  name: string;
  email: string;
  role: string;
  hospital_id: string;
  onehat_doctor_id: number;
  specialty?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  doctor_id: UUID;
  doctor_name: string;
  hospital_name: string;
  specialty: string;
  onehat_doctor_id: number;
}


/**
 * AuthService handles authentication-related API calls
 */
const AuthService = {
  /**
   * Get list of available hospitals
   * @returns Promise with list of hospitals
   */
  getHospitals: async (): Promise<Hospital[]> => {
    try {
      console.log('Fetching hospitals from API...');
      const response = await apiClient.get<HospitalResponse>('/hospitals');
      console.log('Hospitals API response:', response.data);
      
      // Handle different response formats from backend
      let hospitals: Hospital[] = [];
      if (response.data && typeof response.data === 'object' && 'hospitals' in response.data && 
          Array.isArray(response.data.hospitals)) {
        hospitals = response.data.hospitals || [];
      } else if (Array.isArray(response.data)) {
        hospitals = response.data;
      } else {
        console.warn('Unexpected hospitals response format:', response.data);
        hospitals = [];
      }
      
      console.log('Extracted hospitals:', hospitals);
      
      // Ensure hospitals have required fields
      const validHospitals = hospitals
        .filter((h: Partial<Hospital>): h is Hospital => 
          typeof h.id === 'number' && 
          typeof h.name === 'string')
        .map((h: Hospital) => ({
          id: h.id,
          name: h.name
        }));
      
      if (validHospitals.length === 0) {
        console.warn('No valid hospitals found, using fallback data');
        return [
          { id: 445, name: 'Guruji mock Hospital' },
        ];
      }
      else {
        return validHospitals;
      }
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
          errorMessage = String(error.response.data);
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }
      console.error('Error fetching hospitals:', errorMessage);
      
      // Fallback to test data if API fails
      console.log('Using fallback hospital data due to error');
      return [
        { id: 445, name: 'Guruji mock Hospital' }
      ];
    }
  },

  /**
   * Login with username and password
   * @param username Username
   * @param password Password
   * @param hospitalId Hospital ID
   * @returns Promise with authentication tokens and user info
   */
  login: async (
    username: string,
    password: string,
    hospitalId: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      username,
      password,
      hospital_id: hospitalId,
    });

    // Store authentication data using StorageUtil
    await StorageUtil.setSecureItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
    await StorageUtil.setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
    await StorageUtil.setSecureItem(STORAGE_KEYS.DOCTOR_ID, response.data.doctor_id);
    await StorageUtil.setSecureItem(STORAGE_KEYS.DOCTOR_NAME, response.data.doctor_name);
    await StorageUtil.setSecureItem(STORAGE_KEYS.HOSPITAL_NAME, response.data.hospital_name);
    await StorageUtil.setSecureItem(STORAGE_KEYS.DOCTOR_SPECIALTY, response.data.specialty || 'General Medicine');
    await StorageUtil.setSecureItem(STORAGE_KEYS.ONEHAT_DOCTOR_ID, response.data.onehat_doctor_id.toString());
    await StorageUtil.setSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now().toString());
    
    const user: User = {
      id: response.data.doctor_id,
      name: response.data.doctor_name,
      email: '',
      role: 'doctor',
      hospital_id: hospitalId,
      onehat_doctor_id: response.data.onehat_doctor_id,
      specialty: response.data.specialty
    };
    await StorageUtil.setSecureItem(STORAGE_KEYS.USER, JSON.stringify(user));
    // Fetch and cache segment preferences for efficient access
    try {
      // Use service role endpoint - requires explicit doctor_id parameter
      const preferencesResponse = await apiClient.get('/settings/preferences', {
        params: { doctor_id: response.data.doctor_id }
      });
      const backendResponse = preferencesResponse.data || {};
      // Use type guard to safely access the property
      const defaultSegments = hasDefaultDispatchSections(backendResponse) ? backendResponse.default_dispatch_sections : [];
      
      // Convert array to object format for frontend use
      console.log('🔍 AuthService: Backend returned default_dispatch_sections:', defaultSegments);
      console.log('🔍 AuthService: Checking for "Key Facts" in array:', defaultSegments.includes('Key Facts'));
      const segmentObject = {
        patientDetails: defaultSegments.includes('Patient Details'),
        hospitalDetails: defaultSegments.includes('Hospital/Doctor Details'),
        chiefComplaints: defaultSegments.includes('Key Facts'), // Fixed: Use "Key Facts" instead of "Chief Complaint(s)"
        associatedSymptoms: defaultSegments.includes('Associated Symptoms'),
        presentIllness: defaultSegments.includes('Present Illness Information'),
        pastMedicalHistory: defaultSegments.includes('Past Medical History'),
        doctorsObservations: defaultSegments.includes('Doctor\'s Observations'),
        preliminaryAssessment: defaultSegments.includes('Preliminary Assessment'),
        treatmentPlan: defaultSegments.includes('Treatment Plan'),
        prescriptionData: defaultSegments.includes('Prescription Data'),
        nextSteps: defaultSegments.includes('Next Steps'),
        referralDetails: defaultSegments.includes('Referral Details'),
        doctorsNotes: defaultSegments.includes('Doctor\'s Notes'),
        // Legacy fields for backward compatibility
        prescription: defaultSegments.includes('Prescription Data'),
        diagnosis: defaultSegments.includes('Preliminary Assessment'),
        summary: defaultSegments.includes('Doctor\'s Notes'),
        followUp: defaultSegments.includes('Next Steps')
      };
      
      // Cache segment preferences in StorageUtil
      await StorageUtil.setPersistentItem('dispatchSegmentPreferences', JSON.stringify(segmentObject));
      console.log('💾 AuthService: Stored segment preferences in StorageUtil:', segmentObject);
    } catch (error) {
      // Don't fail login if segment preferences fetch fails
    }
    
    return response.data;
  },




  /**
   * Check if user is logged in
   * @returns Boolean indicating if user is logged in
   */
  isLoggedIn: async (): Promise<boolean> => {
    const token = await StorageUtil.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      // Stop periodic authentication checks
      AuthService.stopPeriodicAuthCheck();
      
      // Call API to invalidate tokens
      await apiClient.post('/auth/logout');
      
      // Clean up storage (including embedded mode specific items)
      await StorageUtil.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_ID);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_NAME);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.HOSPITAL_NAME);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_SPECIALTY);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.ONEHAT_DOCTOR_ID);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DISPATCH_SEGMENT_PREFERENCES);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.WAS_AUTHENTICATED);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.ONEHAT_REFRESH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.AUTH_MODE);
      
      // Use navigationUtil instead of direct window.location manipulation
      // Let React Router/React Navigation handle navigation naturally
    } catch (error) {
      console.error('Error during logout:', error);
      // Still stop periodic checks even if logout API fails
      AuthService.stopPeriodicAuthCheck();
    }
  },
  isAuthenticatedSafe: async (): Promise<boolean> => {
    const token = await StorageUtil.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
    const sessionTimestamp = await StorageUtil.getSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP);
    
    if (!token) return false;
    
    // Check session timeout (4 hours)
    const SESSION_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    if (sessionTimestamp) {
      const sessionAge = Date.now() - parseInt(sessionTimestamp);
      if (sessionAge > SESSION_TIMEOUT) {
        return false; // Don't clear storage, just return false
      }
    } else {
      return false; // No session timestamp, treat as expired but don't clear
    }
    
    // Parse JWT token expiration (if it's a proper JWT)
    try {
      // Check if token has proper JWT format
      if (token.split('.').length !== 3) {
        return false; // Invalid JWT format but don't clear storage
      }
      
      // Parse payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token has expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false; // Token expired but don't clear storage
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false; // Can't validate token but don't clear storage
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    console.log('🔍 AuthService.isAuthenticated() - Starting authentication check');
    const token = await StorageUtil.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
    const sessionTimestamp = await StorageUtil.getSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP);
    
    console.log('🔍 AuthService.isAuthenticated() - Token exists:', !!token);
    console.log('🔍 AuthService.isAuthenticated() - Session timestamp:', sessionTimestamp);
    
    if (!token) {
      console.log('❌ AuthService.isAuthenticated() - No token found, returning false');
      return false;
    }
    
    // Check session timeout (4 hours)
    const SESSION_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    if (sessionTimestamp) {
      const sessionAge = Date.now() - parseInt(sessionTimestamp);
      console.log('🔍 AuthService.isAuthenticated() - Session age:', sessionAge, 'ms, timeout:', SESSION_TIMEOUT, 'ms');
      if (sessionAge > SESSION_TIMEOUT) {
        console.log('❌ AuthService.isAuthenticated() - Session expired, clearing data');
        // Session expired - clear data but don't call logout() to avoid history manipulation
        await StorageUtil.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_ID);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_NAME);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.HOSPITAL_NAME);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_SPECIALTY);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DISPATCH_SEGMENT_PREFERENCES);
        return false;
      }
    } else {
      console.log('❌ AuthService.isAuthenticated() - No session timestamp, treating as expired');
      // No session timestamp, treat as expired - clear data but don't call logout()
      await StorageUtil.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_ID);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_NAME);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.HOSPITAL_NAME);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_SPECIALTY);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DISPATCH_SEGMENT_PREFERENCES);
      return false;
    }
    
    // Parse JWT token expiration (if it's a proper JWT)
    try {
      console.log('🔍 AuthService.isAuthenticated() - Validating JWT token format');
      // Check if token has proper JWT format
      if (token.split('.').length !== 3) {
        console.log('❌ AuthService.isAuthenticated() - Invalid JWT format, clearing data');
        // Invalid JWT format - clear data but don't call logout()
        await StorageUtil.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_ID);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_NAME);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.HOSPITAL_NAME);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_SPECIALTY);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DISPATCH_SEGMENT_PREFERENCES);
        return false;
      }
      
      // Parse payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 AuthService.isAuthenticated() - JWT payload parsed, exp:', payload.exp);
      
      // Check if token has expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        console.log('❌ AuthService.isAuthenticated() - JWT token expired, clearing data');
        // Token expired - clear data but don't call logout()
        await StorageUtil.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_ID);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_NAME);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.HOSPITAL_NAME);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_SPECIALTY);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        await StorageUtil.removeSecureItem(STORAGE_KEYS.DISPATCH_SEGMENT_PREFERENCES);
        return false;
      }
      
      // Update session timestamp to extend session
      await StorageUtil.setSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now().toString());
      console.log('✅ AuthService.isAuthenticated() - Token valid, session extended, returning true');
      
      return true;
    } catch (error) {
      console.error('❌ AuthService.isAuthenticated() - Error validating token:', error);
      // If we can't validate the token structure, clear it but don't call logout()
      await StorageUtil.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_ID);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_NAME);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.HOSPITAL_NAME);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DOCTOR_SPECIALTY);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.SESSION_TIMESTAMP);
      await StorageUtil.removeSecureItem(STORAGE_KEYS.DISPATCH_SEGMENT_PREFERENCES);
      return false;
    }
  },

  /**
   * Start periodic authentication checks and token refresh
   * This ensures tokens are refreshed proactively and sessions remain valid
   */
  startPeriodicAuthCheck: (): void => {
    // Define a type for the window with our custom property
    interface WindowWithAuthCheck extends Window {
      authCheckInterval?: ReturnType<typeof setInterval>;
    }
    
    // Clear any existing interval
    const typedWindow = window as WindowWithAuthCheck;
    if (typedWindow.authCheckInterval) {
      clearInterval(typedWindow.authCheckInterval);
    }
    
    // Set up periodic auth check every 30 minutes
    typedWindow.authCheckInterval = setInterval(async () => {
      const isAuth = await AuthService.isAuthenticated();
      if (isAuth) {
        // Note: Token refresh functionality removed as endpoints not documented
        console.log('🔄 Periodic auth check - token refresh not available');
      }
    }, 30 * 60 * 1000); // 30 minutes
    
    console.log('🔄 Started periodic authentication checks (30min intervals)');
  },

  /**
   * Stop periodic authentication checks
   */
  stopPeriodicAuthCheck: (): void => {
    interface WindowWithAuthCheck extends Window {
      authCheckInterval?: ReturnType<typeof setInterval>;
    }
    
    const typedWindow = window as WindowWithAuthCheck;
    if (typedWindow.authCheckInterval) {
      clearInterval(typedWindow.authCheckInterval);
      delete typedWindow.authCheckInterval;
      console.log('🛑 Stopped periodic authentication checks');
    }
  },

  /**
   * Get current user info
   * @returns User info object or null if not authenticated
   */
  getCurrentUser: async () => {
    const userJson = await StorageUtil.getSecureItem('user');
    console.log('User data:', userJson);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  },

  /**
   * Get dispatch segment preferences from StorageUtil
   * @returns Dispatch segment preferences object
   */
  getDispatchSegmentPreferences: async (): Promise<Record<string, boolean>> => {
    const preferences = await StorageUtil.getPersistentItem('dispatchSegmentPreferences');
    return preferences ? JSON.parse(preferences) : {};
  },

  /**
   * Clear dispatch segment preferences cache
   */
  clearDispatchSegmentPreferences: async (): Promise<void> => {
    console.log('🗑️ AuthService: Clearing dispatch segment preferences cache');
    await StorageUtil.removePersistentItem('dispatchSegmentPreferences');
  },

  /**
   * Get OneHat doctor ID from session storage
   * @returns OneHat doctor ID or null if not found
   */
  getOnehatDoctorId: async (): Promise<string | null> => {
    return await StorageUtil.getSecureItem(STORAGE_KEYS.ONEHAT_DOCTOR_ID);
  },

  /**
   * Get the current authentication token
   * @returns Current authentication token or null if not found
   */
  getToken: async (): Promise<string | null> => {
    return await StorageUtil.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get the selected hospital information
   * @returns Hospital object with id and name or null if not found
   */
  getSelectedHospital: async (): Promise<{ id: string; name: string } | null> => {
    const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
    const hospitalName = await StorageUtil.getSecureItem(STORAGE_KEYS.HOSPITAL_NAME);
    
    if (!doctorId || !hospitalName) return null;
    
    return {
      id: doctorId, // Using doctor_id as a fallback for hospital_id
      name: hospitalName
    };
  },

  /**
   * Set the selected hospital information
   * @param hospitalId Hospital ID
   * @param hospitalName Hospital name
   */
  setSelectedHospital: async (hospitalId: string, hospitalName: string): Promise<void> => {
    await StorageUtil.setSecureItem(STORAGE_KEYS.HOSPITAL_ID, hospitalId);
    await StorageUtil.setSecureItem(STORAGE_KEYS.HOSPITAL_NAME, hospitalName);
  }
};

export default AuthService;
