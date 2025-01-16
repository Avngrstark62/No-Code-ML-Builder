import client from '../config/db.js';
import bcrypt from 'bcrypt';

// Add a new user
export const addUser = async (username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;';
    const values = [username, hashedPassword];
    const result = await client.query(query, values);
    return result.rows[0].id; // Return the new user's ID
  } catch (err) {
    throw new Error(`Error adding user: ${err.message}`);
  }
};

// Find a user by username and verify the password
export const authenticateUser = async (username, password) => {
    const query = 'SELECT * FROM users WHERE username = $1;';
    const values = [username];
  
    const result = await client.query(query, values);
    if (result.rows.length === 0) throw new Error('Invalid username or password');
  
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) throw new Error('Invalid username or password');
    return user; // Return user data if authentication succeeds
  };