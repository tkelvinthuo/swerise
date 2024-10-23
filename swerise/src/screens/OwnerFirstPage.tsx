import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/OwnerFirstPageStyles';
import * as database from '../database';
import { Product, Shop } from '../database';

const OwnerFirstPage = () => {
  const [isShopModalVisible, setShopModalVisible] = useState(false);
  const [isStockModalVisible, setStockModalVisible] = useState(false);
  const [isEmployeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [isMenuVisible, setMenuModalVisible] = useState(false);
  const navigation = useNavigation();

  const [shopNames, setShopNames] = useState<Shop[]>([]);
  const [shopName, setShopName] = useState(''); // Define shopName
  const [shopLocation, setShopLocation] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  const stockList = ['All', 'Jimmy', 'Wagithomo', 'Francis', 'Kiganjo'];
  const employeeList = ['Jimmy', 'Francis', 'Wagithomo', 'Brighton', 'Kiganjo1', 'Kevo', 'Sam'];

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

  // Toggle for Employee modal
  const toggleEmployeeModal = () => {
    setEmployeeModalVisible(!isEmployeeModalVisible);
  };

  const handleAddShop = async () => {
    if (shopName && shopLocation) {
      const shopId = await database.insertShop(shopName, shopLocation);
      if (shopId) {
        console.log('New shop added with ID:', shopId);
        
        const newShop: Shop = { id: shopId, name: shopName, location: shopLocation };
        setShopNames((prevShops) => [...prevShops, newShop]);
        setShopName('');
        setShopLocation('');
      }
    } else {
      alert('Please fill out both the shop name and location.');
    }
  };

  const handleDeleteShop = async (shopId: number) => {
    await database.deleteShopById(shopId);
    console.log(`Shop with ID ${shopId} deleted`);
    setShopNames((prevShops) => prevShops.filter(shop => shop.id !== shopId));
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
          <TouchableOpacity style={styles.square} onPress={toggleShopModal}>
            <Text style={styles.squareText}>Manage Shops</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={toggleStockModal}>
            <Text style={styles.squareText}>Manage Stock</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.square}>
            <Text style={styles.squareText}>Finances</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.square} onPress={toggleEmployeeModal}>
            <Text style={styles.squareText}>Manage Employee</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.square}>
            <Text style={styles.squareText}>Manage Suppliers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.square}>
            <Text style={styles.squareText}>Others</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.exitButton}>
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for the Menu */}
      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="slide"
        onRequestClose={toggleMenuModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.shopItem}
              onPress={() => {
                toggleMenuModal();
                navigation.navigate('OwnerFirstPage');
              }}
            >
              <Text style={styles.shopItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shopItem}
              onPress={() => {
                toggleMenuModal();
                navigation.navigate('SettingsPage');
              }}
            >
              <Text style={styles.shopItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopItem}>
              <Text style={styles.shopItemText}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleMenuModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for managing shops */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShopModalVisible}
        onRequestClose={toggleShopModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manage Shops</Text>
            <TextInput
              style={styles.input}
              placeholder="Shop Name"
              value={shopName}
              onChangeText={setShopName}
            />
            <TextInput
              style={styles.input}
              placeholder="Shop Location"
              value={shopLocation}
              onChangeText={setShopLocation}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddShop}>
              <Text style={styles.addButtonText}>Add Shop</Text>
            </TouchableOpacity>
            
            <FlatList
              data={shopNames}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.shopItem}>
                  <Text style={styles.shopItemText}>
                    {item.name} - {item.location}
                  </Text>
                  <TouchableOpacity onPress={() => handleDeleteShop(item.id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
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
        onRequestClose={toggleEmployeeModal}
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
            <TouchableOpacity style={styles.closeButton} onPress={toggleEmployeeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};



export default OwnerFirstPage;
