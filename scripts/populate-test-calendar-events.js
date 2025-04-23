require('dotenv').config();
const { MongoClient } = require('mongodb');
const dbConfig = require('../config/db.config.js');

const testEvents = [
    {
        auth0Id: "auth0|67bb70c5eedb5c4b0ea1ec93",
        title: "Team Meeting",
        start: new Date("2024-03-25T10:00:00Z"),
        end: new Date("2024-03-25T11:00:00Z"),
        allDay: false,
        extendedProps: {
            calendar: "primary",
            description: "Weekly team sync"
        }
    },
    {
        auth0Id: "auth0|67bb70c5eedb5c4b0ea1ec93",
        title: "Project Review",
        start: new Date("2024-03-26T14:00:00Z"),
        end: new Date("2024-03-26T15:00:00Z"),
        allDay: false,
        extendedProps: {
            calendar: "success",
            description: "Q1 project review"
        }
    }
];

async function populateTestData() {
    const client = new MongoClient(dbConfig.url, dbConfig.options);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        console.log('Database:', dbConfig.database);
        
        const db = client.db(dbConfig.database);
        const collection = db.collection('calendar_events');

        // Insert test events
        const result = await collection.insertMany(testEvents);
        console.log(`Inserted ${result.insertedCount} test events`);

        // Show inserted documents
        const documents = await collection.find().toArray();
        console.log('\nInserted documents:');
        console.log(JSON.stringify(documents, null, 2));

        // Show collection stats
        const stats = await collection.stats();
        console.log('\nCollection statistics:');
        console.log(`- Document count: ${stats.count}`);
        console.log(`- Total size: ${stats.size} bytes`);

    } catch (error) {
        console.error('Error:', error);
        console.error('Stack trace:', error.stack);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

if (require.main === module) {
    populateTestData().catch(console.error);
}