import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg; // Destructure Client from pg

const client = new Client({
  user: process.env.PG_USER,        // PostgreSQL username
  host: process.env.PG_HOST,        // PostgreSQL host
  database: process.env.PG_DATABASE, // PostgreSQL database name
  password: process.env.PG_PASSWORD, // PostgreSQL password
  port: process.env.PG_PORT || 5432, // Default PostgreSQL port
});

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('PostgreSQL Connected:', client.host);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default client;