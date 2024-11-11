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


const createUsersTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          userID INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          fullName TEXT NOT NULL,
          role TEXT NOT NULL,
          password TEXT NOT NULL,
          shopID INTEGER,
          FOREIGN KEY (shopID) REFERENCES shops (shopID)
        );`,
        [],
        () => {
          console.log('Users table created');
        },
        (error) => {
          console.error('Error creating users table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};
