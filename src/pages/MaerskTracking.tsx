import React from 'react';
import { PageHeader } from '../components/common';

export default function MaerskTracking() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Shipment Tracking"
        description="Track your shipments in real-time"
      />
      
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            Tracking functionality will be implemented soon.
          </p>
        </div>
      </div>
    </div>
  );
}
