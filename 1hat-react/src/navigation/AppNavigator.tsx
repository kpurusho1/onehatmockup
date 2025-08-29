import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Create a separate component that uses the auth context
const AuthenticatedNavigator = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brandTeal} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth screens
          <Stack.Screen name="Login">
            {(props: NativeStackScreenProps<RootStackParamList, 'Login'>) => (
              <LoginScreen 
                {...props} 
                onLoginSuccess={() => {}} // Auth context handles the state
              />
            )}
          </Stack.Screen>
        ) : (
          // App screens
          <Stack.Screen name="Main">
            {(props: NativeStackScreenProps<RootStackParamList, 'Main'>) => (
              <BottomTabNavigator 
                {...props} 
                onLogout={logout}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main AppNavigator component that doesn't use auth context
const AppNavigator = () => {
  return <AuthenticatedNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;
