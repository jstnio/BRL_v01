import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useHBLStore } from '../../store/hblStore';
import { HBLData } from '../../types';
import HBLDocument from './HBLDocument';
import { Button } from '../Button';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { showSuccess, showError } from '../../lib/utils';

interface Props {
  initialData: Partial<HBLData>;
  shipmentId: string;
  onClose: () => void;
}

export default function HBLForm({ initialData, shipmentId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { addHBL } = useHBLStore();
  const { register, watch, handleSubmit, setValue } = useForm<HBLData>({
    defaultValues: {
      ...initialData,
      packages: initialData.packages || [{
        quantity: '',
        type: '',
        description: '',
        marksAndNumbers: '',
      }],
    }
  });

  const formData = watch();
  const packages = watch('packages') || [];

  const addPackage = () => {
    setValue('packages', [...packages, {
      quantity: '',
      type: '',
      description: '',
      marksAndNumbers: '',
    }]);
  };

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      setValue('packages', packages.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: HBLData) => {
    try {
      setLoading(true);
      await addHBL({
        ...data,
        shipmentId,
      });
      showSuccess('House Bill of Lading saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving HBL:', error);
      showError('Failed to save House Bill of Lading');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">B/L Number</label>
          <input
            type="text"
            {...register('blNumber')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Shipper Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Shipper Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('shipper.name')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              {...register('shipper.contact')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              {...register('shipper.address')}
              rows={2}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Consignee Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Consignee Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('consignee.name')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              {...register('consignee.contact')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              {...register('consignee.address')}
              rows={2}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Vessel Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Vessel Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vessel Name</label>
            <input
              type="text"
              {...register('vessel')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Voyage No.</label>
            <input
              type="text"
              {...register('voyageNo')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Port Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Port Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Port of Loading</label>
            <input
              type="text"
              {...register('portOfLoading')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Port of Discharge</label>
            <input
              type="text"
              {...register('portOfDischarge')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Place of Receipt</label>
            <input
              type="text"
              {...register('placeOfReceipt')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Place of Delivery</label>
            <input
              type="text"
              {...register('placeOfDelivery')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Package Details</h3>
          <Button type="button" onClick={addPackage} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </div>
        
        {packages.map((_, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg relative">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="text"
                {...register(`packages.${index}.quantity`)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                {...register(`packages.${index}.type`)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                {...register(`packages.${index}.description`)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Marks & Numbers</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  {...register(`packages.${index}.marksAndNumbers`)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {packages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePackage(index)}
                    className="mt-1 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onClose} variant="outline">
          Cancel
        </Button>
        {formData.blNumber && (
          <PDFDownloadLink
            document={<HBLDocument data={formData} />}
            fileName={`HBL_${formData.blNumber}.pdf`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {({ loading }) => (
              <>
                <FileText className="h-4 w-4 mr-2" />
                {loading ? 'Generating PDF...' : 'Download PDF'}
              </>
            )}
          </PDFDownloadLink>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save HBL'}
        </Button>
      </div>
    </form>
  );
}