import React from 'react';
import { HomeScreen, LoginPage, SignupPage, OwnerFirstPage, EmployeeFirstPage } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Swerise = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Swerise"
          component={EmployeeFirstPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Swerise;
