import React from 'react';
import { Link } from 'react-router-dom';

export default function ManagerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Shipments Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipments</h2>
            <div className="space-y-4">
              <Link
                to="/shipments"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                View All Shipments
              </Link>
              <Link
                to="/shipments/new"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Create New Shipment
              </Link>
            </div>
          </div>
        </div>

        {/* Master Data Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Master Data</h2>
            <div className="space-y-4">
              <Link
                to="/customers"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Customers
              </Link>
              <Link
                to="/freight-forwarders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Freight Forwarders
              </Link>
              <Link
                to="/shipping-lines"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Shipping Lines
              </Link>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reports</h2>
            <div className="space-y-4">
              <Link
                to="/financial-dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Financial Dashboard
              </Link>
              <Link
                to="/quotes"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Quotes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}