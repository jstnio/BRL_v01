// Types based on the OpenAPI specification
export interface Port {
  countryCode: string;
  countryName: string;
  UNLocationCode: string;
  cityName: string;
  portName: string;
  UNRegionCode?: string;
  carrierCityGeoID: string;
}

export interface Vessel {
  vesselIMONumber: string;
  carrierVesselCode: string;
  vesselName: string;
  vesselFlagCode: string;
  vesselCallSign: string;
}

export interface CallSchedule {
  transportEventTypeCode: string;
  eventClassifierCode: string;
  classifierDateTime: string;
}

export interface Service {
  carrierVoyageNumber: string;
  carrierServiceCode: string;
  carrierServiceName: string;
}

export interface Facility extends Port {
  locationType: string;
  locationName: string;
  carrierTerminalCode: string;
  carrierTerminalGeoID: string;
}

export interface VesselCall {
  facility: Facility;
  transport: {
    inboundService: Service;
    outboundService: Service;
  };
  callSchedules: CallSchedule[];
}

export interface FacilityCall {
  transport: {
    vessel: Vessel;
    inboundService: Service;
    outboundService: Service;
  };
  callSchedules: CallSchedule[];
}

export interface PortCall {
  facility: Facility;
  facilityCalls: FacilityCall[];
}

export interface VesselSchedules {
  vessel: Vessel;
  vesselCalls: VesselCall[];
}

export interface PortSchedules {
  port: Port;
  portCalls: PortCall[];
}