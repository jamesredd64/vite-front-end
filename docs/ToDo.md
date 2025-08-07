# To Do

## On Event Calendar when no events to display we are currently showing a small text saying that in black text. This needs to be enhanced

## UserManagement - For card view the details btn is missing?

## ProtectedRoute.ts - Add roles for routing

Role Based Access Implementation

n your case:

Roles: showcase-attendee, showcase-agent, showcase-team, showcase-admin

Permissions: Actions like view_profile, edit_profile, create_event, delete_user, etc.

Pages/Features: These are gated based on the user's role.

🗂️ Suggested Permission Matrix
Here’s a table that maps roles to capabilities:

Feature / Action	Attendee	Agent	Team	Admin
Login / Logout	✅	✅	✅	✅
Fill out own profile	✅	✅	✅	✅
View own profile	✅	✅	✅	✅
View other profiles	❌	❌	✅	✅
Edit other profiles	❌	❌	✅	✅
Reporting dashboard	❌	✅	✅	✅
Scheduling (add/edit)	❌	✅	✅	✅
Manage users (CRUD)	❌	❌	✅	✅
Create events	❌	❌	✅	✅
Edit events	❌	❌	✅	✅
Delete events	❌	❌	❌	✅
Delete users	❌	❌	❌	✅
🛠️ Implementation Strategy
1. Define Roles and Permissions in Auth0
Go to Auth0 Dashboard → User Management → Roles

Create each role and assign relevant permissions (you can define custom permissions like read:reports, edit:events, etc.)

2. Assign Roles to Users
You can do this manually in the Auth0 dashboard or programmatically via the Management API.

3. Include Roles in the Access Token
In Auth0, create a Rule or Action to add roles to the token:

js
context.accessToken['https://your-app.com/roles'] = user.roles;
Make sure your frontend reads this claim from the token.

4. Frontend Role Checks
Use a utility function like:

ts
export const hasRole = (userRoles: string[], requiredRole: string) => {
  return userRoles.includes(requiredRole);
};
Then gate pages or components:

tsx
{hasRole(user.roles, 'showcase-agent') && <ReportingDashboard />}
Or use a higher-order component (HOC) or custom hook to wrap protected routes.

5. Backend Role Checks (if applicable)
If your backend handles sensitive operations, validate the user's role from the token before executing logic.

🧩 Page Layout Suggestions
Here’s how you might organize your app’s pages:

/profile → All roles

/reporting → Agent, Team, Admin

/schedule → Agent, Team, Admin

/users → Team, Admin

/events → Team (CRUD except delete), Admin (full CRUD)

/admin → Admin only

Use route guards or conditional rendering to enforce access.

🔮 Bonus Tip: Role Hierarchy
If you want to simplify checks, you can define a hierarchy:

ts
const roleLevels = {
  'showcase-attendee': 0,
  'showcase-agent': 1,
  'showcase-team': 2,
  'showcase-admin': 3,
};

export const hasAccess = (userRole: string, requiredLevel: number) => {
  return roleLevels[userRole] >= requiredLevel;
};
Then use:

tsx
{hasAccess(user.role, 2) && <UserManagement />}