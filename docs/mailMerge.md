Step-by-Step Implementation
1️⃣ Define the Available Tags (User Fields)
Create a list of available tags:

typescript
const availableTags = [
  "{{firstName}}",
  "{{lastName}}",
  "{{title}}",
  "{{email}}",
];
2️⃣ Track the Focused Input Field
Use a state variable to track which input field is currently focused:

typescript
const [activeInput, setActiveInput] = useState<"subject" | "body" | null>(null);
Attach onFocus events to both fields:

typescript
<input
  type="text"
  id="subject"
  value={subject}
  onFocus={() => setActiveInput("subject")}
  onChange={(e) => setSubject(e.target.value)}
/>

<textarea
  id="body"
  value={body}
  onFocus={() => setActiveInput("body")}
  onChange={(e) => setBody(e.target.value)}
></textarea>
3️⃣ Insert Tags at Cursor Position
When a tag is clicked, insert it into the currently active input:

typescript
const handleTagInsert = (tag: string) => {
  if (!activeInput) return; // Ensure an input is focused

  const updateValue = (value: string) => {
    const selectionStart = document.getElementById(activeInput)?.selectionStart || 0;
    return value.slice(0, selectionStart) + tag + value.slice(selectionStart);
  };

  if (activeInput === "subject") {
    setSubject((prev) => updateValue(prev));
  } else if (activeInput === "body") {
    setBody((prev) => updateValue(prev));
  }
};
Render tag cloud buttons:

typescript
<div className="tag-cloud">
  {availableTags.map((tag) => (
    <button key={tag} onClick={() => handleTagInsert(tag)}>
      {tag}
    </button>
  ))}
</div>
4️⃣ useEffect to Preview Example User Data
Replace tags with actual values from the selected user:


useEffect(() => {
  if (!selectedUsers.length) return;

  const exampleUser = allUsers[0] || {}; // Use first selected user for preview
  const replaceMergeFields = (template: string) => {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key) => exampleUser[key] || `{{${key}}}`);
  };

  setSubject(replaceMergeFields(subject));
  setBody(replaceMergeFields(body));
}, [selectedUsers]);
✅ Ensures admins see a preview of what will be sent!

🎯 Summary
🚀 Tag cloud above input fields for easy selection 🚀 Clicking a tag inserts it into the currently focused input 🚀 Real-time preview replaces merge fields with actual user data

Would you like me to refine any part of this approach further? 😎 Hope this helps, James!

For actual email sending update:
const handleSendEmail = async () => {
  if (selectedUsers.length === 0) {
    setMessage('Please select at least one user.');
    return;
  }
  if (!subject || !body) {
    setMessage('Please enter both subject and body.');
    return;
  }

  setIsSending(true);
  setMessage(null);

  try {
    const emails = allUsers.map(user => {
      // Replace merge fields for each user's email content
      const processedSubject = replaceMergeFields(subject, { firstName: user.firstName, inviteLink: 'https://example.com/invite' });
      const processedBody = replaceMergeFields(body, { firstName: user.firstName, inviteLink: 'https://example.com/invite' });

      return {
        email: user.email,
        subject: processedSubject,
        body: processedBody
      };
    });

    console.log('Sending emails:', emails);

    await EmailService.sendBulkEmails(emails);
    
    setMessage('Emails sent successfully!');
    setSelectedUsers([]);
    setAllUsers([]);
    setSubject('');
    setBody('');
    setUseTemplate(false);
    setSelectedTemplateKey('');
  } catch (error: any) {
    setMessage(`Failed to send emails: ${error.message || 'Unknown error'}`);
    console.error('Error sending emails:', error);
  } finally {
    setIsSending(false);
  }
};


<!-- Responsive Email: -->
const generateResponsiveEmail = (body: string) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: auto; }
          @media screen and (max-width: 480px) {
            body { width: 100% !important; padding: 10px; }
          }
        </style>
      </head>
      <body class="email-container">
        ${body}
      </body>
    </html>
  `;
};

// Before sending
const processedBody = generateResponsiveEmail(replaceMergeFields(body, { firstName: user.firstName }));
await EmailService.sendBulkEmails(selectedUsers, subject, processedBody);
