import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useHBLStore } from '../../store/hblStore';
import HBLDocument from './HBLDocument';
import { Button } from '../Button';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { showSuccess, showError } from '../../lib/utils';

interface Props {
  initialData: Partial<HBLFormData>;
  shipmentId: string;
  onClose: () => void;
}

export default function HBLForm({ initialData, shipmentId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { addHBL } = useHBLStore();
  const { register, watch, handleSubmit, setValue } = useForm<HBLFormData>({
    defaultValues: {
      blNumber: '',
      shipper: { name: '', address: '', contact: '' },
      consignee: { name: '', address: '', contact: '' },
      notifyParty: { name: '', address: '', contact: '' },
      vessel: '',
      voyageNo: '',
      portOfLoading: '',
      portOfDischarge: '',
      placeOfReceipt: '',
      placeOfDelivery: '',
      marks: '',
      numbers: '',
      containerNo: '',
      sealNo: '',
      packages: [{ quantity: '', type: '', description: '' }],
      grossWeight: '',
      measurement: '',
      freightPayable: '',
      freightPrepaid: false,
      freightCollect: false,
      numberOfOriginals: '3',
      placeOfIssue: '',
      dateOfIssue: new Date().toISOString().split('T')[0],
      signedBy: '',
      cargoMovement: 'FCL/FCL',
      serviceType: 'CY/CY',
      ...initialData
    }
  });

  const formData = watch();
  const packages = watch('packages');

  const addPackage = () => {
    setValue('packages', [...packages, { quantity: '', type: '', description: '' }]);
  };

  const removePackage = (index: number) => {
    setValue('packages', packages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: HBLFormData) => {
    try {
      setLoading(true);
      await addHBL({
        ...data,
        shipmentId,
      });
      showSuccess('House Bill of Lading saved successfully');
      onClose();
    } catch (error) {
      showError('Failed to save House Bill of Lading');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">B/L Number</label>
          <input
            type="text"
            {...register('blNumber')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Movement Type</label>
          <select
            {...register('cargoMovement')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="FCL/FCL">FCL/FCL</option>
            <option value="LCL/LCL">LCL/LCL</option>
            <option value="FCL/LCL">FCL/LCL</option>
            <option value="LCL/FCL">LCL/FCL</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Type</label>
          <select
            {...register('serviceType')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="CY/CY">CY/CY</option>
            <option value="CFS/CFS">CFS/CFS</option>
            <option value="CY/CFS">CY/CFS</option>
            <option value="CFS/CY">CFS/CY</option>
          </select>
        </div>
      </div>

      {/* Shipper Information */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Shipper</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('shipper.name')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              {...register('shipper.address')}
              rows={3}
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
        </div>
      </div>

      {/* Consignee Information */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Consignee</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('consignee.name')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              {...register('consignee.address')}
              rows={3}
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
        </div>
      </div>

      {/* Notify Party */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Notify Party</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('notifyParty.name')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              {...register('notifyParty.address')}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              {...register('notifyParty.contact')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Vessel & Voyage Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vessel</label>
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

      {/* Port Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Container Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Container No.</label>
          <input
            type="text"
            {...register('containerNo')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Seal No.</label>
          <input
            type="text"
            {...register('sealNo')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Marks & Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Marks</label>
          <textarea
            {...register('marks')}
            rows={3}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Numbers</label>
          <textarea
            {...register('numbers')}
            rows={3}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register(`packages.${index}.description`)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removePackage(index)}
                  className="mt-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weight & Measurement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gross Weight (KGS)</label>
          <input
            type="text"
            {...register('grossWeight')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Measurement (CBM)</label>
          <input
            type="text"
            {...register('measurement')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Freight Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Freight Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Freight Payable At</label>
            <input
              type="text"
              {...register('freightPayable')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('freightPrepaid')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Freight Prepaid</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('freightCollect')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Freight Collect</span>
            </label>
          </div>
        </div>
      </div>

      {/* Issue Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Place of Issue</label>
          <input
            type="text"
            {...register('placeOfIssue')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Issue</label>
          <input
            type="date"
            {...register('dateOfIssue')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Original B/Ls</label>
          <input
            type="number"
            {...register('numberOfOriginals')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Signed By</label>
        <input
          type="text"
          {...register('signedBy')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          Save HBL
        </Button>
        <PDFDownloadLink
          document={<HBLDocument data={formData} />}
          fileName={`HBL-${formData.blNumber || 'draft'}.pdf`}
        >
          {({ loading: pdfLoading }) => (
            <Button disabled={pdfLoading || loading}>
              <FileText className="h-4 w-4 mr-2" />
              {pdfLoading ? 'Generating PDF...' : 'Download HBL'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </form>
  );
}