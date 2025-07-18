export class UserManagementHelper {
  static capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return ['1-', '(', match[1], ') ', match[2], '-', match[3]].join('');
    }
    return phoneNumber;
  }

//   static async fetchAllUsers(isAuthenticated: boolean, setLoading: (loading: boolean) => void, setState: (state: any) => void, setError: (error: Error | null) => void): Promise<any[]> {
//     if (!isAuthenticated) {
//       console.log("fetchAllUsers: Not authenticated, returning null");
//       return [];
//     }

//     setLoading(true);
//     console.log("fetchAllUsers: Fetching all users...");

//     try {
//       const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_USERS}`;
//       console.log("fetchAllUsers: Making request to:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("fetchAllUsers: Response status:", response.status);

//       if (response.status === 204) {
//         console.log("fetchAllUsers: No users found");
//         return [];
//       }

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const users = await response.json();
//       console.log("fetchAllUsers: Received user list:", users);
//       return users;
//     } catch (error) {
//       console.error("fetchAllUsers: Error:", error);
//       const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
//       const status = error instanceof Response ? error.status : undefined;

//       const apiError = new Error(errorMessage) as ApiError;
//       if (status !== undefined) {
//         apiError.status = status;
//       }

//       setState(prev => ({
//         ...prev,
//         error: apiError,
//         isLoading: false
//       }));

//       setError(apiError);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   } 
// }

// interface ApiError extends Error {
//   status?: number;
// }

// interface User {
//   auth0Id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   isActive: boolean;
//   profile: {
//     dateOfBirth: string;
//     gender: string;
//     profilePictureUrl: string;
//     role?: string;
//     status?: boolean;
//   };
 }