import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Determine if we're running in a web or native environment
const isWeb = typeof document !== 'undefined';

/**
 * Cross-platform storage utility that works in both web and React Native environments
 * Uses sessionStorage/localStorage in web and SecureStore/AsyncStorage in React Native
 */
const StorageUtil = {
  /**
   * Set a secure item (tokens, passwords)
   * Uses SecureStore in native, sessionStorage in web
   */
  async setSecureItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      sessionStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  /**
   * Get a secure item
   * Uses SecureStore in native, sessionStorage in web
   */
  async getSecureItem(key: string): Promise<string | null> {
    if (isWeb) {
      return sessionStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  /**
   * Delete a secure item
   * Uses SecureStore in native, sessionStorage in web
   */
  async removeSecureItem(key: string): Promise<void> {
    if (isWeb) {
      sessionStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },

  /**
   * Set a persistent item (user preferences, non-sensitive data)
   * Uses AsyncStorage in native, localStorage in web
   */
  async setPersistentItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  /**
   * Get a persistent item
   * Uses AsyncStorage in native, localStorage in web
   */
  async getPersistentItem(key: string): Promise<string | null> {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  /**
   * Delete a persistent item
   * Uses AsyncStorage in native, localStorage in web
   */
  async removePersistentItem(key: string): Promise<void> {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },

  /**
   * Clear all secure storage
   */
  async clearSecureStorage(): Promise<void> {
    if (isWeb) {
      sessionStorage.clear();
    } else {
      // SecureStore doesn't have a clear method, would need to clear individual keys
      // This is a limitation, but in practice we'd only clear specific keys anyway
    }
  },

  /**
   * Clear all persistent storage
   */
  async clearPersistentStorage(): Promise<void> {
    if (isWeb) {
      localStorage.clear();
    } else {
      await AsyncStorage.clear();
    }
  }
};

// Common storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  DOCTOR_ID: 'doctorId',
  DOCTOR_NAME: 'doctorName',
  HOSPITAL_NAME: 'hospitalName',
  DOCTOR_SPECIALTY: 'doctorSpecialty',
  ONEHAT_DOCTOR_ID: 'onehatDoctorId',
  SESSION_TIMESTAMP: 'sessionTimestamp',
  DISPATCH_SEGMENT_PREFERENCES: 'dispatchSegmentPreferences',
  WAS_AUTHENTICATED: 'wasAuthenticated',
  ONEHAT_REFRESH_TOKEN: 'onehatRefreshToken',
  HOSPITAL_ID: 'hospitalId',
  USER: 'user',
  AUTH_MODE: 'authMode'
};

export default StorageUtil;
