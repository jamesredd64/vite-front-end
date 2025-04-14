const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dbConfig = require('../config/db.config');

dotenv.config();

const migrateNotifications = async () => {
  try {
    await mongoose.connect(dbConfig.url, {
      ...dbConfig.options,
      dbName: dbConfig.database
    });
    console.log(`Connected to MongoDB database: ${dbConfig.database}`);

    const db = mongoose.connection;
    const notificationsCollection = db.collection('notifications');
    const usersCollection = db.collection('users');

    // Get all notifications
    const notifications = await notificationsCollection.find({}).toArray();
    console.log(`Found ${notifications.length} notifications to update`);

    let updatedCount = 0;
    for (const notification of notifications) {
      try {
        // Find the user who sent the notification
        const user = await usersCollection.findOne({ auth0Id: notification.createdBy });
        
        // Update the notification with the profile picture
        await notificationsCollection.updateOne(
          { _id: notification._id },
          { 
            $set: { 
              sentUserProfilePic: user?.profile?.profilePictureUrl || '' 
            } 
          }
        );
        updatedCount++;
        
        if (updatedCount % 10 === 0) {
          console.log(`Updated ${updatedCount}/${notifications.length} notifications...`);
        }
      } catch (err) {
        console.error(`Error updating notification ${notification._id}:`, err);
        continue;
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} notifications.`);

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

migrateNotifications().catch(console.error);
