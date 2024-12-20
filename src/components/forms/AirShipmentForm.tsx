import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShipmentStore } from '../../store/shipmentStore';
import { AirFreightShipment } from '../../types';
import { X } from 'lucide-react';
import CargoItemsForm from '../CargoItemsForm';

interface Props {
  shipment?: AirFreightShipment;
  onClose: () => void;
  onSubmit?: (data: any) => Promise<void>;
}

export default function AirShipmentForm({ shipment, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addAirShipment, updateAirShipment } = useShipmentStore();

  console.log('AirShipmentForm received shipment:', shipment);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: shipment ? {
      ...shipment,
      origin: shipment.origin || {},
      destination: shipment.destination || {},
      flight: shipment.flight || {},
      cargo: shipment.cargo || {},
      documents: shipment.documents || [],
      status: shipment.status || 'booked',
      type: 'airfreight'
    } : {
      origin: {},
      destination: {},
      flight: {},
      cargo: {},
      documents: [],
      status: 'booked',
      type: 'airfreight'
    }
  });

  const handleFormSubmit = async (data: any) => {
    console.log('Form submission data:', data);
    setLoading(true);
    setError('');

    try {
      if (shipment?.id) {
        await updateAirShipment(shipment.id, data);
      } else {
        await addAirShipment(data);
      }
      if (onSubmit) {
        await onSubmit(data);
      }
      onClose();
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Error saving shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(handleFormSubmit)(e);
    }} className="space-y-8 p-6">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">AWB Number</label>
            <input
              type="text"
              {...register('awbNumber')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...register('status')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="booked">Booked</option>
              <option value="in-transit">In Transit</option>
              <option value="arrived">Arrived</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Origin Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Origin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('origin.city')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              {...register('origin.country')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>

      {/* Destination Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Destination</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('destination.city')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              {...register('destination.country')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>

      {/* Flight Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Flight Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Flight Number</label>
            <input
              type="text"
              {...register('flight.number')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Carrier</label>
            <input
              type="text"
              {...register('flight.carrier')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : (shipment ? 'Update' : 'Create')} Shipment
        </button>
      </div>
    </form>
  );
}