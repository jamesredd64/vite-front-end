const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');
require('dotenv').config();

async function populateAdminSettings() {
  try {
    // Explicitly log the database name we're connecting to
    console.log('Attempting to connect to database:', dbConfig.database);
    
    await mongoose.connect(dbConfig.url, {
      ...dbConfig.options,
      dbName: dbConfig.database // Explicitly set the database name
    });
    
    console.log(`Connected to MongoDB database: ${mongoose.connection.db.databaseName}`);

    const db = mongoose.connection.db;
    const collection = db.collection('adminsettings');

    // Log the current database name and collection
    console.log('Current database:', db.databaseName);
    console.log('Target collection:', collection.collectionName);

    // Delete existing documents
    await collection.deleteMany({});
    console.log('Cleared existing settings');

    // New document with all required fields
    const newSettings = {
      roleBasedAccess: [
        {
          role: "admin",
          permissions: {
            dashboard: {
              name: "Dashboard Access",
              description: "Access to main dashboard",
              access: {
                read: true,
                write: true,
                delete: false
              }
            },
            users: {
              name: "User Management",
              description: "Manage system users",
              access: {
                read: true,
                write: true,
                delete: true
              }
            },
            settings: {
              name: "System Settings",
              description: "Manage system configuration",
              access: {
                read: true,
                write: true,
                delete: true
              }
            }
          },
          features: ["dashboard", "users", "settings"]
        },
        {
          role: "user",
          permissions: {
            dashboard: {
              name: "Dashboard Access",
              description: "Limited dashboard access",
              access: {
                read: true,
                write: false,
                delete: false
              }
            }
          },
          features: ["dashboard"]
        }
      ],
      emailTemplates: {
        invitation: "Welcome to our platform! Click here to get started: {{inviteLink}}",
        reminder: "Don't forget about your upcoming event: {{eventDetails}}",
        welcome: "Thanks for joining! Here's what you need to know: {{welcomeInfo}}"
      },
      security: {
        sessionTimeout: 3600,
        maxLoginAttempts: 5,
        passwordPolicy: {
          minLength: 8,
          requireSpecialChar: true,
          requireNumber: true,
          requireUppercase: true
        }
      },
      calendar: {
        showAllEvents: false,
        defaultView: "week",
        workingHours: {
          start: "09:00",
          end: "17:00"
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the document
    const result = await collection.insertOne(newSettings);
    console.log('Settings document inserted with ID:', result.insertedId);

    // Verify the insertion
    const savedDoc = await collection.findOne({ _id: result.insertedId });
    console.log('\nVerifying saved document structure:');
    console.log('- Document ID:', savedDoc._id);
    console.log('- Number of roles:', savedDoc.roleBasedAccess.length);
    console.log('- Database:', mongoose.connection.db.databaseName);
    
    console.log('\nRole permissions:');
    savedDoc.roleBasedAccess.forEach((role, index) => {
      console.log(`\nRole ${index + 1}: ${role.role}`);
      console.log('Permissions:', Object.keys(role.permissions));
      console.log('Features:', role.features);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    console.error('Database config:', {
      url: dbConfig.url,
      database: dbConfig.database,
      options: dbConfig.options
    });
    await mongoose.disconnect();
    process.exit(1);
  }
}

populateAdminSettings().catch(console.error);

