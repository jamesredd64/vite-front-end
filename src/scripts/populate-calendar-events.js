require('dotenv').config();
const mongoose = require('mongoose');
const CalendarEvent = require('../models/calendar.model');
const testData = require('../data/testCalendarEvents.json');

async function populateCalendarEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing calendar events
    await CalendarEvent.deleteMany({});
    console.log('Cleared existing calendar events');

    // Insert test events
    const result = await CalendarEvent.insertMany(testData.events);
    console.log(`Inserted ${result.length} calendar events`);

    // Verify insertion
    const count = await CalendarEvent.countDocuments();
    console.log(`Total calendar events in database: ${count}`);

    // Display sample of inserted documents
    const sample = await CalendarEvent.find().limit(2);
    console.log('Sample of inserted documents:', JSON.stringify(sample, null, 2));

  } catch (error) {
    console.error('Error populating calendar events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateCalendarEvents();