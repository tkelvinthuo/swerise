import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';  // Importing external Icon component
import SalePage from './SalePage';
import SettingsPage from './SettingsPage';

// Create a Tab Navigator
const Tab = createBottomTabNavigator();

// Employee Home Screen
const EmployeeHome = () => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>Welcome to EmployeeFirstPage</Text>
    </View>
  );
};

// Employee First Page with Bottom Tab Navigation
const EmployeeFirstPage = () => {
  return (
    <Tab.Navigator
      initialRouteName="EmployeeHome"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';  // Declare iconName as a string

          // Set iconName based on route name
          if (route.name === 'EmployeeHome') {
            iconName = 'home';  // FontAwesome "home"
          } else if (route.name === 'Sales') {
            iconName = 'shopping-cart';  // FontAwesome "shopping-cart"
          } else if (route.name === 'Settings') {
            iconName = 'cogs';  // FontAwesome "cogs"
          }

          // Return the icon component with the correct properties
          return <Icon name={iconName} type="font-awesome" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4682b4', 
        tabBarInactiveTintColor: '#8a8a8a',  
        tabBarStyle: {
          backgroundColor: '#252F40',  
          height: 60,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="EmployeeHome"
        component={EmployeeHome}
        options={{ tabBarLabel: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="Sales"
        component={SalePage}
        options={{ tabBarLabel: 'Sales', headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{ tabBarLabel: 'Settings', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmployeeFirstPage;
