import React from "react";
import { Text, TextInput, Image, View, StyleSheet } from "react-native";

const SignupPage = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('./swerise-logo-black.png')}
                style={styles.logo}
            />
            <Text>Please sign up</Text>
            <TextInput>Fill in the details</TextInput>
        </View>
    );
};

const styles = StyleSheet.create({
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
})

export default SignupPage;