import { ShipmentType, ShipmentStatus } from './index';

export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface BaseEntity {
  type: string;
  company: ReactNode;
  id: string;
  name: string;
  code: string;
  address?: string;
  email?: string;
  phone?: string;
  contactPerson?: ContactPerson;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimpleLocation {
  city: string;
  country: string;
}

export interface Shipment extends BaseEntity {
  type: ShipmentType;
  status: ShipmentStatus;
  origin: SimpleLocation;
  destination: SimpleLocation;
  departureDate: string;
  arrivalDate: string;
  carrier?: string;
  trackingNumber?: string;
  brlReference?: string;
  awbNumber?: string;
  blNumber?: string;
  crtNumber?: string;
  notes?: string;
}