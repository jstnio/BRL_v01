import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, MapPin, Calendar, Truck, Ship, Plane } from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { Button } from '../components/Button';
import { Shipment } from '../types';

export default function ShipmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { oceanShipments, airShipments, truckShipments, loading, error } = useShipmentStore();
  const [shipment, setShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    const allShipments = [...oceanShipments, ...airShipments, ...truckShipments];
    const found = allShipments.find(s => s.id === id);
    setShipment(found || null);
  }, [id, oceanShipments, airShipments, truckShipments]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading shipment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Shipment not found</p>
        </div>
      </div>
    );
  }

  const getShipmentIcon = () => {
    switch (shipment.type) {
      case 'ocean':
        return <Ship className="h-6 w-6" />;
      case 'airfreight':
        return <Plane className="h-6 w-6" />;
      case 'truck':
        return <Truck className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const getStatusColor = () => {
    switch (shipment.status) {
      case 'booked':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'arrived':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          onClick={() => navigate('/shipments')}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipments
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getShipmentIcon()}
            <h1 className="text-2xl font-bold text-gray-900 ml-2">
              Shipment {shipment.trackingNumber}
            </h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {shipment.status}
          </span>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shipment Details</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Route</span>
              </div>
              <div className="ml-6">
                <p className="text-gray-900">
                  From: {shipment.origin.city}, {shipment.origin.country}
                </p>
                <p className="text-gray-900">
                  To: {shipment.destination.city}, {shipment.destination.country}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center text-gray-500 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Schedule</span>
              </div>
              <div className="ml-6">
                <p className="text-gray-900">
                  Departure: {new Date(shipment.departureDate).toLocaleDateString()}
                </p>
                <p className="text-gray-900">
                  Arrival: {new Date(shipment.arrivalDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center text-gray-500 mb-2">
                <Package className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Cargo Details</span>
              </div>
              <div className="ml-6">
                <p className="text-gray-900">Type: {shipment.type}</p>
                <p className="text-gray-900">Weight: {shipment.weight} kg</p>
                <p className="text-gray-900">Volume: {shipment.volume} m³</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}