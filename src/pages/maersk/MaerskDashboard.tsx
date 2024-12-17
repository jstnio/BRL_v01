import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMaerskStore } from '../../store/maerskStore';
import { Ship, Search } from 'lucide-react';
import { Button } from '../../components/Button';

export default function MaerskDashboard() {
  const navigate = useNavigate();
  const { ports, vessels, loading, error, fetchPorts, fetchVessels } = useMaerskStore();

  useEffect(() => {
    fetchPorts();
    fetchVessels();
  }, [fetchPorts, fetchVessels]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Ship className="h-8 w-8 text-primary-600 mr-3" />
          MAERSK Integration
        </h1>
        <p className="mt-2 text-gray-600">
          Manage MAERSK schedules and track shipments
        </p>
      </div>

      <div className="mb-8">
        <Button onClick={() => navigate('/maersk/tracking')} className="flex items-center">
          <Search className="h-4 w-4 mr-2" />
          Track Shipments
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Ports Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Active Ports</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">Loading ports...</div>
            ) : (
              <div className="space-y-4">
                {ports.map((port) => (
                  <div key={port.UNLocationCode} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{port.portName}</p>
                      <p className="text-sm text-gray-500">{port.cityName}, {port.countryName}</p>
                    </div>
                    <span className="text-sm text-gray-500">{port.UNLocationCode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Vessels Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Active Vessels</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">Loading vessels...</div>
            ) : (
              <div className="space-y-4">
                {vessels.map((vessel) => (
                  <div key={vessel.vesselIMONumber} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{vessel.vesselName}</p>
                      <p className="text-sm text-gray-500">IMO: {vessel.vesselIMONumber}</p>
                    </div>
                    <span className="text-sm text-gray-500">{vessel.vesselCallSign}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}