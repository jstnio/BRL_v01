export * from './common';
export * from './financial';
export * from './hbl';
export * from './maersk';
export * from './maerskTracking';
export * from './quote';

export type UserRole = 'customer' | 'manager';
export type ShipmentType = 'ocean' | 'airfreight' | 'truck';
export type ShipmentStatus = 'booked' | 'in-transit' | 'arrived' | 'delayed';

export interface User {
  uid: string;
  email: string;
  name: string;
  company: string;
  role: UserRole;
  phone?: string;
  position?: string;
  settings?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
    timezone: string;
    twoFactorAuth: boolean;
  };
}