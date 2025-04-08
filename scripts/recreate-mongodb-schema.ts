import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { DB_CONFIG } from '../src/config/db.config';

dotenv.config({ path: '../.env' });

// Define a type for MongoDB errors
interface MongoDBError extends Error {
  code?: number;
}

async function createIndexes() {
  try {
    // Connect to MongoDB using the configuration
    console.log('Attempting to connect to MongoDB...');
    console.log('Database Name:', DB_CONFIG.name);
    
    await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: DB_CONFIG.name
    });
    
    console.log('Connected to MongoDB');
    console.log(`Using database: ${mongoose.connection.db?.databaseName}`);

    // Drop existing collections if they exist
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const collections = await db.collections();
    for (const collection of collections) {
      await collection.drop().catch(err => {
        console.warn(`Failed to drop collection ${collection.collectionName}:`, err.message);
      });
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        code: (error as MongoDBError).code,
        name: error.name,
        stack: error.stack
      });
    } else {
      console.error('Unknown error type:', error);
    }
    
    await mongoose.disconnect().catch(console.error);
    process.exit(1);
  }
}

createIndexes();
