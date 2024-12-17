import { X } from 'lucide-react';
import { Shipment } from '../../types';
import HBLForm from './HBLForm';

interface Props {
  shipment: Shipment;
  onClose: () => void;
}

export default function HBLModal({ shipment, onClose }: Props) {
  const initialData = {
    blNumber: shipment.blNumber || '',
    shipper: {
      name: shipment.shipper?.name || '',
      address: shipment.shipper?.address || '',
      contact: shipment.shipper?.contact || '',
    },
    consignee: {
      name: shipment.consignee?.name || '',
      address: shipment.consignee?.address || '',
      contact: shipment.consignee?.contact || '',
    },
    vessel: shipment.vessel || '',
    voyageNo: shipment.voyageNo || '',
    portOfLoading: shipment.origin?.port?.name || '',
    portOfDischarge: shipment.destination?.port?.name || '',
    containerNo: shipment.containers?.[0]?.number || '',
    sealNo: shipment.containers?.[0]?.sealNumber || '',
    description: shipment.cargoDescription || '',
    grossWeight: shipment.weight?.toString() || '',
    measurement: shipment.measurement || '',
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Generate House Bill of Lading
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <HBLForm 
            initialData={initialData} 
            shipmentId={shipment.id}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}