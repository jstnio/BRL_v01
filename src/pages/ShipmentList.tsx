import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Search, AlertCircle, Ship, Plane, Truck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useShipmentStore } from '../store/shipmentStore';
import { StatusBadge, EntityList, Button } from '../components/common';
import { format, parseISO } from 'date-fns';
import { ShipmentStatus, ShipmentType, Shipment } from '../types';

export default function ShipmentList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { oceanShipments, airShipments, truckShipments, loading, fetchShipments } = useShipmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ShipmentType | 'all'>('all');

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Combine all shipments
  const allShipments = [...oceanShipments, ...airShipments, ...truckShipments];

  // Filter shipments based on search term and filters
  const filteredShipments = allShipments.filter(shipment => {
    const matchesSearch = searchTerm === '' || 
      shipment.brlReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesType = typeFilter === 'all' || shipment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string | { seconds: number; nanoseconds: number }) => {
    try {
      if (typeof dateString === 'string') {
        return format(parseISO(dateString), 'MMM d, yyyy');
      } else if (dateString && 'seconds' in dateString) {
        return format(new Date(dateString.seconds * 1000), 'MMM d, yyyy');
      }
      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

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
          {formatDate(shipment.createdAt)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Shipments</h1>
        <Button
          onClick={() => navigate('/shipments/new')}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Shipment
        </Button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search shipments..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | 'all')}
          className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="all">All Status</option>
          <option value="booked">Booked</option>
          <option value="in-transit">In Transit</option>
          <option value="arrived">Arrived</option>
          <option value="delayed">Delayed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ShipmentType | 'all')}
          className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="all">All Types</option>
          <option value="ocean">Ocean</option>
          <option value="airfreight">Air Freight</option>
          <option value="truck">Truck</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Loading Shipments</h3>
          <p className="mt-1 text-sm text-gray-500">Please wait while we fetch your shipments.</p>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating a new shipment'}
          </p>
        </div>
      ) : (
        <EntityList
          items={filteredShipments}
          renderItem={renderShipmentItem}
        />
      )}
    </div>
  );
}
