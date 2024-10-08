import React from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from "react-native-gesture-handler";

const LoginPage = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('./swerise-logo-black.png')}
                style={styles.logo}
            />
            <Text style={styles.loginText}>Login</Text>
            <TextInput
            style={styles.input}
            placeholder="Role"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert('Button Pressed!')}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#333',
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
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 300,
        height: 200,
        marginBottom: 10,
        marginTop:10 
    },
    loginText: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: 'black' 
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
});

export default LoginPage;
