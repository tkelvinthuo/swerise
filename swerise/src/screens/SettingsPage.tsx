import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SettingsPage = () => {
  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.appName}>Swerise</Text>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
      navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
      },
      navButton: {
        padding: 10,
      },
      navText: {
        color: 'black',
        fontSize: 16,
      },
      appName: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
      },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SettingsPage;
