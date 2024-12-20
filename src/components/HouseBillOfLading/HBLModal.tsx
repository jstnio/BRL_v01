import { X } from 'lucide-react';
import { Shipment } from '../../types';
import HBLForm from './HBLForm';
import { Modal } from '../common';

interface Props {
  shipment: Shipment;
  onClose: () => void;
  isOpen: boolean;
}

export default function HBLModal({ shipment, onClose, isOpen }: Props) {
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
    notifyParty: {
      name: shipment.notifyParty?.name || '',
      address: shipment.notifyParty?.address || '',
      contact: shipment.notifyParty?.contact || '',
    },
    vessel: shipment.vessel || '',
    voyageNo: shipment.bookingNumber || '',
    portOfLoading: shipment.origin?.port?.name || '',
    portOfDischarge: shipment.destination?.port?.name || '',
    placeOfReceipt: shipment.origin?.city || '',
    placeOfDelivery: shipment.destination?.city || '',
    containerNo: shipment.containers?.[0]?.number || '',
    sealNo: shipment.containers?.[0]?.sealNumber || '',
    description: shipment.cargoDescription || '',
    grossWeight: shipment.weight?.toString() || '',
    measurement: shipment.measurement || '',
    packages: shipment.cargo?.map(item => ({
      quantity: item.quantity?.toString() || '',
      type: item.type || '',
      description: item.description || '',
      marksAndNumbers: item.marksAndNumbers || '',
    })) || [{
      quantity: '',
      type: '',
      description: '',
      marksAndNumbers: '',
    }],
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
    </Modal>
  );
}