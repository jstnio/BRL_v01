import { Ship, Plane, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Shipment } from '../types';
import { StatusBadge } from './common';
import { EntityList } from './common';

interface Props {
  shipments: Shipment[];
  limit?: number;
}

export default function ShipmentListView({ shipments, limit }: Props) {
  const navigate = useNavigate();
  const displayShipments = limit ? shipments.slice(0, limit) : shipments;

  const renderShipmentItem = (shipment: Shipment) => (
    <div 
      key={shipment.id}
      className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(`/shipments/${shipment.id}`)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {shipment.type === 'ocean' && <Ship className="h-6 w-6 text-blue-500" />}
          {shipment.type === 'airfreight' && <Plane className="h-6 w-6 text-blue-500" />}
          {shipment.type === 'truck' && <Truck className="h-6 w-6 text-blue-500" />}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {shipment.brlReference || 'No Reference'}
          </p>
          <p className="text-sm text-gray-500">
            {shipment.origin.city} → {shipment.destination.city}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <StatusBadge status={shipment.status} />
        <span className="text-sm text-gray-500">
          {format(new Date(shipment.createdAt), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  );

  return (
    <EntityList
      items={displayShipments}
      renderItem={renderShipmentItem}
    />
  );
}
