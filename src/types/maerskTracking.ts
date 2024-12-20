export type EventType = 'EQUIPMENT' | 'SHIPMENT' | 'TRANSPORT';
export type EventClassifierCode = 'PLN' | 'ACT' | 'EST';
export type ReferenceType = 'FF' | 'SI' | 'PO' | 'CR' | 'AAO' | 'EQ';

export interface Reference {
  referenceType: ReferenceType;
  referenceValue: string;
}

export interface Address {
  addressName?: string;
  streetName?: string;
  streetNumber?: string;
  floor?: string;
  postCode?: string;
  cityName?: string;
  stateRegion?: string;
  country?: string;
}

export interface Location {
  locationName?: string;
  latitude?: string;
  longitude?: string;
  UNLocationCode?: string;
  facilityCode?: string;
  facilityCodeListProvider?: 'BIC' | 'SMDG';
  address?: Address;
}

export interface BaseEvent {
  eventID?: string;
  eventType: EventType;
  eventDateTime: string;
  eventCreatedDateTime: string;
  eventClassifierCode: EventClassifierCode;
  references?: Reference[];
  location?: Location;
}

export interface ShipmentEvent extends BaseEvent {
  eventType: 'SHIPMENT';
  shipmentEventTypeCode: 'RECE' | 'DRFT' | 'PENA' | 'PENU' | 'REJE' | 'APPR' | 'ISSU' | 'SURR' | 'SUBM' | 'VOID' | 'CONF' | 'REQS' | 'CMPL' | 'HOLD' | 'RELS';
  documentTypeCode: 'CBR' | 'BKG' | 'SHI' | 'SRM' | 'TRD' | 'ARN' | 'VGM' | 'CAS' | 'CUS' | 'DGD' | 'OOG';
  documentID: string;
  reason?: string;
}

export interface DocumentReference {
  documentReferenceType: 'BKG' | 'TRD';
  documentReferenceValue: string;
}

export interface TrackingVessel {
  vesselIMONumber: number;
  vesselName?: string;
  vesselFlag?: string;
  vesselCallSignNumber?: string;
  vesselOperatorCarrierCode: string;
  vesselOperatorCarrierCodeListProvider: 'SMDG' | 'NMFTA';
}

export interface TransportCall {
  transportCallID: string;
  carrierServiceCode?: string;
  exportVoyageNumber?: string;
  importVoyageNumber?: string;
  transportCallSequenceNumber?: number;
  UNLocationCode?: string;
  facilityCode?: string;
  facilityCodeListProvider?: 'BIC' | 'SMDG';
  facilityTypeCode?: 'BOCR' | 'CLOC' | 'COFS' | 'COYA' | 'OFFD' | 'DEPO' | 'INTE' | 'POTE' | 'RAMP';
  otherFacility?: string;
  modeOfTransport: 'VESSEL' | 'RAIL' | 'TRUCK' | 'BARGE';
  location?: Location;
  vessel?: TrackingVessel;
}

export interface TransportEvent extends BaseEvent {
  eventType: 'TRANSPORT';
  transportEventTypeCode: 'ARRI' | 'DEPA';
  delayReasonCode?: string;
  changeRemark?: string;
  documentReferences?: DocumentReference[];
  transportCall: TransportCall;
}

export interface EquipmentEvent extends BaseEvent {
  eventType: 'EQUIPMENT';
  equipmentEventTypeCode: 'LOAD' | 'DISC' | 'GTIN' | 'GTOT' | 'STUF' | 'STRP' | 'PICK' | 'DROP' | 'RSEA' | 'RMVD' | 'INSP';
  equipmentReference: string;
  ISOEquipmentCode?: string;
  emptyIndicatorCode: 'EMPTY' | 'LADEN';
  documentReferences?: DocumentReference[];
  eventLocation?: Location;
  transportCall?: TransportCall;
}

export type Event = ShipmentEvent | TransportEvent | EquipmentEvent;

export interface Container {
  containerNumber: string;
  isoEquipmentCode?: string;
  equipmentSizeType?: string;
  containerType?: string;
  grossWeight?: string;
}

export interface ShipmentDetails {
  shipmentId: string;
  status: string;
  containers: Container[];
  departureLocation?: Location;
  arrivalLocation?: Location;
  estimatedDepartureDate?: string;
  estimatedArrivalDate?: string;
  actualDepartureDate?: string;
  actualArrivalDate?: string;
  vessel?: {
    vesselIMONumber?: string;
    vesselName?: string;
    vesselFlag?: string;
    vesselCallSign?: string;
    vesselOperatorCarrierCode?: string;
  };
}