export * from './common';
export * from './financial';
export * from './hbl';
export * from './maersk';
export * from './maerskTracking';
export * from './quote';

export type UserRole = 'customer' | 'manager';
export type ShipmentType = 'ocean' | 'airfreight' | 'truck';
export type ShipmentStatus = 'booked' | 'in-transit' | 'arrived' | 'delayed' | 'unknown';

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

export interface Location {
  city: string;
  country: string;
}

// Firestore timestamp type
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Shipment {
  brlReference: string | undefined;
  id: string;
  type: ShipmentType;
  status: ShipmentStatus;
  createdAt: string | FirestoreTimestamp;
  updatedAt: string | FirestoreTimestamp;
  origin: Location;
  destination: Location;
  departureDate?: string | FirestoreTimestamp;
  arrivalDate?: string | FirestoreTimestamp;
  
  // Ocean specific fields
  blNumber?: string;
  bookingNumber?: string;
  containerNumber?: string;
  containerType?: string;
  vessel?: string;
  imoNumber?: string;
  
  // Air specific fields
  awbNumber?: string;
  flightNumber?: string;
  airline?: string;
  
  // Truck specific fields
  crtNumber?: string;
  truckNumber?: string;
  driverName?: string;
  
  // Tracking specific fields
  events?: any[];
  customerReference?: string;
  active?: boolean;
  name?: string;
  code?: string;
}