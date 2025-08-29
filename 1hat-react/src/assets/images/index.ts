// This file exports all image assets with proper typing for React Native
import { ImageSourcePropType } from 'react-native';

// Define a type-safe image getter that avoids direct require() calls in components
const getImage = (path: string): ImageSourcePropType => {
  // This is a workaround to avoid direct require() calls in components
  // The actual image loading happens here, isolated from the components
  switch (path) {
    case 'logo':
      return { uri: 'https://1hat.in/logo.png' };
    case 'doctor-consultation':
      return { uri: 'https://1hat.in/doctor-consultation.jpg' };
    case 'medical-equipment':
      return { uri: 'https://1hat.in/medical-equipment.jpg' };
    default:
      return { uri: '' };
  }
};

// Export named constants for all images
export const LOGO = getImage('logo');
export const DOCTOR_CONSULTATION = getImage('doctor-consultation');
export const MEDICAL_EQUIPMENT = getImage('medical-equipment');
