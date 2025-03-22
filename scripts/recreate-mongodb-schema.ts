import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
// import { fileURLToPath } from 'url';


dotenv.config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database';

// Define the schemas
const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profile: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    avatar: String,
    bio: String,
    title: String,
    company: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  marketingBudget: {
    frequency: {
      type: String,
      enum: ['daily', 'monthly', 'quarterly', 'yearly']
    },
    adBudget: Number,
    costPerAcquisition: Number,
    dailySpendingLimit: Number,
    marketingChannels: String,
    monthlyBudget: Number,
    preferredPlatforms: String,
    notificationPreferences: [String],
    roiTarget: Number
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const calendarEventSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date },
  allDay: { type: Boolean, default: false },
  extendedProps: {
    calendar: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Define indexes
async function createIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop existing collections if they exist
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    // Create User model
    const User = mongoose.model('User', userSchema);
    const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

    // Create indexes
    await User.collection.createIndex({ auth0Id: 1 }, { unique: true });
    console.log('Created index on auth0Id');

    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Created index on email');

    await User.collection.createIndex({ 'profile.firstName': 1, 'profile.lastName': 1 });
    console.log('Created index on name fields');

    await User.collection.createIndex({ createdAt: 1 });
    console.log('Created index on createdAt');

    await User.collection.createIndex({ updatedAt: 1 });
    console.log('Created index on updatedAt');

    await CalendarEvent.collection.createIndex({ auth0Id: 1 });
    console.log('Created index on auth0Id for CalendarEvent');

    console.log('All indexes created successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
createIndexes().catch(console.error);
