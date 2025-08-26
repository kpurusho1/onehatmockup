import React from 'react';
import { ThemeProvider } from './src/theme/ThemeProvider';

// Import navigation
import AppNavigator from './src/navigation/AppNavigator';

// Import auth provider
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
