// src/database.ts
import SQLite from 'react-native-sqlite-storage';

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


export type User = {
  id: number;
  role: string;
  password: string;
};

// Function to fetch a user by role
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

// Function to view all users in the 'users' table
export const viewAllUsers = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM users;`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let users = [];
          for (let i = 0; i < rows.length; i++) {
            users.push(rows.item(i));
          }
          console.log('All Users:', users);
        },
        (error) => {
          console.error('Error fetching all users:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// Function to initialize the database (create table and insert default user)
export const initializeDatabase = async () => {
  await createUsersTable();
  await insertDefaultUser();
};

export default db;
