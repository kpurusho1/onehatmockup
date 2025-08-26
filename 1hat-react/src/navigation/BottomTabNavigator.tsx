import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TreatmentScreen from '../screens/TreatmentScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import stack navigators
import RecordsStackNavigator from './RecordsStackNavigator';

// No custom tab label component needed anymore

const Tab = createBottomTabNavigator();

interface BottomTabNavigatorProps {
  onLogout?: () => void;
}

const BottomTabNavigator = ({ onLogout }: BottomTabNavigatorProps) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#64748b',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
          bottom: 10
        },
        // Remove arrows
        tabBarIcon: () => null
      }}
    >
      <Tab.Screen 
        name="See Patient" 
        options={({ navigation, route }) => ({
          tabBarLabel: 'See Patient',
          tabBarItemStyle: {
            backgroundColor: navigation.isFocused() ? '#26bc9f' : 'transparent',
            height: 70
          }
        })}
      >
        {(props) => <HomeScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Patient Files" 
        component={RecordsStackNavigator}
        options={({ navigation }) => ({
          tabBarLabel: 'Patient Files',
          tabBarItemStyle: {
            backgroundColor: navigation.isFocused() ? '#26bc9f' : 'transparent',
            height: 70
          }
        })}
      />
      <Tab.Screen 
        name="Treatment Plan" 
        component={TreatmentScreen}
        options={({ navigation }) => ({
          tabBarLabel: 'Treatment',
          tabBarItemStyle: {
            backgroundColor: navigation.isFocused() ? '#26bc9f' : 'transparent',
            height: 70
          }
        })}
      />
      <Tab.Screen 
        name="Settings" 
        options={({ navigation }) => ({
          tabBarLabel: 'Settings',
          tabBarItemStyle: {
            backgroundColor: navigation.isFocused() ? '#26bc9f' : 'transparent',
            height: 70
          }
        })}
      >
        {(props) => <SettingsScreen {...props} navigation={props.navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    paddingBottom: 15,
  },
});

export default BottomTabNavigator;
