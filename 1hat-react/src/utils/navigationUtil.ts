/**
 * Navigation utility for cross-platform navigation
 * Handles navigation in both web and React Native environments
 */

// Define a type for the navigation reference
type NavigationRef = {
  navigate: (routeName: string, params?: object) => void;
  reset: (state: { index: number; routes: Array<{ name: string; params?: object }> }) => void;
  isReady: () => boolean;
};

// Reference to the navigation object that will be set from the navigation container
let navigationRef: NavigationRef | null = null;

/**
 * Set the navigation reference from the React Navigation container
 * This should be called from the App component when the navigation container is mounted
 * 
 * Example usage in React Native:
 * 
 * import { NavigationContainer } from '@react-navigation/native';
 * import { navigationUtil } from './utils/navigationUtil';
 * 
 * export default function App() {
 *   return (
 *     <NavigationContainer
 *       ref={(navigatorRef) => {
 *         navigationUtil.setTopLevelNavigator(navigatorRef);
 *       }}
 *     >
 *       // Navigation components
 *     </NavigationContainer>
 *   );
 * }
 */
const setTopLevelNavigator = (navigatorRef: NavigationRef) => {
  navigationRef = navigatorRef;
};

/**
 * Navigate to a specific route
 * @param routeName - The name of the route to navigate to
 * @param params - Optional parameters to pass to the route
 */
const navigate = (routeName: string, params?: object) => {
  if (navigationRef && typeof navigationRef.isReady === 'function' && navigationRef.isReady()) {
    // Use React Navigation
    navigationRef.navigate(routeName, params);
  } else if (typeof window !== 'undefined') {
    // Fallback to web navigation
    if (routeName === 'Login') {
      window.location.href = '/login';
    } else {
      window.location.href = `/${routeName.toLowerCase()}`;
    }
  } else {
    console.warn('Navigation not available');
  }
};

/**
 * Reset the navigation state and navigate to a specific route
 * @param routeName - The name of the route to navigate to
 * @param params - Optional parameters to pass to the route
 */
const reset = (routeName: string, params?: object) => {
  if (navigationRef && typeof navigationRef.isReady === 'function' && navigationRef.isReady()) {
    // Use React Navigation reset
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    });
  } else if (typeof window !== 'undefined') {
    // Fallback to web navigation
    if (routeName === 'Login') {
      window.location.href = '/login';
    } else {
      window.location.href = `/${routeName.toLowerCase()}`;
    }
  } else {
    console.warn('Navigation not available');
  }
};

/**
 * Navigate to the login screen
 * This is a convenience method used for auth failures
 */
const navigateToLogin = () => {
  reset('Login');
};

export const navigationUtil = {
  setTopLevelNavigator,
  navigate,
  reset,
  navigateToLogin
};

export default navigationUtil;

