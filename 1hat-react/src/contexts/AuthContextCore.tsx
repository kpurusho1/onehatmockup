import { createContext } from 'react';
import { AuthResponse } from '../services/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hospital_id?: string;
  onehat_doctor_id?: number;
  specialty?: string;
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

// Create the context with undefined as default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
