import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useShipmentStore } from '../store/shipmentStore';
import { Plus, Search, Filter, Package, AlertCircle } from 'lucide-react';
import ShipmentList from '../components/ShipmentList';
import { ShipmentStatus, ShipmentType } from '../types';
import { verifyUserRole } from '../lib/firebase';
import { Card, Row, Col, Statistic } from 'antd';
import { Ship, Plane, Truck, DollarSign, Users } from 'lucide-react';
import { Button } from '../components/Button';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchShipments, oceanShipments, airShipments, loading, error } = useShipmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ShipmentType | 'all'>('all');
  const [roleVerified, setRoleVerified] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const role = await verifyUserRole();
      console.log('Verified role:', role);
      
      if (role !== 'manager') {
        console.error('User is not a manager:', role);
        navigate('/customer');
        return;
      }

      setRoleVerified(true);
      try {
        await fetchShipments();
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      }
    };

    verifyAccess();
  }, [user, navigate, fetchShipments]);

  const allShipments = [...oceanShipments, ...airShipments];
  
  const filteredShipments = allShipments.filter(shipment => {
    const matchesSearch = 
      (shipment.type === 'ocean' ? shipment.blNumber : shipment.awbNumber)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.shipper?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesType = typeFilter === 'all' || shipment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = [
    { title: 'Ocean Shipments', value: oceanShipments.length, icon: <Ship className="h-6 w-6 text-blue-500" /> },
    { title: 'Air Shipments', value: airShipments.length, icon: <Plane className="h-6 w-6 text-blue-500" /> },
    { title: 'Total Shipments', value: allShipments.length, icon: <Package className="h-6 w-6 text-blue-500" /> },
    { title: 'Active Customers', value: 42, icon: <Users className="h-6 w-6 text-blue-500" /> },
    { title: 'Revenue', value: '$1.2M', icon: <DollarSign className="h-6 w-6 text-blue-500" /> },
  ];

  const quickActions = [
    { title: 'View Shipments', path: '/shipments', icon: <Package className="h-5 w-5" /> },
    { title: 'New Shipment', path: '/shipments/new', icon: <Ship className="h-5 w-5" /> },
    { title: 'Get Quote', path: '/quotation', icon: <DollarSign className="h-5 w-5" /> },
    { title: 'Search Tariffs', path: '/tariffs', icon: <Users className="h-5 w-5" /> },
  ];

  if (!user || !roleVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Manager Dashboard</h1>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={8}>
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Button
                onClick={() => navigate(action.path)}
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2"
              >
                {action.icon}
                {action.title}
              </Button>
            </Col>
          ))}
        </Row>
      </div>

      {/* Shipments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
              <p className="mt-2 text-gray-600">Welcome back, {user.name}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/manager/new')}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Shipment
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by tracking number or shipper..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | 'all')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="in-transit">In Transit</option>
                <option value="arrived">Arrived</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type Filter
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ShipmentType | 'all')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="airfreight">Air Freight</option>
                <option value="ocean">Ocean Freight</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shipments...</p>
          </div>
        ) : (
          <ShipmentList shipments={filteredShipments} />
        )}
      </div>
    </div>
  );
}