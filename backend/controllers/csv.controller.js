import fs from 'fs';
import csv from 'csv-parser';
import { saveCsvDataToTable, createTableForFile, getCsvData, getTableNames,deleteTableFromDatabase,assignFileToUser,getUserFiles} from '../models/csv.model.js';  // Updated imports
import jwt from 'jsonwebtoken';
import { addUser,authenticateUser } from '../models/authentication.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Upload and Parse CSV File
export const uploadCsv = async (req, res) => {
  const { file_name } = req.body;
  const results = [];
  const columns = new Set(); // To store unique column names dynamically
  if (!file_name) {
       return res.status(400).json({ message: 'File name is required' });
     }
  
  const userId = req.user.id;

  // Parse the CSV file and capture the columns
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
      // Capture the column names from the first row
      Object.keys(data).forEach((key) => columns.add(key));
    })
    .on('end', async () => {
      try {
        
        // Create the table dynamically based on the columns
        await createTableForFile(file_name, Array.from(columns));

        // Save the CSV data to the dynamically created table
        await saveCsvDataToTable(file_name, results);

        // Assign the table to the logged-in user
        await assignFileToUser(userId, file_name); // Assuming file_name is the table ID here
        
        res.status(200).json({ message: 'File uploaded and data saved successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error saving data', error });
      } finally {
        fs.unlinkSync(req.file.path); // Clean up uploaded file
      }
    });
};

// Fetch CSV Data from Database
export const fetchCsvData = async (req, res) => {
  const { fileName } = req.params; // Extract fileName from request parameters

  try {
    if (!fileName) {
      return res.status(400).json({ message: "File name is required" });
    }

    const csvData = await getCsvData(fileName); // Pass fileName to the model
    res.status(200).json(csvData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

export const fetchTableNames = async (req, res) => {
  const userId = req.user.id; // Get the logged-in user's ID from the token

  try {
    // Step 1: Get the table names from the database (all tables)
    const allTableNames = await getTableNames();

    // Step 2: Get the user's table IDs (i.e., the tables they have access to)
    const userTableIds = await getUserFiles(userId);

    // Step 3: Filter the table names to include only those the user has access to
    const accessibleTables = allTableNames.filter((tableName) =>
      userTableIds.includes(tableName)
    );

    res.status(200).json(accessibleTables); // Return the accessible tables
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table names', error: error.message });
  }
};

// Fetch All Table Names from Database
// export const fetchTableNames = async (req, res) => {
//   try {
//     const tableNames = await getTableNames();
//     res.status(200).json(tableNames);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching table names', error: error.message });
//   }
// };

// Delete Table
export const deleteTable = async (req, res) => {
  const { tableName } = req.params;

  try {
    // Call the model function to delete the table
    await deleteTableFromDatabase(tableName);

    // If successful, return a success message
    res.status(200).json({ message: `Table "${tableName}" deleted successfully.` });
  } catch (error) {
    // If an error occurs, return an error message
    res.status(500).json({ message: `Error deleting table "${tableName}"`, error: error.message });
  }
};



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