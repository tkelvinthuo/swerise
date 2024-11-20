import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { getSalesByDate, insertSale, insertDebt } from "../database";
import AddSaleModal from "./AddSaleModal";

interface Sale {
  sale_id: number;
  shop_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  sale_date: string;
  employee_id: number | null;
  sale_type: 'cash' | 'debt';
  sync_status: number;
  customer: string | null;
}

interface SaleUI {
  id: string;
  date: string;
  customer: string;
  product: string;
  qty: string;
  totalAmount: string;
}

interface Debt {
  sale_id: number; // Will be assigned after inserting the sale
  customer_name: string;
  customer_phone: string | null;
  amount_due: number;
  amount_paid: number; // Amount paid for the debt, default is 0
}
 

interface DebtInfo {
  customer_name: string;
  customer_phone: string | null;
  amount_due: number;
}

const SalePage = () => {
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month'>('today');
  const [salesData, setSalesData] = useState<SaleUI[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to map the raw database sale to the UI-friendly format
  const mapSaleToUI = (sale: Sale): SaleUI => {
    return {
      id: sale.sale_id.toString(),
      date: new Date(sale.sale_date).toLocaleDateString(), // Format the date
      customer: sale.customer || "Unknown", // Fallback for customer
      product: `Product ID: ${sale.product_id}`, // Placeholder for product
      qty: `${sale.quantity} pcs`, // Format quantity for display
      totalAmount: `$${sale.total_price.toFixed(2)}` // Format total price as currency
    };
  };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesFromDatabase = await getSalesByDate(dateFilter); // Fetch data
        const mappedSales = salesFromDatabase.map(mapSaleToUI); // Map to UI-friendly format
        setSalesData(mappedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, [dateFilter]);

  // Function to change the filter
  const handleFilterChange = (newFilter: 'today' | 'week' | 'month') => {
    setDateFilter(newFilter);
  };

  // Function to handle adding a sale
  const handleAddSale = async (
    sale: Omit<Sale, "sale_id">, // Exclude sale_id as it is auto-generated
    saleType: "cash" | "debt",
    debtInfo: DebtInfo
  ) => {
    try {
      // Insert sale into the database and get the sale_id
      const sale_id = await insertSale(sale, saleType, debtInfo); // Ensure insertSale returns sale_id

      // If the sale type is "debt", create the full Debt object and insert it
      if (saleType === "debt") {
        const debt: Debt = {
          sale_id: sale_id, // Use the generated sale_id
          customer_name: debtInfo.customer_name,
          customer_phone: debtInfo.customer_phone,
          amount_due: debtInfo.amount_due,
          amount_paid: 0, // Default amount paid is 0
        };

        // Insert the debt into the debts table
        await insertDebt(debt); // Ensure insertDebt accepts a Debt object
      }

      setIsModalVisible(false); // Close the modal

      // Refresh sales data after adding a sale
      const updatedSales = await getSalesByDate(dateFilter);
      setSalesData(updatedSales.map(mapSaleToUI));
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };


  // Correctly render the SaleUI item
  const renderSaleItem = ({ item }: { item: SaleUI }) => (
    <View style={styles.saleRow}>
      <Text style={styles.saleColumn}>{item.date}</Text>
      <Text style={styles.saleColumn}>{item.customer}</Text>
      <Text style={styles.saleColumn}>{item.product}</Text>
      <Text style={styles.saleColumn}>{item.qty}</Text>
      <Text style={styles.saleColumn}>{item.totalAmount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
        <TouchableOpacity style={styles.syncButton}>
          <Text style={styles.syncText}>Sync</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headingSection}>
        <Text style={styles.headingText}>Sales Records</Text>
        <Text style={styles.filterDate}>
          {dateFilter === 'today'
            ? 'Today'
            : dateFilter === 'week'
            ? 'This Week'
            : 'This Month'}
        </Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity onPress={() => handleFilterChange('today')}>
            <Text style={styles.filterButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('week')}>
            <Text style={styles.filterButtonText}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('month')}>
            <Text style={styles.filterButtonText}>Month</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subheadingSection}>
        <Text style={styles.subheadingText}>Date</Text>
        <Text style={styles.subheadingText}>Customer</Text>
        <Text style={styles.subheadingText}>Product</Text>
        <Text style={styles.subheadingText}>Qty</Text>
        <Text style={styles.subheadingText}>Total Amt</Text>
      </View>

      <FlatList
        data={salesData}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.addSaleButton}
      onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addSaleText}>Add Sale</Text>
      </TouchableOpacity>
      {/* Add Sale Modal */}
      
      <AddSaleModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)} // Close modal
        onSubmit={handleAddSale} // Handle form submission
      />

    </View>
  );
};

export default SalePage;

// Styling remains unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateText: {
    color: "#555",
    fontSize: 15,
  },
  syncButton: {
    borderRadius: 5,
    padding: 5,
  },
  syncText: {
    color: 'orange',
    fontSize: 15,
  },
  headingSection: {
    backgroundColor: '#4682b4',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 3,
  },
  headingText: {
    color: 'white',
    fontSize: 16,
  },
  filterDate: {
    color: 'white',
  },
  subheadingSection: {
    backgroundColor: '#4682b4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    paddingTop: 3,
    paddingBottom: 6,
  },
  subheadingText: {
    color: 'white',
    fontSize: 14,
    width: '20%',
    textAlign: 'center',
  },
  saleRow: {
    backgroundColor: 'lightblue',
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  saleColumn: {
    textAlign: 'center',
    width: '20%',
  },
  addSaleButton: {
    backgroundColor: "white",
    borderRadius: 100,
    bottom: 5,
    right: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    elevation: 3,
  },
  addSaleText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 14,
    padding: 5,
  },
});
