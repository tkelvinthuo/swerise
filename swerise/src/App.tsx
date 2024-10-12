import React from 'react';
import { HomeScreen, LoginPage, SignupPage, OwnerFirstPage, EmployeeFirstPage, SettingsPage } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Swerise = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Swerise"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OwnerFirstPage"
          component={OwnerFirstPage}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="EmployeeFirstPage"
          component={EmployeeFirstPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingsPage"
          component={SettingsPage}
          options={{ headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Swerise;
