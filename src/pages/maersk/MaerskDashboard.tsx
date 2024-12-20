import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/common';
import { Search, DollarSign, Calculator } from 'lucide-react';

const MaerskDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="ECU Worldwide Services"
        description="Access tracking, tariffs, and quotation services"
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Search className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Tracking</h3>
              <p className="text-gray-600">Track your shipments in real-time</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/maersk/tracking')}
            className="mt-4 w-full"
          >
            Track Shipments
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Tariffs</h3>
              <p className="text-gray-600">Check ECU Worldwide tariffs</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/maersk/tariffs')}
            className="mt-4 w-full"
          >
            Check Tariffs
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Quotation</h3>
              <p className="text-gray-600">Get instant shipping quotes</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/maersk/quotation')}
            className="mt-4 w-full"
          >
            Get Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaerskDashboard;