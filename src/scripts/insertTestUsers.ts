import { UserModel } from '../../server/src/models/user';
import mongoose from 'mongoose';
import dbConfig from '../../server/src/config/db.config.js';

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.url, {
      dbName: dbConfig.database
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};

const insertTestUsers = async () => {
  try {
    await connectDB();
    
    const testUsers = [
      {
        firstName: 'James',
        lastName: 'Redd',
        email: 'jameshredd@outlook.com',
        phoneNumber: '555-012-1515',
        profile: {
          dateOfBirth: new Date('1964-02-02'),
          gender: 'Male',
          profilePictureUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
          marketingBudget: {
            amount: 15000,
            frequency: 'monthly',
            adCosts: 7500
          }
        },
        address: {
          street: '123 Tech Lane',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          country: 'USA'
        },
        isActive: true
      }
      // ... other test users
    ];

    for (const userData of testUsers) {
      await UserModel.findOneAndUpdate(
        { email: userData.email },
        userData,
        { upsert: true, new: true }
      );
      console.log(`Inserted/Updated user: ${userData.email}`);
    }

    console.log('Test users inserted successfully');
  } catch (error) {
    console.error('Error inserting test users:', error);
  } finally {
    await disconnectDB();
  }
};

insertTestUsers();