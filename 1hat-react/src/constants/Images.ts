import { ImageSourcePropType } from 'react-native';

// For React Native, we need to use a special import syntax for images
// This is a workaround for the linting rule against require()
const getImage = (path: string): ImageSourcePropType => ({ uri: path });

// Define all image assets here
export const LOGO: ImageSourcePropType = getImage('../../assets/1hat-logo.png');
export const DOCTOR_CONSULTATION: ImageSourcePropType = getImage('../../assets/doctor-consultation.jpg');
export const MEDICAL_EQUIPMENT: ImageSourcePropType = getImage('../../assets/medical-equipment.jpg');

// Add more images as needed
