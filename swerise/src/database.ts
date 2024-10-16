import SQLite from 'react-native-sqlite-storage';

// Define the User type
export type User = {
  id: number;
  role: string;
  password: string;
};

// Enable debugging for development
SQLite.enablePromise(true);
SQLite.DEBUG(true);

// Open the database or create it if it doesn't exist
const db = SQLite.openDatabase({ name: 'swerise.db', location: 'default' });

// Function to create the 'users' table
const createUsersTable = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          role TEXT,
          password TEXT
        );`,
        [],
        () => {
          console.log('Users table created successfully');
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

// Function to create the 'sales' table
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

// Function to create the 'debts' table
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

// Function to insert debt information for a sale
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

// Function to insert default user information into the 'users' table
const insertDefaultUser = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      // Insert default owner
      tx.executeSql(
        `INSERT OR IGNORE INTO users (role, password) VALUES (?, ?);`,
        ['owner', '1234'],
        () => {
          console.log('Default owner inserted successfully');
        },
        (error) => {
          console.error('Error inserting default owner:', error);
        }
      );

      // Insert default employee
      tx.executeSql(
        `INSERT OR IGNORE INTO users (role, password) VALUES (?, ?);`,
        ['employee', '1234'],
        () => {
          console.log('Default employee inserted successfully');
        },
        (error) => {
          console.error('Error inserting default employee:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error opening database:', error);
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



// Function to initialize the database (create tables and insert default user)
export const initializeDatabase = async () => {
  await createUsersTable();
  await createSalesTable();
  await createDebtsTable();
  await insertDefaultUser();
};

export default db;
