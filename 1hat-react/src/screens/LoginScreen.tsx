import React, { useState, useEffect } from 'react';
import { LOGO } from '../assets/images';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import CustomDropdown, { DropdownOption } from '../components/CustomDropdown';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../services/authService';

// Extended colors with missing properties
const extendedColors = {
  ...colors,
  textPrimary: colors.foreground,
  textSecondary: colors.mutedForeground,
  inputBackground: colors.background,
  inputIconBackground: colors.muted,
  error: colors.destructive,
  form: {}
};

interface LoginScreenProps {
  onLogin?: (username: string, password: string, hospitalId: string) => Promise<void>;
  onLoginSuccess?: () => void;
}

// Define styles at the top level
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    height: 80,
    width: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: extendedColors.textSecondary,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: extendedColors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: extendedColors.inputBackground,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: extendedColors.textPrimary,
  },
  iconContainer: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: extendedColors.inputIconBackground,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  iconText: {
    fontSize: 20,
  },
  showPasswordButton: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.muted,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  successText: {
    color: colors.success,
  },
  errorText: {
    color: colors.destructive,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
  },
  loadingText: {
    marginLeft: 10,
    color: extendedColors.textSecondary,
    fontSize: 14,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: colors.brandNavy,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  supportEmail: {
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  form: {
    width: '100%',
  },
  inputIcon: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: extendedColors.inputIconBackground,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  passwordToggle: {
    padding: 10,
  },
});

const LoginScreen = ({ onLogin, onLoginSuccess }: LoginScreenProps = {}) => {
  const { login, setHospital } = useAuth();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    hospital: '', // Will be set after hospitals are loaded
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableHospitals, setAvailableHospitals] = useState<DropdownOption[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear authentication and fetch hospitals from API
  useEffect(() => {
    // Clear any existing authentication when user lands on login page
    console.log('Login page accessed - clearing existing authentication');
    AuthService.logout();
    
    const fetchHospitals = async () => {
      try {
        setIsLoadingHospitals(true);
        setError(null);
        console.log('Fetching hospitals from API...');
        const hospitals = await AuthService.getHospitals();
        console.log('Hospitals API response:', hospitals);

        if (hospitals && hospitals.length > 0) {
          // Transform hospital data to dropdown format
          const hospitalOptions = hospitals.map((hospital) => ({
            label: hospital.name,
            value: String(hospital.id),
          }));
          console.log('Hospital options:', hospitalOptions);
          setAvailableHospitals(hospitalOptions);
          
          // Set default hospital to first one in the list
          if (hospitalOptions.length > 0) {
            setCredentials(prev => ({
              ...prev,
              hospital: hospitalOptions[0].value
            }));
          }
        } else {
          console.warn('No hospitals returned from API or success is false');
          setError('Failed to load hospitals. Please try again later.');
        }
      } catch (error: unknown) {
        console.error('Error fetching hospitals:', error);
        // Try to provide more detailed error information
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: unknown; status: number } };
          console.error('Error response:', axiosError.response.data);
          console.error('Status code:', axiosError.response.status);
        }
        setError('Failed to load hospitals. Please try again later.');
      } finally {
        setIsLoadingHospitals(false);
      }
    };
    
    fetchHospitals();
  }, []);
  

  const handleLogin = async () => {
    const { username, password, hospital } = credentials;
    
    setError(null);
    setValidationError(null);
    setLoginStatus('');
    
    // Frontend validation - check if all fields are filled
    if (!username.trim() || !password.trim() || !hospital.trim()) {
      setValidationError('Enter All Details');
      return;
    }

    setIsLoading(true);
    
    try {
      if (onLogin) {
        // Use the callback pattern like the web version
        await onLogin(username, password, hospital);
        // Don't reset isLoading here - let the parent handle it when navigation completes
      } else {
        // Direct login without callback - use AuthContext login function
        console.log('Attempting login with:', { username, password: '***', hospitalId: hospital });
        const result = await login(username, password, hospital);
        console.log('Login result:', { ...result, access_token: result.access_token ? '***' : null });
        
        if (result && result.access_token) {
          // Set selected hospital
          const hospitalName = result.hospital_name || 'Unknown Hospital';
          console.log('Setting selected hospital:', { id: hospital, name: hospitalName });
          setHospital(hospital, hospitalName);
          
          setLoginStatus('Login successful! Redirecting...');
          
          // Call onLoginSuccess if provided
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess();
            }
          }, 1500);
        } else {
          const errorMessage = 'Authentication failed. Please check your credentials.';
          console.error('Login failed:', errorMessage);
          setError(errorMessage);
        }
        setIsLoading(false);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError('login failed, try again');
      setIsLoading(false);
      
      // Refresh the login page after showing error (like web version)
      setTimeout(() => {
        // In React Native, we can't reload the page, but we can reset the form
        setCredentials({ username: '', password: '', hospital: '' });
        setError(null);
        setValidationError(null);
        setLoginStatus('');
      }, 2000); // Show error for 2 seconds before resetting
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={LOGO} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to 1hat</Text>
          <Text style={styles.subtitle}>Sign in to your doctor account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>👤</Text>
              </View>
              <TextInput
                style={styles.input}
                value={credentials.username}
                onChangeText={(text) => setCredentials({...credentials, username: text})}
                placeholder="Enter your username"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>🔒</Text>
              </View>
              <TextInput
                style={styles.input}
                value={credentials.password}
                onChangeText={(text) => setCredentials({...credentials, password: text})}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.iconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hospital</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>🏥</Text>
              </View>
              {isLoadingHospitals ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.loadingText}>Loading hospitals...</Text>
                </View>
              ) : (
                <CustomDropdown
                  options={availableHospitals}
                  selectedValue={credentials.hospital}
                  onValueChange={(value) => setCredentials({...credentials, hospital: value})}
                />
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.primaryForeground} size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {(loginStatus || error || validationError) ? (
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, loginStatus.includes('successful') ? styles.successText : styles.errorText]}>
                {loginStatus || error || validationError}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact support at{' '}
            <Text style={styles.supportEmail}>support@1hat.in</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
