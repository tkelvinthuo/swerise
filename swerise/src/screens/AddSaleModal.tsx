import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert
} from 'react-native';

// Define an interface for the props
interface AddSaleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (sale: any, saleType: 'cash' | 'debt', debtInfo?: any) => void;
}

// Use the interface to type the props in the component
const AddSaleModal: React.FC<AddSaleModalProps> = ({ visible, onClose, onSubmit }) => {
  const [product, setProduct] = useState("1"); // Default product ID
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [saleType, setSaleType] = useState<"cash" | "debt">("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [amountDue, setAmountDue] = useState("");

  const handleAddSale = () => {
    // Validate inputs
    if (!quantity || !totalPrice) {
      Alert.alert("Please fill in all required fields.");
      return;
    }

    // Prepare the sale object
    const sale = {
      shop_id: 1, // Default shop ID
      product_id: parseInt(product, 10), // Convert product ID to a number
      quantity: parseFloat(quantity),
      total_price: parseFloat(totalPrice),
      employee_id: null, // Adjust this as needed for your use case
      sale_type: saleType,
      customer: saleType === "cash" ? "New" : customerName, // Placeholder for cash sales
    };

    // Handle submission
    onSubmit(sale, saleType, {
      customer_name: customerName,
      customer_phone: customerPhone || null,
      amount_due: parseFloat(amountDue) || 0,
    });

    // Close the modal
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Sale</Text>

          <Text>Product:</Text>
          <Picker
            selectedValue={product}
            onValueChange={(itemValue) => setProduct(itemValue)}
          >
            <Picker.Item label="Gas 6kg" value="1" />
            <Picker.Item label="Gas 12kg" value="2" />
            <Picker.Item label="Diesel" value="3" />
            <Picker.Item label="Petrol" value="4" />
            <Picker.Item label="Kerosene" value="5" />
          </Picker>

          <Text>Quantity:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text>Total Price:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={totalPrice}
            onChangeText={setTotalPrice}
          />

          <Text>Sale Type:</Text>
          <Picker
            selectedValue={saleType}
            onValueChange={(itemValue) => setSaleType(itemValue)}
          >
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Debt" value="debt" />
          </Picker>

          {saleType === "debt" && (
            <>
              <Text>Customer Name:</Text>
              <TextInput
                style={styles.input}
                value={customerName}
                onChangeText={setCustomerName}
              />

              <Text>Customer Phone:</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
              />

              <Text>Amount Due:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amountDue}
                onChangeText={setAmountDue}
              />
            </>
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddSale}>
            <Text style={styles.addButtonText}>Add Sale</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddSaleModal;

// Styles for the modal
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
