const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');
require('dotenv').config();

async function verifyAdminSettings() {
  try {
    await mongoose.connect(dbConfig.url, {
      ...dbConfig.options,
      dbName: dbConfig.database
    });
    console.log(`Connected to MongoDB database: ${dbConfig.database}`);

    const db = mongoose.connection.db;
    const collection = db.collection('adminsettings');

    const settings = await collection.findOne({});
    
    if (!settings) {
      console.log('No settings document found');
      return;
    }

    console.log('\nDocument structure:');
    console.log(JSON.stringify(settings, null, 2));

    console.log('\nRole-based access details:');
    settings.roleBasedAccess.forEach((role, index) => {
      console.log(`\nRole ${index + 1}: ${role.role}`);
      console.log('Permissions:', Object.keys(role.permissions));
      
      for (const [key, value] of Object.entries(role.permissions)) {
        console.log(`\n  ${key}:`);
        console.log(`    Name: ${value.name}`);
        console.log(`    Description: ${value.description}`);
        console.log(`    Access:`, value.access);
      }
      
      console.log('\n  Features:', role.features);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

verifyAdminSettings().catch(console.error);


