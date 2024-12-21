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
  port: null;
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

export interface OceanFreightShipment extends Shipment {
  agentReference: string;
  consigneeReference: string;
  shipperReference: string;
  shipper: null;
  consignee: null;
  agent: null;
  shippingLine: null;
  customsBroker: null;
  trucker: null;
  customsStatus: string;
  specialInstructions: string;
  dueNumber: string;
  containers: never[];
  cargoDetails: never[];
  schedule: any;
  type: 'ocean';
  vessel?: string;
  imoNumber?: string;
  blNumber?: string;
  bookingNumber?: string;
  containerNumber?: string;
  containerType?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  estimatedTransitTime?: number;
}