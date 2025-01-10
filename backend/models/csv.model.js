import client from '../config/db.js';
import bcrypt from 'bcrypt';  // Ensure you are importing the PostgreSQL client

export const createTableForFile = async (fileName, columns) => {
  // Constructing the SQL query dynamically
  let columnDefs = columns.map(column => `${column} TEXT`).join(", ");
  const query = `
    CREATE TABLE IF NOT EXISTS ${fileName} (
      id SERIAL PRIMARY KEY,
      ${columnDefs}
    );
  `;

  await client.query(query);
};

export const saveCsvDataToTable = async (fileName, data) => {
  // Extract the columns from the first row of data (the headers)
  const columns = Object.keys(data[0]);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
  const query = `
    INSERT INTO ${fileName} (${columns.join(", ")})
    VALUES (${placeholders});
  `;

  // Insert each row of data into the table
  for (let row of data) {
    const values = columns.map((column) => row[column]);
    await client.query(query, values);
  }
};

export const getCsvData = async (fileName) => {
  try {
    // Query data from the table named after the fileName
    const query = `SELECT * FROM ${fileName} LIMIT 50;`;
    const result = await client.query(query);

    // Return the full data
    return result.rows; 
  } catch (err) {
    throw new Error(`Error fetching data from table "${fileName}": ${err.message}`);
  }
};

// Fetch table names from the PostgreSQL database
export const getTableNames = async () => {
  try {
    const query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"; // Query to get table names
    const result = await client.query(query);
    return result.rows.map(row => row.table_name); // Return the table names
  } catch (err) {
    throw new Error('Error fetching table names from PostgreSQL: ' + err.message);
  }
};

// Function to delete a table
export const deleteTableFromDatabase = async (tableName) => {
  try {
    // Validate table name (prevent SQL injection)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
      throw new Error("Invalid table name");
    }

    const query = `DROP TABLE IF EXISTS "${tableName}";`; // Use double quotes for case-sensitive table names
    await client.query(query);
  } catch (err) {
    throw new Error(`Error deleting table "${tableName}": ${err.message}`);
  }
};

// export const assignFileToUser = async (userId, tableId) => {
//   const query = 'UPDATE users SET table_ids = array_append(table_ids, $1) WHERE id = $2;';
//   const values = [tableId, userId];

//   await client.query(query, values);
// };

export const assignFileToUser = async (userId, tableId) => {
  const query = 'UPDATE users SET table_ids = array_append(table_ids, $1) WHERE id = $2;';
  const values = [tableId, userId];

  try {
    const result = await client.query(query, values);
    console.log('File assigned to user:', result);
  } catch (error) {
    console.error('Error in assignFileToUser:', error);
    throw new Error('Error assigning file to user');
  }
};

export const getUserFiles = async (userId) => {
  const query = 'SELECT table_ids FROM users WHERE id = $1;';
  const values = [userId];

  const result = await client.query(query, values);
  return result.rows[0].table_ids || [];
};