// HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserByRole, User } from '../database';

const HomeScreen = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSubmit = async () => {
    try {
      // Fetch the user from the database based on the role
      const user: User | null = await fetchUserByRole(role.toLowerCase());

      // Check if user exists and if the password matches
      if (user && user.password === password) {
        if (user.role === 'owner') {
          navigation.navigate('OwnerFirstPage');
        } else if (user.role === 'employee') {
          navigation.navigate('EmployeeFirstPage');
        }
      } else {
        Alert.alert('Invalid Credentials', 'The role or password is incorrect.');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('Error', 'There was an error verifying the credentials.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inner}>
          <Text
            style={[
              styles.welcome,
              { marginBottom: isKeyboardVisible ? 10 : 100 },
            ]}
          >
            Welcome{'\n'}to{'\n'}Swerise
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Role"
            placeholderTextColor="#888"
            value={role}
            onChangeText={setRole}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

//styling for the different elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    width: '100%',
  },
  welcome: {
    fontSize: 30,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    width: 280,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
