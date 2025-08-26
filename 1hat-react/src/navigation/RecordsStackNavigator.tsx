import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import RecordsScreen from '../screens/RecordsScreen';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';
import PrescriptionScreen from '../screens/PrescriptionScreen';

const Stack = createNativeStackNavigator();

const RecordsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RecordsList" component={RecordsScreen} />
      <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
      <Stack.Screen name="Prescription" component={PrescriptionScreen} />
    </Stack.Navigator>
  );
};

export default RecordsStackNavigator;
