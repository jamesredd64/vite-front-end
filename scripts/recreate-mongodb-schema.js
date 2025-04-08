const mongoose = require('mongoose');
const dbConfig = require('../config/db.config.js');
require('dotenv').config();

async function recreateDatabase() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Database Name:', dbConfig.database);
    
    await mongoose.connect(dbConfig.url, {
      ...dbConfig.options,
      dbName: dbConfig.database
    });
    
    console.log('Connected to MongoDB');
    console.log(`Using database: ${mongoose.connection.db.databaseName}`);

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

    console.log('All collections dropped successfully');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    
    await mongoose.disconnect().catch(console.error);
    process.exit(1);
  }
}

recreateDatabase();