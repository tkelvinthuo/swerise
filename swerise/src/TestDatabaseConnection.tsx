// src/TestDatabaseConnection.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { initializeDatabase, fetchUserByRole } from './database';

const TestDatabaseConnection = () => {
  useEffect(() => {
    // Initialize the database and create tables
    initializeDatabase();

    // Fetch the default user with role 'owner'
    fetchUserByRole('owner');
  }, []);

  return (
    <View>
      <Text>Database Setup and Default User </Text>
    </View>
  );
};

export default TestDatabaseConnection;
