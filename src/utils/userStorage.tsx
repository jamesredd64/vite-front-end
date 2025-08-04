type UserRole = "showcase_attendee" | "showcase_agent" | "showcase_team" | "showcase_admin";


interface UserRoleMap {
    [email: string]: UserRole;
}

export const UserRoleStorage = {
    // Store role for a specific email
    // Returns true if role was updated, false if it was unchanged
    // Initialize user roles in local storage if not already set
    init() {
        if (!localStorage.getItem('userRoles')) {
            localStorage.setItem('userRoles', JSON.stringify({})); // Initialize with an empty object
        }
    },
    storeRole(email: string, role: UserRole): boolean {
        const userRoles: UserRoleMap = JSON.parse(localStorage.getItem('userRoles') || '{}');
        
        // Check if role is already set and unchanged
        if (userRoles[email] === role) {
            return false; // Role already set to this value
        }
        
        userRoles[email] = role;
        localStorage.setItem('userRoles', JSON.stringify(userRoles));
        return true; // Role was updated
    },

    // Get role for a specific email
    getRole(email: string): UserRole | null {
        const userRoles: UserRoleMap = JSON.parse(localStorage.getItem('userRoles') || '{}');
        return userRoles[email] || null;
    },

    // Remove role for a specific email
    removeRole(email: string) {
        const userRoles: UserRoleMap = JSON.parse(localStorage.getItem('userRoles') || '{}');
        delete userRoles[email];
        localStorage.setItem('userRoles', JSON.stringify(userRoles));
    },

    // Clear all roles
    clearAllRoles() {
        localStorage.removeItem('userRoles');
    },

    // Get all stored roles
    getAllRoles(): UserRoleMap {
        return JSON.parse(localStorage.getItem('userRoles') || '{}');
    }
};