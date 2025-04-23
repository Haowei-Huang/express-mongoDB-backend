import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.MONGODB_URL;

// Validate connection string
if (!connectionString) {
    throw new Error('Please provide MONGODB_URL in your .env file');
}

const client = new MongoClient(connectionString);
let conn;

try {
    conn = await client.connect();
} catch (e) {
    console.error(e);
}

let db = conn.db("Node-API");

export default db;