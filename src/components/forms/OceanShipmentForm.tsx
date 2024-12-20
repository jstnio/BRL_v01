import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useShipmentStore } from '../../store/shipmentStore';
import { useMasterDataStore } from '../../store/masterDataStore';
import { useAuthStore } from '../../store/authStore';
import { X } from 'lucide-react';
import { OceanFreightShipment } from '../../types';
import ContainerListForm from '../ContainerListForm';

interface Props {
  shipment?: OceanFreightShipment;
  onClose: () => void;
  onSubmit?: (data: any) => Promise<void>;
}

export default function OceanShipmentForm({ shipment, onClose, onSubmit }: Props) {
  const { user } = useAuthStore();
  const { addOceanShipment, updateOceanShipment } = useShipmentStore();
  const { entities, fetchEntities } = useMasterDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log('Ocean shipment form received:', shipment);

  const form = useForm({
    defaultValues: shipment ? {
      ...shipment,
      type: 'ocean',
      status: shipment.status || 'booked',
      brlReference: shipment.brlReference || '',
      shipperReference: shipment.shipperReference || '',
      consigneeReference: shipment.consigneeReference || '',
      agentReference: shipment.agentReference || '',
      blNumber: shipment.blNumber || '',
      shipper: shipment.shipper || null,
      consignee: shipment.consignee || null,
      agent: shipment.agent || null,
      shippingLine: shipment.shippingLine || null,
      customsBroker: shipment.customsBroker || null,
      trucker: shipment.trucker || null,
      origin: {
        city: shipment.origin?.city || '',
        country: shipment.origin?.country || '',
        port: shipment.origin?.port || null
      },
      destination: {
        city: shipment.destination?.city || '',
        country: shipment.destination?.country || '',
        port: shipment.destination?.port || null
      },
      schedule: {
        draftBlDate: shipment.schedule?.draftBlDate || '',
        vgmDeadline: shipment.schedule?.vgmDeadline || '',
        cargoCutOff: shipment.schedule?.cargoCutOff || '',
        estimatedDeparture: shipment.schedule?.estimatedDeparture || '',
        actualDeparture: shipment.schedule?.actualDeparture || '',
        estimatedArrival: shipment.schedule?.estimatedArrival || '',
        actualArrival: shipment.schedule?.actualArrival || ''
      },
      containers: shipment.containers || [],
      cargoDetails: shipment.cargoDetails || [],
      dueNumber: shipment.dueNumber || '',
      customsStatus: shipment.customsStatus || 'Green',
      specialInstructions: shipment.specialInstructions || '',
      active: shipment.active !== false,
      vessel: {
        name: shipment.vessel?.name || '',
        voyageNumber: shipment.vessel?.voyageNumber || ''
      }
    } : {
      type: 'ocean',
      status: 'booked',
      brlReference: '',
      shipperReference: '',
      consigneeReference: '',
      agentReference: '',
      blNumber: '',
      shipper: null,
      consignee: null,
      agent: null,
      shippingLine: null,
      customsBroker: null,
      trucker: null,
      origin: {
        city: '',
        country: '',
        port: null
      },
      destination: {
        city: '',
        country: '',
        port: null
      },
      schedule: {
        draftBlDate: '',
        vgmDeadline: '',
        cargoCutOff: '',
        estimatedDeparture: '',
        actualDeparture: '',
        estimatedArrival: '',
        actualArrival: ''
      },
      containers: [],
      cargoDetails: [],
      dueNumber: '',
      customsStatus: 'Green',
      specialInstructions: '',
      active: true,
      vessel: {
        name: '',
        voyageNumber: ''
      }
    }
  });

  const { handleSubmit, register, watch, getValues, setValue } = form;

  // Fetch all required master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      await Promise.all([
        fetchEntities('customers'),
        fetchEntities('freightForwarders'),
        fetchEntities('shippingLines'),
        fetchEntities('ports'),
        fetchEntities('customsBrokers'),
        fetchEntities('truckers')
      ]);
    };
    fetchMasterData();
  }, [fetchEntities]);

  const handleFormSubmit = async (data: any) => {
    console.log('Form submission data:', data);
    setLoading(true);
    setError('');

    try {
      const shipmentData = {
        ...data,
        manager: {
          uid: user!.uid,
          name: user!.name,
          email: user!.email,
        },
        trackingHistory: [{
          timestamp: new Date().toISOString(),
          status: data.status,
          description: shipment ? 'Shipment updated' : 'Ocean shipment created',
        }],
        createdAt: shipment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (shipment?.id) {
        await updateOceanShipment(shipment.id, shipmentData);
      } else {
        await addOceanShipment(shipmentData);
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

  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Vessel & Route' },
    { number: 3, title: 'Schedule' },
    { number: 4, title: 'Containers' },
    { number: 5, title: 'Additional Info' }
  ];

  const renderStepContent = (step: number) => {
    const formFieldClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white";
    const labelClass = "block text-sm font-medium text-gray-700";

    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>BRL Reference</label>
                <input type="text" {...register('brlReference')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>B/L Number</label>
                <input type="text" {...register('blNumber')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Status</label>
                <select {...register('status')} className={formFieldClass}>
                  <option value="booked">Booked</option>
                  <option value="in-transit">In Transit</option>
                  <option value="arrived">Arrived</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>Shipper Reference</label>
                <input type="text" {...register('shipperReference')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Consignee Reference</label>
                <input type="text" {...register('consigneeReference')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Agent Reference</label>
                <input type="text" {...register('agentReference')} className={formFieldClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>Shipper</label>
                <select {...register('shipper')} className={formFieldClass}>
                  <option value="">Select Shipper</option>
                  {entities.customers?.filter(c => c.type === 'shipper' || c.type === 'both').map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Consignee</label>
                <select {...register('consignee')} className={formFieldClass}>
                  <option value="">Select Consignee</option>
                  {entities.customers?.filter(c => c.type === 'consignee' || c.type === 'both').map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Agent</label>
                <select {...register('agent')} className={formFieldClass}>
                  <option value="">Select Agent</option>
                  {entities.freightForwarders?.map(forwarder => (
                    <option key={forwarder.id} value={forwarder.id}>{forwarder.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>Vessel Name</label>
                <input type="text" {...register('vessel.name')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Voyage Number</label>
                <input type="text" {...register('vessel.voyageNumber')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Shipping Line</label>
                <select {...register('shippingLine')} className={formFieldClass}>
                  <option value="">Select Shipping Line</option>
                  {entities.shippingLines?.map(line => (
                    <option key={line.id} value={line.id}>{line.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Origin</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={labelClass}>City</label>
                    <input type="text" {...register('origin.city')} className={formFieldClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Country</label>
                    <input type="text" {...register('origin.country')} className={formFieldClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Port</label>
                    <select {...register('origin.port')} className={formFieldClass}>
                      <option value="">Select Port</option>
                      {entities.ports?.map(port => (
                        <option key={port.id} value={port.id}>{port.code} - {port.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Destination</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={labelClass}>City</label>
                    <input type="text" {...register('destination.city')} className={formFieldClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Country</label>
                    <input type="text" {...register('destination.country')} className={formFieldClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Port</label>
                    <select {...register('destination.port')} className={formFieldClass}>
                      <option value="">Select Port</option>
                      {entities.ports?.map(port => (
                        <option key={port.id} value={port.id}>{port.code} - {port.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Draft B/L Date</label>
                <input type="date" {...register('schedule.draftBlDate')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>VGM Deadline</label>
                <input type="date" {...register('schedule.vgmDeadline')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Cargo Cut-Off</label>
                <input type="date" {...register('schedule.cargoCutOff')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Est. Departure</label>
                <input type="date" {...register('schedule.estimatedDeparture')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Act. Departure</label>
                <input type="date" {...register('schedule.actualDeparture')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Est. Arrival</label>
                <input type="date" {...register('schedule.estimatedArrival')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Act. Arrival</label>
                <input type="date" {...register('schedule.actualArrival')} className={formFieldClass} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Container List</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const containers = getValues('containers') || [];
                      setValue('containers', [...containers, {
                        containerNumber: '',
                        type: '',
                        seal: '',
                        weight: '',
                        volume: '',
                        packages: '',
                        description: ''
                      }]);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                  >
                    Add Container
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {watch('containers')?.map((_, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700">Container #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const containers = getValues('containers');
                          setValue('containers', containers.filter((_, i) => i !== index));
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Container Number
                        </label>
                        <input
                          type="text"
                          {...register(`containers.${index}.containerNumber`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                          placeholder="ABCD1234567"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Container Type
                        </label>
                        <select
                          {...register(`containers.${index}.type`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Select Type</option>
                          <option value="20GP">20' General Purpose</option>
                          <option value="40GP">40' General Purpose</option>
                          <option value="40HC">40' High Cube</option>
                          <option value="20RF">20' Reefer</option>
                          <option value="40RF">40' Reefer</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Seal Number
                        </label>
                        <input
                          type="text"
                          {...register(`containers.${index}.seal`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                          placeholder="Seal number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Weight (KG)
                        </label>
                        <input
                          type="number"
                          {...register(`containers.${index}.weight`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Volume (CBM)
                        </label>
                        <input
                          type="number"
                          {...register(`containers.${index}.volume`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Packages
                        </label>
                        <input
                          type="number"
                          {...register(`containers.${index}.packages`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                          placeholder="Number of packages"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Cargo Description
                      </label>
                      <textarea
                        {...register(`containers.${index}.description`)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Describe the cargo contents..."
                      />
                    </div>
                  </div>
                ))}
                
                {(!watch('containers') || watch('containers').length === 0) && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No containers added yet.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setValue('containers', [{
                          containerNumber: '',
                          type: '',
                          seal: '',
                          weight: '',
                          volume: '',
                          packages: '',
                          description: ''
                        }]);
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add your first container
                    </button>
                  </div>
                )}
              </div>
              
              {watch('containers')?.length > 0 && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-700">
                      Total Containers: <span className="font-medium">{watch('containers')?.length}</span>
                    </div>
                    <div className="space-x-4">
                      <span className="text-gray-700">
                        Total Weight: <span className="font-medium">
                          {watch('containers')?.reduce((sum, container) => sum + (parseFloat(container.weight) || 0), 0).toFixed(2)} KG
                        </span>
                      </span>
                      <span className="text-gray-700">
                        Total Volume: <span className="font-medium">
                          {watch('containers')?.reduce((sum, container) => sum + (parseFloat(container.volume) || 0), 0).toFixed(2)} CBM
                        </span>
                      </span>
                      <span className="text-gray-700">
                        Total Packages: <span className="font-medium">
                          {watch('containers')?.reduce((sum, container) => sum + (parseInt(container.packages) || 0), 0)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>DUE/RUC Number</label>
                <input type="text" {...register('dueNumber')} className={formFieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Customs Status</label>
                <select {...register('customsStatus')} className={formFieldClass}>
                  <option value="Green">Green</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Red">Red</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Customs Broker</label>
                <select {...register('customsBroker')} className={formFieldClass}>
                  <option value="">Select Customs Broker</option>
                  {entities.customsBrokers?.map(broker => (
                    <option key={broker.id} value={broker.id}>{broker.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Trucker</label>
                <select {...register('trucker')} className={formFieldClass}>
                  <option value="">Select Trucker</option>
                  {entities.truckers?.map(trucker => (
                    <option key={trucker.id} value={trucker.id}>{trucker.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Special Instructions</label>
              <textarea {...register('specialInstructions')} rows={4} className={formFieldClass} placeholder="Enter any special handling instructions or notes..." />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (activeStep === steps.length) {
        handleSubmit(handleFormSubmit)(e);
      }
    }} className="w-full min-w-[75%] max-w-[95%] mx-auto bg-gray-50">
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded relative shadow-sm">
          {error}
        </div>
      )}

      <div className="px-4 py-3 border-b bg-white">
        <nav className="flex justify-between items-center max-w-4xl mx-auto">
          {steps.map((step) => (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveStep(step.number)}
              className={`flex flex-col items-center space-y-1 ${
                activeStep === step.number
                  ? 'text-blue-600'
                  : activeStep > step.number
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-6 h-6 text-xs rounded-full flex items-center justify-center border-2 ${
                  activeStep === step.number
                    ? 'border-blue-600 bg-blue-50'
                    : activeStep > step.number
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300'
                }`}
              >
                {activeStep > step.number ? '✓' : step.number}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{step.title}</span>
            </button>
          ))}
        </nav>
        <div className="mt-2 h-0.5 bg-gray-200 rounded max-w-4xl mx-auto">
          <div
            className="h-0.5 bg-blue-600 rounded transition-all duration-300"
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 bg-white flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {renderStepContent(activeStep)}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white px-6 py-4 border-t shadow-lg rounded-b-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            type="button"
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            className={`px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors ${
              activeStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={activeStep === 1 || loading}
          >
            Previous
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            {activeStep === steps.length ? (
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : (shipment ? 'Update Shipment' : 'Create Shipment')}
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveStep(Math.min(steps.length, activeStep + 1));
                }}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}