import { format } from 'date-fns';
import { Ship, Package, Truck, CheckCircle2, AlertCircle, Container, Calendar, MapPin } from 'lucide-react';
import { Event, ShipmentDetails } from '../../types/maerskTracking';
import React from 'react';

interface Props {
  events: Event[];
  shipmentDetails?: ShipmentDetails;
}

const formatLocation = (location: any) => {
  if (!location) return '';
  const parts = [];
  if (location.locationName) parts.push(location.locationName);
  if (location.address?.cityName) parts.push(location.address.cityName);
  if (location.address?.country) parts.push(location.address.country);
  if (location.UNLocationCode) parts.push(`(${location.UNLocationCode})`);
  return parts.join(', ');
};

const ShipmentDetailsSection = ({ shipmentDetails }: { shipmentDetails?: ShipmentDetails }) => {
  if (!shipmentDetails) return null;

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Shipment Details</h2>
      
      {/* Shipment Status */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
          Status
        </h3>
        <div className="border rounded p-3">
          <p className="font-medium">{shipmentDetails.status}</p>
          <p className="text-sm text-gray-600">Shipment ID: {shipmentDetails.shipmentId}</p>
        </div>
      </div>

      {/* Container Information */}
      {shipmentDetails.containers && shipmentDetails.containers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Container className="h-5 w-5 mr-2 text-blue-500" />
            Containers ({shipmentDetails.containers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shipmentDetails.containers.map((container, index) => (
              <div key={index} className="border rounded p-3">
                <p className="font-medium">{container.containerNumber}</p>
                <p className="text-sm text-gray-600">
                  Type: {container.containerType || container.equipmentSizeType || 'Standard Container'}
                </p>
                {container.isoEquipmentCode && (
                  <p className="text-sm text-gray-600">ISO: {container.isoEquipmentCode}</p>
                )}
                {container.grossWeight && (
                  <p className="text-sm text-gray-600">Weight: {container.grossWeight}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vessel Information */}
      {shipmentDetails.vessel && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Ship className="h-5 w-5 mr-2 text-blue-500" />
            Vessel Details
          </h3>
          <div className="border rounded p-3">
            <p className="font-medium">{shipmentDetails.vessel.vesselName}</p>
            {shipmentDetails.vessel.vesselIMONumber && (
              <p className="text-sm text-gray-600">IMO: {shipmentDetails.vessel.vesselIMONumber}</p>
            )}
            {shipmentDetails.vessel.vesselCallSign && (
              <p className="text-sm text-gray-600">Call Sign: {shipmentDetails.vessel.vesselCallSign}</p>
            )}
            {shipmentDetails.vessel.vesselFlag && (
              <p className="text-sm text-gray-600">Flag: {shipmentDetails.vessel.vesselFlag}</p>
            )}
          </div>
        </div>
      )}

      {/* Schedule Information */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-500" />
          Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-3">
            <h4 className="font-medium mb-1">Port of Loading</h4>
            {shipmentDetails.departureLocation && (
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {formatLocation(shipmentDetails.departureLocation)}
              </p>
            )}
            {shipmentDetails.actualDepartureDate && (
              <p className="text-sm text-gray-600">
                Actual: {format(new Date(shipmentDetails.actualDepartureDate), 'PPP')}
              </p>
            )}
            {shipmentDetails.estimatedDepartureDate && (
              <p className="text-sm text-gray-600">
                Estimated: {format(new Date(shipmentDetails.estimatedDepartureDate), 'PPP')}
              </p>
            )}
          </div>
          <div className="border rounded p-3">
            <h4 className="font-medium mb-1">Port of Discharge</h4>
            {shipmentDetails.arrivalLocation && (
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {formatLocation(shipmentDetails.arrivalLocation)}
              </p>
            )}
            {shipmentDetails.actualArrivalDate && (
              <p className="text-sm text-gray-600">
                Actual: {format(new Date(shipmentDetails.actualArrivalDate), 'PPP')}
              </p>
            )}
            {shipmentDetails.estimatedArrivalDate && (
              <p className="text-sm text-gray-600">
                Estimated: {format(new Date(shipmentDetails.estimatedArrivalDate), 'PPP')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EventTimeline({ events, shipmentDetails }: Props) {
  const eventsArray = Array.isArray(events) ? events : [];
  console.log('Events in Timeline:', eventsArray);
  console.log('Shipment Details:', shipmentDetails);

  const sortedEvents = [...eventsArray].sort(
    (a, b) => new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime()
  );

  const getEventIcon = (event: Event) => {
    switch (event.eventType) {
      case 'TRANSPORT':
        return <Ship className="h-6 w-6 text-blue-500" />;
      case 'EQUIPMENT':
        return <Package className="h-6 w-6 text-green-500" />;
      case 'SHIPMENT':
        return <Truck className="h-6 w-6 text-purple-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getEventStatus = (event: Event): React.ReactNode => {
    switch (event.eventClassifierCode) {
      case 'ACT':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'EST':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'PLN':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <ShipmentDetailsSection shipmentDetails={shipmentDetails} />
      
      <div className="space-y-8">
        {/* Events Timeline */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Tracking Events</h3>
          </div>
          <div className="p-6">
            {eventsArray.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tracking events found
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {sortedEvents.map((event, index) => (
                    <li key={event.eventID}>
                      <div className="relative pb-8">
                        {index < eventsArray.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div className="flex items-center">
                            {getEventIcon(event)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {event.eventType}
                              </p>
                              {getEventStatus(event)}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {format(new Date(event.eventDateTime), 'PPp')}
                            </p>
                            {event.location && (
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                {formatLocation(event.location)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}