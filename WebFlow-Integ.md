Step-by-Step Webflow Webhook Setup
1. Navigate to Webflow Project Settings
Open your Webflow dashboard.

Select the project where your form is located.

Click on Project Settings in the top navigation.

2. Open the Webhooks Section
In Project Settings, go to the Integrations tab.

Scroll down until you find the Webhooks section.

3. Create a Webhook
Click "Add Webhook".

Choose the event type "Form Submission" (this triggers the webhook when a form is submitted).

4. Enter Your Webhook URL
This is the URL of your backend API where Webflow will send form data.

 https://admin-backend-eta.vercel.app/api/forms/submit-form, enter that URL.

 I reccomend adding your form to a temp page so as not to interrupt the real form until all kinks are worked out. 

5. Test the Webhook
Submit the form on your Webflow site.

Let me know when you submit a test form submission so i can check it on the be and the db.

Webflow automatically stores form submissions inside its Forms section under Project Settings → Forms.
So you will also retain the form data submitted by the user. 

You will need to create an event as soon as possible to the integration so the server has the right event info to generate the ical and email. Also, I need you to give me the exact wording you want to send in the email so i can update that part. Currently it's not dynamic for what the email reads but later we can integrate that part into the ui so you can set it there for each event if you want or all events.

I will work on getting you access to the db over at Atlas Cloud in case you want it but you will still have the app in admin mode only to see what events and to what users and when the event invitation was sent, etc. 

I created a new page, routes, and all required code today to handle this.

Let me know if you have any issues. 

Love Yall, Dad

-----------------------------------

Check your backend server logs or use a tool like Postman to inspect incoming requests.

Webflow sends data as a JSON payload, typically structured like this:

json
{
  "data": {
    "name": "James",
    "email": "james@example.com",
    "message": "Hello, this is a test!"
  }
}
6. Process Webflow Data in Your Backend
In your backend (Node.js example):

javascript
app.post('/submit-form', async (req, res) => {
  console.log('Received Webflow form submission:', req.body);
  // Process and store data in MongoDB
});
Would you like help setting up error handling or authentication for the webhook?

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const formRoutes = require('./routes/formRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/webflow_forms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

// Routes
app.use('/api/forms', formRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));


const express = require('express');
const { submitForm } = require('../controllers/formController');

const router = express.Router();

router.post('/submit-form', submitForm);

module.exports = router;


const Form = require('../models/formModel');

const submitForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newForm = new Form({ name, email, message });
    await newForm.save();

    res.status(200).json({ success: true, data: newForm });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { submitForm };


const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);


## WebFlow Secret
To get a WEBFLOW_SECRET, you need to generate an API key from Webflow, which you can then use as your secret token for authentication. Here's how:

1. Access Webflow API Settings
Log in to your Webflow account.

Open the Project Settings for the site you want to integrate.

Navigate to the Integrations tab.

2. Generate an API Key
Scroll down to the API Access section.

Click Generate New API Key (Webflow will provide a long string).

Copy and save the key somewhere secure—you won’t be able to view it again after creation.

3. Store the Key Securely
Add it to your .env file in your backend:

WEBFLOW_SECRET=your_generated_api_key
Make sure your environment file is listed in .gitignore to prevent leaks.

4. Use the API Key in Requests
Webflow allows you to authenticate requests using this token.

In your Express backend, verify the token:

javascript
const secretToken = req.headers['x-webflow-token'];
if (secretToken !== process.env.WEBFLOW_SECRET) {
  return res.status(403).json({ error: 'Unauthorized' });
}
Now Webflow will send requests securely to your backend, and only requests with the correct WEBFLOW_SECRET will be accepted. Would you like help testing API authentication? 🚀🔒

# Deployment

Webflow does not natively support hosting a Node.js backend, as it is primarily a frontend-focused platform for static websites and CMS-based solutions. However, you have several other options for hosting your Node.js server:

✅ Best Alternatives for Hosting Your Node.js Server
🟢 Vercel (Your Current Host)

Ideal for serverless functions but may not handle long-running processes well.

If you need persistent backend services, you may need another solution.

🔵 Render

Free tier available.

Supports always-on web services (great for APIs).

Super easy deployment—just connect to GitHub.

🟣 Railway

Fully managed infrastructure, auto-scaling capabilities.

Simple one-click deployment.

Database hosting included (supports MongoDB, PostgreSQL, etc.).

🟠 Fly.io

Runs containers close to your users, reducing latency.

Works well for apps that need global deployment.

🔴 DigitalOcean App Platform

Simple PaaS solution for Node.js apps.

Automatic scaling and supports persistent processes.

⚫ Heroku (Legacy but Still Works)

Free tier has limitations (e.g., app sleeps after inactivity).

Works best for small projects and prototypes.

🚀 Steps to Migrate from Vercel
Pick a hosting platform (Render, Railway, or Fly.io are great choices).

Push your code to GitHub/GitLab if not already there.

Connect the platform to your Git repo (most services support automatic deployments).

Set environment variables (like your database URLs and API keys).

Deploy! 🚀

Would you like detailed steps for deploying your Node.js app to Render or Railway?

# save form data and send to api

  Ways to Capture Form Data in Webflow
Use Webflow’s Built-in Form Submission

Webflow automatically stores form submissions inside its Forms section under Project Settings → Forms.

No extra setup needed—Webflow will save the data whenever a user submits a form.

## Enable Webflow Webhooks

### Send form submission to your Node.js backend AND store it inside Webflow at the same time.

### Set up a webhook in Webflow Settings → Integrations → Webhooks.

### Webflow sends a POST request containing the form data to your backend when someone submits.

### Use Webflow’s CMS Collection (For More Control)

### If you need custom storage inside Webflow, instead of just relying on Webflow’s basic form capture:

### Create a CMS collection (e.g., Form Submissions).

### Use Zapier or Make (formerly Integromat) to store form data inside Webflow while also posting it to your backend.

### Send Data to Both Webflow & Your Backend Using JavaScript

### Add custom JavaScript inside Webflow’s Embed Code Block:

```
document.querySelector('form').addEventListener('submit', async (event) => {
 const formData = new FormData(event.target);
 const jsonData = Object.fromEntries(formData.entries());

 // Send to Webflow CMS (Using Webflow API)
    await fetch('https://api.webflow.com/collections/YOUR_COLLECTION_ID/items', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields: jsonData })
    });

    // Send to your backend server
    await fetch('https://your-backend-url.com/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    });
});


```
