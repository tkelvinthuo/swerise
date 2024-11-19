/* Pseudocode for database and functions
 
1. Connect to the database
2. Create necessary tables for various info to be stored
3. Create functions to insert data into the tables
- Tables to be created:
1. Users- EmployeeID, Full name, role, Id no, password, attached shopID
2. Shop- ShopID, location, name
3. Products- (name, quantity, unit price, product id)
4. Sales -  saleID, shopID, employeeID, productID, date

Flow of information
1. During installation, all tables are created and data synced from the cloud storage
2. During login, information is fetched from the user table
3. Addition of sale process:
    a) Record is added to the sales table with necessary information
    b) In the products table, that particular quantity is reduced by quantity sold
    c) During sync, each sale is uploaded systematically


shop - employee, products(kerosene, ...), sales

 */

import SQLite from 'react-native-sqlite-storage';
import { Sale, Debt } from './screens/types';
import { format } from 'date-fns';

// Enable debugging for development
SQLite.enablePromise(true);
SQLite.DEBUG(true);

// Open the database or create it if it doesn't exist
const db = SQLite.openDatabase({ name: 'swerise.db', location: 'default' });


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

const insertUser = async (username: string, fullName: string, role: string, password: string, shopID: number) => {
  try {
    const database = await db;

    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO users (username, fullName, role, password, shopID) VALUES (?, ?, ?, ?, ?)`,
        [username, fullName, role, password, shopID],
        () => {
          console.log('User inserted successfully');
        },
        (error) => {
          console.error('Error inserting user:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error during user insertion:', error);
  }
};

// for development, two default users are inserted
const insertDefaultUsers = async () => {
  try {
    const database = await db;

    database.transaction(tx => {
      tx.executeSql(
        `SELECT COUNT(*) AS count FROM users WHERE username IN (?, ?)`,
        ['owner', 'employee'],
        async (_, results) => {
          const { count } = results.rows.item(0);

          if (count === 0) {
            await insertUser('owner', 'Owner Name', 'Owner', 'owner123', 1);
            await insertUser('employee', 'Employee Name', 'Employee', 'employee123', 1);
            console.log('Default users inserted');
          } else {
            console.log('Default users already exist');
          }
        },
        (error) => {
          console.error('Error checking default users:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error during insertDefaultUsers:', error);
  }
};

export const fetchUserCredentials = async (username: string) => {
  try {
    const database = await db;

    return new Promise<{ username: string, password: string, role: string } | null>((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `SELECT username, password, role FROM users WHERE username = ?`,
          [username],
          (_, results) => {
            if (results.rows.length > 0) {
              const user = results.rows.item(0);
              resolve({ username: user.username, password: user.password, role: user.role });
            } else {
              resolve(null); 
            }
          },
          (error) => {
            console.error('Error fetching user credentials:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error during fetchUserCredentials:', error);
    return null;
  }
};

// Functions to handle Shops
const createShopsTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS shops (
          shop_id INTEGER PRIMARY KEY AUTOINCREMENT,  
          name TEXT NOT NULL,                         
          location TEXT NOT NULL,                     
          is_active INTEGER DEFAULT 1,                
          last_sync TIMESTAMP                         
        );`,
        [],
        () => {
          console.log('Shops table created successfully');
        },
        (error) => {
          console.error('Error creating shops table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

type Shop = {
  name: string;
  location: string;
  is_active?: number;
  last_sync?: string;
};

export const insertShop = async (shop: Shop): Promise<void> => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO shops (name, location, is_active, last_sync) VALUES (?, ?, ?, ?);`,
        [
          shop.name,
          shop.location,
          shop.is_active ?? 1,               
          shop.last_sync || null //      
        ],
        (_, result) => {
          console.log('Shop inserted successfully with ID:', result.insertId);
        },
        (error) => {
          console.error('Error inserting shop:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database:', error);
  }
};

export const deleteShopByName = async (name: string): Promise<void> => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `DELETE FROM shops WHERE name = ?;`,
        [name],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log(`Shop(s) with name "${name}" deleted successfully`);
          } else {
            console.log(`No shop found with name "${name}"`);
          }
        },
        (error) => {
          console.error('Error deleting shop:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database:', error);
  }
};


// Functions to handle Products
const createProductsTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS products (
          product_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          unit TEXT,
          price REAL,
        );`,
        [],
        () => {
          console.log('Products table created successfully');
        },
        (error) => {
          console.error('Error creating products table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

type Product = {
  name: string;
  category?: string;
  unit: string;
  price: number;
};

export const insertProduct = async (product: Product): Promise<void> => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO products (name, category, unit, price) VALUES (?, ?, ?, ?);`,
        [product.name, product.category || null, product.unit, product.price],
        (_, result) => {
          console.log('Product inserted successfully with ID:', result.insertId);
        },
        (error) => {
          console.error('Error inserting product:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database:', error);
  }
};

export const deleteProductByName = async (name: string): Promise<void> => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `DELETE FROM products WHERE name = ?;`,
        [name],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log(`Product(s) with name "${name}" deleted successfully`);
          } else {
            console.log(`No product found with name "${name}"`);
          }
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database:', error);
  }
};

// tables to handle local sales
const createSalesTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sales (
          sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
          shop_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity REAL NOT NULL,
          total_price REAL NOT NULL,
          sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          employee_id INTEGER,
          sale_type TEXT NOT NULL CHECK(sale_type IN ('cash', 'debt')),
          sync_status INTEGER DEFAULT 0,
          customer TEXT,
          FOREIGN KEY (shop_id) REFERENCES shops(shop_id),
          FOREIGN KEY (product_id) REFERENCES products(product_id)
        );`,
        [],
        () => {
          console.log('Sales table created successfully');
        },
        (error) => {
          console.error('Error creating sales table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

//type Sale = {
//  sale_id: number;
//  shop_id: number;
//  product_id: number;
//  quantity: number;
//  total_price: number;
//  sale_date: string;
//  employee_id: number;
//  sale_type: 'cash' | 'debt';
//  sync_status: number;
//};

// Insert a new sale and create a debt record if the payment method is debt
export const insertSale = async (sale: Omit<Sale, "id">, paymentMethod: string, debt?: Debt): Promise<void> => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO sales (shop_id, product_id, quantity, total_price, sale_date, employee_id, sale_type, sync_status)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, 0);`,
        [
          sale.shop_id, sale.product_id, sale.quantity, sale.total_price, sale.employee_id, paymentMethod
        ],
        (_, result) => {
          const sale_id = result.insertId; // Database-generated id
          if (paymentMethod === "debt" && debt) {
            const debtInfo: Debt = {
              sale_id: sale_id,
              customer_name: debt.customer_name,
              customer_phone: debt.customer_phone === null ? undefined : debt.customer_phone,  
              amount_due: debt.amount_due,
              amount_paid: 0,
            };
            insertDebt(debtInfo);
          }
        },
        (error) => {
          console.error('Error inserting sale:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database:', error);
  }
};


export const deleteSale = async (sale_id: number): Promise<void> => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `DELETE FROM sales WHERE sale_id = ?;`,
        [sale_id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log(`Sale with ID ${sale_id} deleted successfully.`);
          } else {
            console.log(`No sale found with ID ${sale_id}.`);
          }
        },
        (error) => {
          console.error('Error deleting sale:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database:', error);
  }
};

type DateFilter = 'all' | 'today' | 'week' | 'month' | { startDate: string; endDate: string };

export const getSalesByDate = async (dateFilter: DateFilter = 'all'): Promise<Sale[]> => {
  try {
    const database = await db;
    const salesList: Sale[] = [];

    let query = `SELECT * FROM sales`;
    const params: string[] = [];

    // Adjust query based on the date filter
    switch (dateFilter) {
      case 'today':
        query += ` WHERE date(sale_date) = date('now')`;
        break;
      case 'week':
        query += ` WHERE date(sale_date) >= date('now', '-7 days')`;
        break;
      case 'month':
        query += ` WHERE date(sale_date) >= date('now', 'start of month')`;
        break;
      default:
        if (typeof dateFilter === 'object') {
          query += ` WHERE date(sale_date) BETWEEN ? AND ?`;
          params.push(dateFilter.startDate, dateFilter.endDate);
        }
        break;
    }

    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          query,
          params,
          (_, result) => {
            for (let i = 0; i < result.rows.length; i++) {
              salesList.push(result.rows.item(i));
            }
            resolve(salesList);
          },
          (error) => {
            console.error('Error reading sales table with filter:', error);
            reject([]);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error accessing database:', error);
    return [];
  }
};
// Function to alter the sales table to add a customer column
const alterSalesTableToAddCustomer = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `ALTER TABLE sales ADD COLUMN customer TEXT;`,
        [],
        () => {
          console.log('Customer column added successfully to the sales table');
        },
        (error) => {
          console.error('Error adding customer column to sales table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database to alter table:', error);
  }
};

// to handle debts table
const createDebtsTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS debts (
          debt_id INTEGER PRIMARY KEY AUTOINCREMENT,
          sale_id INTEGER,
          customer_name TEXT NOT NULL,
          customer_phone TEXT,
          amount_due REAL NOT NULL,
          amount_paid REAL DEFAULT 0,
          sync_status INTEGER DEFAULT 0,
          FOREIGN KEY (sale_id) REFERENCES sales(sale_id)
        );`,
        [],
        () => {
          console.log('Debts table created successfully');
        },
        (error) => {
          console.error('Error creating debts table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

//type Debt = {
//  sale_id: number;
//  customer_name: string;
//  customer_phone?: string | null; 
//  amount_due: number;
//  amount_paid: number; 
//};

export const insertDebt = async (debt: Debt): Promise<void> => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO debts (sale_id, customer_name, customer_phone, amount_due, sync_status)
         VALUES (?, ?, ?, ?, ?, 0);`,
        [
          debt.sale_id,
          debt.customer_name,
          debt.customer_phone || null,
          debt.amount_due,
        ],
        (_, result) => {
          console.log(`Debt inserted successfully with ID: ${result.insertId}`);
        },
        (error) => {
          console.error('Error inserting debt:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database:', error);
  }
};

// add a payments table 

// Update debt after a partial payment (already using your makePartialPayment function)
export const makePartialPayment = async (debt_id: number, payment_amount: number): Promise<void> => {
  try {
    const database = await db;
    database.transaction(tx => {
      // Update debt with partial payment
      tx.executeSql(
        `UPDATE debts
         SET amount_paid = amount_paid + ?, amount_due = amount_due - ?, sync_status = 0
         WHERE debt_id = ? AND amount_due > 0;`,
        [payment_amount, payment_amount, debt_id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log(`Debt payment of ${payment_amount} applied successfully.`);
          } else {
            console.error('Error: No rows affected during payment update.');
          }
        },
        (error) => {
          console.error('Error applying debt payment:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error accessing database:', error);
  }
};

// Function to initialize the database (create tables and insert default user)
export const initializeDatabase = async () => {
  await createUsersTable();
  await insertDefaultUsers();
  await createSalesTable();
  await createDebtsTable();
};

export default db;
