export type EventType = 'EQUIPMENT' | 'SHIPMENT' | 'TRANSPORT';
export type EventClassifierCode = 'PLN' | 'ACT' | 'EST';

export interface Reference {
  referenceType: 'FF' | 'SI' | 'PO' | 'CR' | 'AAO' | 'EQ';
  referenceValue: string;
}

export interface Location {
  locationName?: string;
  latitude?: string;
  longitude?: string;
  UNLocationCode?: string;
  facilityCode?: string;
  facilityCodeListProvider?: 'BIC' | 'SMDG';
  address?: {
    addressName?: string;
    streetName?: string;
    streetNumber?: string;
    floor?: string;
    postCode?: string;
    cityName?: string;
    stateRegion?: string;
    country?: string;
  };
}

export interface Event {
  eventID: string;
  eventType: EventType;
  eventDateTime: string;
  eventCreatedDateTime: string;
  eventClassifierCode: EventClassifierCode;
  references?: Reference[];
}

export interface ShipmentEvent extends Event {
  eventType: 'SHIPMENT';
  shipmentEventTypeCode: string;
  documentTypeCode: string;
  documentID: string;
  reason?: string;
}

export interface TransportEvent extends Event {
  eventType: 'TRANSPORT';
  transportEventTypeCode: 'ARRI' | 'DEPA';
  delayReasonCode?: string;
  changeRemark?: string;
  transportCall: {
    transportCallID: string;
    facilityTypeCode?: string;
    location?: Location;
  };
}

export interface EquipmentEvent extends Event {
  eventType: 'EQUIPMENT';
  equipmentEventTypeCode: string;
  equipmentReference: string;
  ISOEquipmentCode?: string;
  emptyIndicatorCode: 'EMPTY' | 'LADEN';
  eventLocation?: Location;
}