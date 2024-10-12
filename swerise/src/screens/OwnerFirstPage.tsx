import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OwnerFirstPage = () => {
  const [isShopModalVisible, setShopModalVisible] = useState(false);
  const [isStockModalVisible, setStockModalVisible] = useState(false);
  const [isEmployeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [isMenuVisible, setMenuModalVisible] = useState(false);
  const navigation = useNavigation();
  // Shop names for "Visit Shops"
  const shopNames = ['Jimmy', 'Wagithomo', 'Francis', 'Kiganjo'];

  // Shop names for "Check Stock" (with "All" option)
  const stockList = ['All', 'Jimmy', 'Wagithomo', 'Francis', 'Kiganjo'];

  const employeeList = ['Jimmy', 'Francis', 'Wagithomo', 'Brighton', 'Kiganjo1', 'Kevo', 'Sam'];
  const getEmployeeList = () => {
    
  }

  // Toggle for Menu
  const toggleMenuModal = () => {
    setMenuModalVisible(!isMenuVisible);
  };

  // Toggle for Shop modal
  const toggleShopModal = () => {
    setShopModalVisible(!isShopModalVisible);
  };

  // Toggle for Stock modal
  const toggleStockModal = () => {
    setStockModalVisible(!isStockModalVisible);
  };

    // Toggle for Stock modal
  const toggleEmployeekModal = () => {
    setEmployeeModalVisible(!isEmployeeModalVisible);
  };



  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.appName}>Swerise</Text>

        <TouchableOpacity style={styles.navButton} onPress={toggleMenuModal}>
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Body with squares/buttons */}
      <View style={styles.body}>
        <View style={styles.row}>
          {/* Visit Shops Button */}
          <TouchableOpacity style={styles.square} onPress={toggleShopModal}>
            <Text style={styles.squareText}>Visit Shops</Text>
          </TouchableOpacity>

          {/* Check Stock Button */}
          <TouchableOpacity style={styles.square} onPress={toggleStockModal}>
            <Text style={styles.squareText}>Check Stock</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.square} >
            <Text style={styles.squareText}>Finances</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.square} onPress={toggleEmployeekModal}>
            <Text style={styles.squareText}>Manage Employee</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.square}>
            <Text style={styles.squareText}>Supplier Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.square}>
            <Text style={styles.squareText}>Others</Text>
          </TouchableOpacity>
        </View>
        <View >
          <TouchableOpacity style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for the Menu */}
      <Modal transparent={true} visible={isMenuVisible} animationType="slide" onRequestClose={toggleShopModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* List of Menu Options */}
                        <TouchableOpacity style={styles.shopItem}  onPress={() => {
                          toggleMenuModal();
                          navigation.navigate('OwnerFirstPage');
                          }}>
                            <Text style={styles.shopItemText}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shopItem} onPress={() => {
                          toggleMenuModal();
                          navigation.navigate('SettingsPage');
                        }}>
                            <Text style={styles.shopItemText}>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shopItem}>
                            <Text style={styles.shopItemText}>About</Text>
                        </TouchableOpacity>

                        {/* Close Menu Option */}
                        <TouchableOpacity onPress={toggleMenuModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
      

      {/* Modal for shop selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShopModalVisible}
        onRequestClose={toggleShopModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Shop</Text>
            <FlatList
              data={shopNames}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.shopItem}>
                  <Text style={styles.shopItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleShopModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for checking stock */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isStockModalVisible}
        onRequestClose={toggleStockModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Check Stock</Text>
            <FlatList
              data={stockList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.shopItem}>
                  <Text style={styles.shopItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleStockModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEmployeeModalVisible}
        onRequestClose={toggleEmployeekModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Employee</Text>
            <FlatList
              data={employeeList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.shopItem}>
                  <Text style={styles.shopItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleEmployeekModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  exitButton: {
    marginTop: 40,
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  shopItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  shopItemText: {
    fontSize: 18,
    color: '#333',
  },
  square: {
    flex: 1,
    margin: 10,
    height: 80,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  squareText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OwnerFirstPage;
