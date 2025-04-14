import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import dbConfig from '../src/config/db.config.ts';

dotenv.config({ path: '../.env' });

// Use the database configuration from db.config.js
const { url, database, options } = dbConfig;

// Define the schemas
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['all', 'selected'], 
    default: 'all' 
  },
  recipients: [{ type: String }],
  sentUserProfilePic: { type: String },
  read: [{
    userId: { type: String, required: true },
    readAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const notificationPreferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: Boolean, default: true },
  push: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  categories: {
    marketing: { type: Boolean, default: true },
    system: { type: Boolean, default: true },
    updates: { type: Boolean, default: true }
  },
  frequency: {
    type: String,
    enum: ['immediate', 'daily', 'weekly'],
    default: 'immediate'
  },
  quietHours: {
    enabled: { type: Boolean, default: false },
    start: String,
    end: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

async function createCollections() {
  try {
    // Connect using the configuration from db.config.js
    await mongoose.connect(url, {
      ...options,
      dbName: database // Explicitly set the database name
    });
    console.log(`Connected to MongoDB database: ${database}`);

    // Create models
    const Notification = mongoose.model('Notification', notificationSchema);
    const NotificationPreferences = mongoose.model('NotificationPreferences', notificationPreferencesSchema);

    // Drop existing collections if they exist
    try {
      await mongoose.connection.collection('notifications').drop();
      await mongoose.connection.collection('notificationpreferences').drop();
      console.log('Existing collections dropped');
    } catch (err) {
      console.log('No existing collections to drop');
    }

    // Create indexes
    await Notification.collection.createIndex({ createdAt: -1 });
    await Notification.collection.createIndex({ recipients: 1 });
    await Notification.collection.createIndex({ type: 1 });
    await NotificationPreferences.collection.createIndex({ userId: 1 }, { unique: true });

    // Insert sample data
    const sampleNotifications = [
      {
        title: "Welcome to the Platform",
        message: "Thank you for joining! Here's what you need to know to get started...",
        type: "all",
        recipients: [],
        read: [{
          userId: "auth0|67bb70c5eedb5c4b0ea1ec93",
          readAt: new Date()
        }],
        createdBy: "auth0|system"
      },
      {
        title: "Your Campaign Results",
        message: "Your recent marketing campaign has achieved 150% ROI...",
        type: "selected",
        recipients: ["auth0|67bb70c5eedb5c4b0ea1ec93"],
        read: [],
        createdBy: "auth0|admin"
      }
    ];

    const samplePreferences = {
      userId: "auth0|67bb70c5eedb5c4b0ea1ec93",
      email: true,
      push: true,
      sms: false,
      categories: {
        marketing: true,
        system: true,
        updates: true
      },
      frequency: "immediate",
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "07:00"
      }
    };

    await Notification.insertMany(sampleNotifications);
    await NotificationPreferences.create(samplePreferences);

    console.log('Collections created and sample data inserted');
    console.log('Indexes created');

    // Verify
    const notificationCount = await Notification.countDocuments();
    const preferencesCount = await NotificationPreferences.countDocuments();
    
    console.log(`Notifications in database: ${notificationCount}`);
    console.log(`Preferences in database: ${preferencesCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createCollections().catch(console.error);
