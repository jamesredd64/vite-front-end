require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

async function migrateCalendarEvents() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        const collection = db.collection('calendar_events');

        // First, add auth0Id field based on existing userId
        const result = await collection.updateMany(
            { 
                userId: { $exists: true },
                auth0Id: { $exists: false }  // Only update documents without auth0Id
            },
            [
                { 
                    $set: { 
                        auth0Id: {
                            $cond: {
                                if: { $regexMatch: { input: "$userId", regex: /^auth0\|/ } },
                                then: "$userId",
                                else: { $concat: ["auth0|", "$userId"] }
                            }
                        }
                    }
                }
            ]
        );

        console.log(`Added auth0Id to ${result.modifiedCount} documents`);

        // Verify the migration
        const verificationResults = await collection.find({}, { 
            projection: { 
                userId: 1,
                auth0Id: 1
            } 
        }).limit(5).toArray();
        
        console.log('Sample of updated documents:', JSON.stringify(verificationResults, null, 2));

        // Optional: Create an index on auth0Id
        await collection.createIndex({ auth0Id: 1 });
        console.log('Created index on auth0Id field');

    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

migrateCalendarEvents().catch(console.error);


