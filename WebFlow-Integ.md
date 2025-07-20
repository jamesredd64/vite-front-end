# Webflow Integration for Token and Event Fields

## JavaScript to Fetch Token and Populate Hidden Fields

This script fetches a token from the backend on page load and populates hidden fields `xval`, `eventName`, and `eventLocation` in the Webflow form.

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Fetch token from backend
  fetch('https://your-backend-domain/api/forms/register-token')
  // https://admin-backend-eta.vercel.app/api/forms/register-token
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        // Set token to hidden field named 'xval'
        let tokenField = document.querySelector('input[name="xval"]');
        if (!tokenField) {
          const form = document.querySelector('form');
          tokenField = document.createElement('input');
          tokenField.type = 'hidden';
          tokenField.name = 'xval';
          form.appendChild(tokenField);
        }
        tokenField.value = data.token;
      }
    })
    .catch(error => {
      console.error('Error fetching token:', error);
    });

  // Populate eventName and eventLocation hidden fields from page HTML
  const eventNameValue = document.querySelector('.event-name')?.textContent || '';
  const eventLocationValue = document.querySelector('.event-location')?.textContent || '';

  let eventNameField = document.querySelector('input[name="eventName"]');
  if (!eventNameField) {
    const form = document.querySelector('form');
    eventNameField = document.createElement('input');
    eventNameField.type = 'hidden';
    eventNameField.name = 'eventName';
    form.appendChild(eventNameField);
  }
  eventNameField.value = eventNameValue;

  let eventLocationField = document.querySelector('input[name="eventLocation"]');
  if (!eventLocationField) {
    const form = document.querySelector('form');
    eventLocationField = document.createElement('input');
    eventLocationField.type = 'hidden';
    eventLocationField.name = 'eventLocation';
    form.appendChild(eventLocationField);
  }
  eventLocationField.value = eventLocationValue;
});
```

## Notes

- Replace `'https://your-backend-domain/api/forms/register-token'` with your actual backend URL.
- The script assumes the event name and location are available in elements with classes `.event-name` and `.event-location` respectively. Adjust selectors as needed.
- This script should be included in the Webflow page where the form is present.
