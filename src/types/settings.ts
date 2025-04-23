export interface AutoEventSettings {
  scheduleFrequency: {
    morning: string;  // cron expression
    afternoon: string; // cron expression
  };
  userCriteria: {
    status: string[];
    roles: string[];
    daysFromSignup: number;
  };
  eventDefaults: {
    reminderBefore: number; // minutes
    autoExpire: boolean;
    expiryDays: number;
  };
}

export interface RolePermission {
  name: string;
  description: string;
  access: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
}

export interface RoleBasedAccess {
  role: 'admin' | 'user' | 'manager' | 'super-admin';
  permissions: {
    [key: string]: RolePermission;
  };
  features: string[];
}

export interface AdminSettings {
  autoEvent: AutoEventSettings;
  roleBasedAccess: RoleBasedAccess[];
  emailTemplates: {
    invitation: string;
    reminder: string;
    welcome: string;
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
  };
}


