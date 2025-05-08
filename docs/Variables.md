## To access adminStatus on a different page, you can use React state management techniques. Here are several ways to do it:

🔹 ## Option 1: Using useState with Context API (Best for Global State)
### You can create a context provider to store adminStatus and access it from any component.

1️⃣ ## Create a Context (AuthContext.js or AuthProvider.js)

tsx

```

import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminStatus, setAdminStatus] = useState(false); // Default: false

  return (
    <AuthContext.Provider value={{ adminStatus, setAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

```

2️⃣ Wrap Your App in AuthProvider (index.js or App.js)

```

tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./AuthContext";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);

```

3️⃣ Access adminStatus in Any Component

```

tsx
import React from "react";
import { useAuth } from "./AuthContext";

export default function AdminPage() {
  const { adminStatus } = useAuth();

  return <p>User is {adminStatus ? "an Admin" : "a User"}</p>;
}

```

🔹 Option 2: Using localStorage (Persistent Across Page Reloads)
If you want the admin status to persist across reloads, use localStorage:

```

tsx
localStorage.setItem("adminStatus", adminStatus ? "admin" : "user");
Then, retrieve it in another page:

tsx
const adminStatus = localStorage.getItem("adminStatus") === "admin";
console.log("Admin Status:", adminStatus);
🔹 Option 3: Using useNavigate & useLocation (Pass via URL State)
If you're navigating between pages:

```
tsx
navigate("/dashboard", { state: { adminStatus } });
Then, access it in the new page:

tsx
const location = useLocation();
const adminStatus = location.state?.adminStatus ?? false;
🚀 Best Approach?
✅ For global app-wide access → Use Context API (useAuth) ✅ For persistent storage (reloads) → Use localStorage ✅ For passing status during navigation → Use useLocation

```
Let me know which method works best for your case! 🚀✨