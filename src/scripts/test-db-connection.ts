import mongoose from 'mongoose';
import dbConfig from '../server/src/config/db.config';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URL:', dbConfig.url);
    console.log('Database Name:', dbConfig.database);

    await mongoose.connect(dbConfig.url, {
      dbName: dbConfig.database
    });

    console.log('Successfully connected to MongoDB');

    // Get database information
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(c => console.log(`- ${c.name}`));

    // Get calendar events collection info
    const calendarEvents = await db.collection('calendar_events').find().limit(1).toArray();
    console.log('\nSample calendar event:');
    console.log(JSON.stringify(calendarEvents[0], null, 2));

    // Get collection stats
    const stats = await db.collection('calendar_events').stats();
    console.log('\nCalendar Events Collection Stats:');
    console.log(`- Document Count: ${stats.count}`);
    console.log(`- Total Size: ${stats.size} bytes`);
    console.log(`- Average Document Size: ${stats.avgObjSize} bytes`);

  } catch (error) {
    console.error('Database connection test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testConnection();