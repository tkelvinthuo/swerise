import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { insertSale, insertDebt } from "../database";

const EmployeeFirstPage = () => {
    // State for handling modals
    const [isAddSaleModalVisible, setAddSaleModalVisible] = useState(false);
    const [isDeleteSaleModalVisible, setDeleteSaleModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(''); // For product selection
    const [gasSize, setGasSize] = useState('6kg'); // Default gas size for Gas selection
    const [quantity, setQuantity] = useState(''); // For quantity input
    const [price, setPrice] = useState(''); // For price input
    const [saleType, setSaleType] = useState('cash'); // Default sale type
    const [customerName, setCustomerName] = useState(''); // For debt customer name
    const [customerPhone, setCustomerPhone] = useState(''); // For debt customer phone

    // Toggle Add Sale Modal
    const toggleAddSaleModal = () => {
        setAddSaleModalVisible(!isAddSaleModalVisible);
        resetForm();
    };

    // Toggle Delete Sale Modal
    const toggleDeleteSaleModal = () => {
        setDeleteSaleModalVisible(!isDeleteSaleModalVisible);
    };

    // Reset form fields when modal closes
    const resetForm = () => {
        setSelectedProduct('');
        setGasSize('6kg');
        setQuantity('');
        setPrice('');
        setSaleType('cash');
        setCustomerName('');
        setCustomerPhone('');
    };
    
    // Function to handle submit in sales
    const handleSaleSubmission = async () => {
        try {
            // Ensure that a product has been selected
            if (!selectedProduct) {
                Alert.alert('Error', 'Please select a product.');
                return;
            }
    
            // Handle gas-specific validation
            if (selectedProduct === 'gas') {
                if (!gasSize) {
                    Alert.alert('Error', 'Please select a gas size.');
                    return;
                }
                if (!price || isNaN(Number(price))) {
                    Alert.alert('Error', 'Please enter a valid price.');
                    return;
                }
    
                const totalAmount = parseFloat(price);
    
                // Check if the sale is on debt
                if (saleType === 'debt') {
                    if (!customerName || !customerPhone) {
                        Alert.alert('Error', 'Please enter the customer\'s name and phone number.');
                        return;
                    }
    
                    // Insert debt sale into the database
                    const saleId = await insertSale(selectedProduct, gasSize, 1, totalAmount, 'debt');
    
                    // Ensure saleId is valid before inserting debt
                    if (saleId !== null) {
                        await insertDebt(saleId, customerName, customerPhone, totalAmount, totalAmount);
                    } else {
                        Alert.alert('Error', 'Failed to record the sale. Please try again.');
                        return;
                    }
                } else {
                    // Insert cash sale into the database
                    await insertSale(selectedProduct, gasSize, 1, totalAmount, 'cash');
                }
            } else {
                // Validate for other products (petrol, diesel, kerosene)
                if (!quantity || isNaN(Number(quantity))) {
                    Alert.alert('Error', 'Please enter a valid quantity.');
                    return;
                }
                if (!price || isNaN(Number(price))) {
                    Alert.alert('Error', 'Please enter a valid price.');
                    return;
                }
    
                const totalAmount = parseInt(quantity) * parseFloat(price);
    
                // Check if the sale is on debt
                if (saleType === 'debt') {
                    if (!customerName || !customerPhone) {
                        Alert.alert('Error', 'Please enter the customer\'s name and phone number.');
                        return;
                    }
    
                    // Insert debt sale into the database
                    const saleId = await insertSale(selectedProduct, null, parseInt(quantity), totalAmount, 'debt');
    
                    // Ensure saleId is valid before inserting debt
                    if (saleId !== null) {
                        await insertDebt(saleId, customerName, customerPhone, totalAmount, totalAmount);
                    } else {
                        Alert.alert('Error', 'Failed to record the sale. Please try again.');
                        return;
                    }
                } else {
                    // Insert cash sale into the database
                    await insertSale(selectedProduct, null, parseInt(quantity), totalAmount, 'cash');
                }
            }
    
            // Success alert and closing the modal
            Alert.alert('Success', 'Sale recorded successfully!');
            toggleAddSaleModal();
        } catch (error) {
            console.error('Error recording sale:', error);
            Alert.alert('Error', 'An error occurred while recording the sale.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Navigation Bar */}
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.navbutton}>
                    <Text style={styles.navtext}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.appname}>Swerise</Text>
                <TouchableOpacity style={styles.navbutton}>
                    <Text style={styles.navtext}>Menu</Text>
                </TouchableOpacity>
            </View>

            {/* Buttons for employee actions */}
            <View style={styles.body}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={toggleAddSaleModal}>
                        <Text style={styles.buttonText}>Add Sale</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText} onPress={toggleDeleteSaleModal}>Delete Sale</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Today's Sales</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Total Sale</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.closeButton}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for Add Sale */}
            <Modal transparent={true} visible={isAddSaleModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Sale</Text>

                        {/* Picker for selecting the product */}
                        <Text style={styles.label}>Select Product</Text>
                        <Picker
                            selectedValue={selectedProduct}
                            onValueChange={(itemValue) => setSelectedProduct(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Gas" value="gas" />
                            <Picker.Item label="Petrol" value="petrol" />
                            <Picker.Item label="Diesel" value="diesel" />
                            <Picker.Item label="Kerosene" value="kerosene" />
                        </Picker>

                        {/* Conditional Input for Gas */}
                        {selectedProduct === 'gas' && (
                            <>
                                <Text style={styles.label}>Select Gas Size</Text>
                                <Picker
                                    selectedValue={gasSize}
                                    onValueChange={(itemValue) => setGasSize(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="6kg" value="6kg" />
                                    <Picker.Item label="13kg" value="13kg" />
                                </Picker>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Price (KSH)"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </>
                        )}

                        {/* Input fields for Petrol, Diesel, Kerosene (liters and price) */}
                        {(selectedProduct === 'petrol' || selectedProduct === 'diesel' || selectedProduct === 'kerosene') && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Quantity (liters)"
                                    keyboardType="numeric"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Price (KSH)"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </>
                        )}

                        {/* Sale Type Picker */}
                        <Text style={styles.label}>Sale Type</Text>
                        <Picker
                            selectedValue={saleType}
                            onValueChange={(itemValue) => setSaleType(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Cash" value="cash" />
                            <Picker.Item label="Debt" value="debt" />
                        </Picker>

                        {/* Conditional Input for Debt */}
                        {saleType === 'debt' && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Customer Name"
                                    value={customerName}
                                    onChangeText={setCustomerName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Customer Phone"
                                    keyboardType="phone-pad"
                                    value={customerPhone}
                                    onChangeText={setCustomerPhone}
                                />
                            </>
                        )}

                        {/* Submit and Cancel Buttons */}
                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleSaleSubmission}>
                                <Text style={styles.modalButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={toggleAddSaleModal}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for Delete Sale */}
            <Modal transparent={true} visible={isDeleteSaleModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Delete Sale</Text>
                        <Text style={styles.modalText}>Are you sure you want to delete this sale?</Text>

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity style={styles.modalButton} onPress={toggleDeleteSaleModal}>
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={toggleDeleteSaleModal}>
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    appname: {
        color: 'black',
        fontSize: 19,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: 'white',
    },
    navbutton: {
        padding: 10,
    },
    navtext: {
        color: 'black',
        fontSize: 16,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
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
        marginBottom: 20,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default EmployeeFirstPage;
