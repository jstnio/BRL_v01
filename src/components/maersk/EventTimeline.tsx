import { format } from 'date-fns';
import { Ship, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Event } from '../../types/maerskTracking';

interface Props {
  events: Event[];
}

export default function EventTimeline({ events }: Props) {
  const sortedEvents = [...events].sort(
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
    }
  };

  const getEventStatus = (event: Event) => {
    switch (event.eventClassifierCode) {
      case 'ACT':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'EST':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'PLN':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try searching with a different reference number
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Tracking Events</h3>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {sortedEvents.map((event, index) => (
              <li key={event.eventID}>
                <div className="relative pb-8">
                  {index < events.length - 1 && (
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
                      {'transportEventTypeCode' in event && (
                        <p className="mt-1 text-sm text-gray-500">
                          {event.transportEventTypeCode}
                        </p>
                      )}
                      {'equipmentEventTypeCode' in event && (
                        <p className="mt-1 text-sm text-gray-500">
                          {event.equipmentEventTypeCode}
                        </p>
                      )}
                      {'shipmentEventTypeCode' in event && (
                        <p className="mt-1 text-sm text-gray-500">
                          {event.shipmentEventTypeCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}