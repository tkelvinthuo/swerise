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

 */

import SQLite from 'react-native-sqlite-storage';
import { format } from 'date-fns';

// Enable debugging for development
SQLite.enablePromise(true);
SQLite.DEBUG(true);

// Open the database or create it if it doesn't exist
const db = SQLite.openDatabase({ name: 'swerise.db', location: 'default' });


// creating users table
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

// function to input data into the users table
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


// create table for shops
const createShopsTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS shops ( 
          shopID INTEGER PRIMARY KEY AUTOINCREMENT,
          location TEXT NOT NULL,
          name TEXT NOT NULL, 
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


// Function to insert a new shop
export const insertShop = async (name: string, location: string): Promise<number | null> => {
  try {
    const database = await db;
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `INSERT INTO shops (name, location) VALUES (?, ?);`,
          [name, location],
          (tx, results) => {
            const shopId = results.insertId;
            console.log('Shop inserted successfully with ID:', shopId);
            resolve(shopId);
          },
          (error) => {
            console.error('Error inserting shop:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error opening database:', error);
    return null;
  }
};

// Function to delete a shop by its ID
export const deleteShopById = async (shopId: number): Promise<void> => {
  try {
    const database = await db;
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `DELETE FROM shops WHERE id = ?;`,
          [shopId],
          () => {
            console.log(`Shop with ID ${shopId} deleted successfully`);
            resolve();
          },
          (error) => {
            console.error('Error deleting shop:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

// Create productID, QOM, Unit_price, valuation
export const insertProduct = async (shopId: number, name: string, unit: string, price: number): Promise<number | null> => {
  try {
    const database = await db;
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `INSERT INTO products (shopId, name, unit, price) VALUES (?, ?, ?, ?);`,
          [shopId, name, unit, price],
          (tx, results) => {
            const productId = results.insertId;
            console.log('Product inserted successfully with ID:', productId);
            resolve(productId);
          },
          (error) => {
            console.error('Error inserting product:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error opening database:', error);
    return null;
  }
};


// Function to create the 'products' table
const createProductsTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          shopId INTEGER,
          name TEXT,
          unit TEXT,
          price REAL,
          FOREIGN KEY (shopId) REFERENCES shops(id)
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

// Total revamp
const createSalesTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product TEXT,
          gasSize TEXT,
          quantity INTEGER,
          price REAL,
          date TEXT,
          saleType TEXT
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

// To be handled by customer's table 
const createDebtsTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS debts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          saleId INTEGER,
          customerName TEXT,
          customerPhone TEXT,
          debtAmount REAL,
          remainingAmount REAL,
          FOREIGN KEY (saleId) REFERENCES sales(id)
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

// Inserting new sale with saleType
export const insertSale = async (
  product: string,
  gasSize: string | null,
  quantity: number,
  price: number,
  saleType: 'cash' | 'debt'
): Promise<number | null> => {
  try {
    const database = await db;
    const currentDate = new Date().toISOString();

    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `INSERT INTO sales (product, gasSize, quantity, price, date, saleType) VALUES (?, ?, ?, ?, ?, ?);`,
          [product, gasSize, quantity, price, currentDate, saleType],
          (tx, results) => {
            const saleId = results.insertId;
            console.log('Sale record inserted successfully with ID:', saleId);
            resolve(saleId); // Return the generated sale ID for further use (e.g., inserting into debts)
          },
          (error) => {
            console.error('Error inserting sale record:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error opening database:', error);
    return null;
  }
};

// Updated from the customer's table 
export const insertDebt = async (
  saleId: number,
  customerName: string,
  customerPhone: string,
  debtAmount: number,
  remainingAmount: number
) => {
  try {
    const database = await db;

    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO debts (saleId, customerName, customerPhone, debtAmount, remainingAmount) VALUES (?, ?, ?, ?, ?);`,
        [saleId, customerName, customerPhone, debtAmount, remainingAmount],
        () => {
          console.log('Debt record inserted successfully');
        },
        (error) => {
          console.error('Error inserting debt record:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};


export type Sale = {
  id: number;
  product: string;
  gasSize: string | null;
  quantity: number;
  price: number;
  date: string; // ISO string or date format
  saleType: 'cash' | 'debt';
};

export const fetchTodaysSales = async (): Promise<Sale[]> => {
  try {
    const database = await db;
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM sales WHERE date LIKE ?;`,
          [`${currentDate}%`],
          (tx, results) => {
            const sales: Sale[] = [];
            for (let i = 0; i < results.rows.length; i++) {
              sales.push(results.rows.item(i));
            }
            resolve(sales);
          },
          (error) => {
            console.error('Error fetching today\'s sales:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error opening database:', error);
    return [];
  }
};

// Fetching a user by role
export const fetchUserByRole = async (role: string): Promise<User | null> => {
  try {
    const database = await db;
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM users WHERE role = ?;`,
          [role],
          (tx, results) => {
            const rows = results.rows;
            if (rows.length > 0) {
              const user = rows.item(0) as User; // Cast the result to User type
              resolve(user); // Return the first matching user
            } else {
              resolve(null); // No user found
            }
          },
          (error) => {
            console.error('Error fetching user:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

// Fetch all sales sorted by date
export const fetchAllSales = async (): Promise<Sale[]> => {
  try {
      const database = await db; // Assuming db is correctly initialized
      return new Promise<Sale[]>((resolve, reject) => {
          database.transaction(tx => {
              tx.executeSql(
                  `SELECT * FROM sales ORDER BY date DESC;`, // Fetch sales sorted by date
                  [],
                  (tx, results) => {
                      const sales: Sale[] = [];
                      for (let i = 0; i < results.rows.length; i++) {
                          sales.push(results.rows.item(i));
                      }
                      resolve(sales);
                  },
                  (error) => {
                      console.error('Error fetching sales from database:', error);
                      reject(error);
                  }
              );
          });
      });
  } catch (error) {
      console.error('Error opening database:', error);
      throw error; // Rethrow error for handling
  }
};

// Delete a sale by its ID
export const deleteSaleById = async (saleId: number): Promise<void> => {
  try {
      const database = await db;
      return new Promise<void>((resolve, reject) => {
          database.transaction(tx => {
              tx.executeSql(
                  `DELETE FROM sales WHERE id = ?;`,
                  [saleId],
                  () => {
                      console.log(`Sale with ID ${saleId} deleted successfully`);
                      resolve();
                  },
                  (error) => {
                      console.error('Error deleting sale record:', error);
                      reject(error);
                  }
              );
          });
      });
  } catch (error) {
      console.error('Error opening database:', error);
      throw error;
  }
};



// Function to initialize the database (create tables and insert default user)
export const initializeDatabase = async () => {
  await createUsersTable();
  await insertDefaultUsers();
  await createSalesTable();
  await createDebtsTable();
  await createShopsTable();
  await createProductsTable();
};

export default db;
