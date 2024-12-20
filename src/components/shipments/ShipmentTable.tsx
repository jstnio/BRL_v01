import { useNavigate } from 'react-router-dom';
import { Shipment } from '../../types';
import { format } from 'date-fns';
import { Ship, Plane } from 'lucide-react';
import { StatusBadge } from '../common';
import ShipmentActions from './ShipmentActions';

interface Props {
  shipments: Shipment[];
}

export default function ShipmentTable({ shipments }: Props) {
  const navigate = useNavigate();

  const getShipmentIcon = (type: 'ocean' | 'airfreight' | 'truck') => {
    return type === 'airfreight' ? (
      <Plane className="h-5 w-5 text-blue-500" />
    ) : (
      <Ship className="h-5 w-5 text-blue-500" />
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getShipmentIcon(shipment.type)}
                  <span className="ml-3 text-sm font-medium text-blue-600">
                    {shipment.type === 'ocean' ? shipment.blNumber : shipment.awbNumber}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={shipment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipment.origin.city}, {shipment.origin.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipment.destination.city}, {shipment.destination.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(shipment.updatedAt), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ShipmentActions shipment={shipment} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}