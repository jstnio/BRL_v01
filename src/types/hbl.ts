export type HBLStatus = 'draft' | 'final' | 'cancelled';

export interface HBLParty {
  userId?: string;  // For customers
  name: string;
  address: string;
  contact: string;
  email?: string;
  phone?: string;
}

export interface HBLPackage {
  quantity: string;
  type: string;
  description: string;
  grossWeight?: number;
  measurement?: number;
  marksAndNumbers?: string;
}

export interface HBLData {
  id: string;
  blNumber: string;
  shipmentId: string;
  status: HBLStatus;
  
  // Parties
  shipper: HBLParty;
  consignee: HBLParty;
  notifyParty: HBLParty;
  
  // Vessel Details
  vessel: string;
  voyageNo: string;
  
  // Ports
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt?: string;
  placeOfDelivery?: string;
  
  // Cargo Details
  packages: HBLPackage[];
  containerNo?: string;
  sealNo?: string;
  
  // Weights and Measurements
  totalGrossWeight?: number;
  totalMeasurement?: number;
  
  // Freight Details
  freightPayableAt?: string;
  freightPrepaid?: boolean;
  freightCollect?: boolean;
  freightTerms?: 'Prepaid' | 'Collect';
  
  // Document Details
  placeOfIssue?: string;
  dateOfIssue?: string;
  numberOfOriginals?: string;
  
  // Movement Type
  cargoMovement?: 'FCL/FCL' | 'LCL/LCL' | 'FCL/LCL' | 'LCL/FCL';
  serviceType?: 'CY/CY' | 'CFS/CFS' | 'CY/CFS' | 'CFS/CY';
  
  // Signature
  signedBy?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
  
  // Additional Fields
  remarks?: string;
  specialInstructions?: string;
}