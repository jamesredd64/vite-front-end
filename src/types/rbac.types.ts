export type AccessFunction = {
  access: boolean;
};

export type RbacAppTypePermissions = {
  [accessFunctionKey: string]: AccessFunction;
};

export type RolePermissions = {
  [rbacAppTypeKey: string]: RbacAppTypePermissions;
};

export type RoleBasedAccess = {
  role: string;
  permissions: RolePermissions;
  features?: string[]; // Keep features for now, but might be deprecated
};

export type AdminSettingsResponse = {
  success: boolean;
  data: AdminSettings;
  message?: string; // Added optional message property
};

export type AdminSettings = {
  roleBasedAccess: RoleBasedAccess[];
  emailTemplates: {
    [key: string]: {
      subject: string;
      body: string;
    };
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordPolicy: {
      minLength: number;
      requireSpecialChar: boolean;
      requireNumber: boolean;
      requireUppercase: boolean;
    };
  };
  calendar: {
    showAllEvents: boolean;
    defaultView: string;
    workingHours: {
      start: string;
      end: string;
    };
  };
};