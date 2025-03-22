const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://jredd2013:X9iwELRRwqCCb7kc@mern-cluster.oistpfp.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'your_database_name'; // Replace with your database name

async function migrateCalendarEvents() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('mongo-users-react');
        const db = client.db(dbName);
        const collection = db.collection('calendar_events');

        // Perform the migration
        const result = await collection.updateMany(
            { auth0Id: { $exists: false } },
            [
                { 
                    $addFields: { 
                        auth0Id: "$userId"
                    } 
                }
            ]
        );

        console.log(`Modified ${result.modifiedCount} documents`);

        // Verify the migration
        const verificationResults = await collection.find({}, { projection: { auth0Id: 1, userId: 1 } }).limit(5).toArray();
        console.log('Sample of updated documents:', verificationResults);

    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

migrateCalendarEvents().catch(console.error);


