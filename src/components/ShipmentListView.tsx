import { Ship, Plane, Truck, MoreVertical } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Shipment } from '../types';
import { StatusBadge } from './common';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
  shipments: Shipment[];
  limit?: number;
}

export default function ShipmentListView({ shipments, limit }: Props) {
  const navigate = useNavigate();
  const displayShipments = limit ? shipments.slice(0, limit) : shipments;

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              BRL Reference
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origin
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayShipments.map((shipment) => (
            <tr 
              key={shipment.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/shipments/${shipment.id}`)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {shipment.type === 'ocean' && <Ship className="h-5 w-5 text-blue-500" />}
                    {shipment.type === 'airfreight' && <Plane className="h-5 w-5 text-blue-500" />}
                    {shipment.type === 'truck' && <Truck className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {shipment.brlReference || 'No Reference'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={shipment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{shipment.origin.city}</div>
                <div className="text-sm text-gray-500">{shipment.origin.country}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{shipment.destination.city}</div>
                <div className="text-sm text-gray-500">{shipment.destination.country}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(shipment.updatedAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Menu as="div" className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                  <Menu.Button className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 focus:outline-none">
                    <MoreVertical className="h-5 w-5" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } group flex items-center px-4 py-2 text-sm w-full text-left`}
                              onClick={() => navigate(`/shipments/${shipment.id}`)}
                            >
                              View Details
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } group flex items-center px-4 py-2 text-sm w-full text-left`}
                              onClick={() => navigate(`/shipments/${shipment.id}/edit`)}
                            >
                              Edit
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
