import jwt from 'jsonwebtoken';
import { addUser,authenticateUser } from '../models/auth.model.js';

export const signup = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const userId = await addUser(username, password);
      const token = jwt.sign({ id: userId, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
      res.status(500).json({ message: `Error signing up: ${err.message}` });
    }
  };
  
  export const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await authenticateUser(username, password);
      const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      res.status(401).json({ message: `Authentication failed: ${err.message}` });
    }
  };