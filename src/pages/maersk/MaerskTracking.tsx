import React, { useState } from 'react';
import { PageHeader } from '../../components/common';
import { Button } from '../../components/Button';
import { Search } from 'lucide-react';

export default function MaerskTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSearch = () => {
    // Tracking functionality will be implemented later
    console.log('Searching for tracking number:', trackingNumber);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Shipment Tracking"
        description="Track your shipments in real-time"
      />
      
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="max-w-xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>
            
            <div className="mt-8 text-center text-gray-600">
              <p>Tracking functionality will be implemented soon.</p>
              <p className="mt-2 text-sm">Enter a tracking number to get started.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}