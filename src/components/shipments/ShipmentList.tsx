import { useNavigate } from 'react-router-dom';
import { Shipment } from '../../types';
import { Package } from 'lucide-react';
import ShipmentTable from './ShipmentTable';

interface Props {
  shipments: Shipment[];
}

export default function ShipmentList({ shipments }: Props) {
  const navigate = useNavigate();

  if (!shipments.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No shipments available at this time
        </p>
      </div>
    );
  }

  return <ShipmentTable shipments={shipments} />;
}