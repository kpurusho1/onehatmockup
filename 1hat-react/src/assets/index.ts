// This file exports all assets with proper typing
import { ImageSourcePropType } from 'react-native';

// Define image assets with proper typing
// The images object pattern avoids direct require() calls in components
export const images = {
  logo: { uri: '../../assets/1hat-logo.png' } as ImageSourcePropType,
  doctorConsultation: { uri: '../../assets/doctor-consultation.jpg' } as ImageSourcePropType,
  medicalEquipment: { uri: '../../assets/medical-equipment.jpg' } as ImageSourcePropType,
};
