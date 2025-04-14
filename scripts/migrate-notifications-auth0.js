import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import dbConfig from '../src/config/db.config';

dotenv.config({ path: '../.env' });

const migrateNotifications = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbConfig.url, {
      ...dbConfig.options,
      dbName: dbConfig.database
    });
    console.log(`Connected to MongoDB database: ${dbConfig.database}`);

    const db = mongoose.connection;
    const notificationsCollection = db.collection('notifications');

    // Add auth0Id field to all documents
    const result = await notificationsCollection.updateMany(
      { auth0Id: { $exists: false } },
      [
        {
          $set: {
            auth0Id: {
              $cond: {
                if: { $regexMatch: { input: "$createdBy", regex: /^auth0\|/ } },
                then: "$createdBy",
                else: { $concat: ["auth0|", "$createdBy"] }
              }
            }
          }
        }
      ]
    );

    console.log(`Updated ${result.modifiedCount} notifications with auth0Id field`);

    // Verify some updated documents
    const sampleUpdated = await notificationsCollection.find(
      { auth0Id: { $exists: true } }
    ).limit(5).toArray();

    console.log('Sample of updated notifications:');
    console.log(JSON.stringify(sampleUpdated, null, 2));

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

migrateNotifications().catch(console.error);