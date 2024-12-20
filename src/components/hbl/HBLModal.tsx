import React, { useState } from 'react';
import { Modal } from '../common';
import { Shipment } from '../../types';
import { generatePDF } from '../../utils/pdfGenerator';
import { Loader2 } from 'lucide-react';

interface Props {
  shipment: Shipment;
  isOpen: boolean;
  onClose: () => void;
}

export function HBLModal({ shipment, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const handleGenerateHBL = async () => {
    try {
      setLoading(true);
      await generatePDF(shipment);
      onClose();
    } catch (error) {
      console.error('Error generating HBL:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Generate House Bill of Lading
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                This will generate a House Bill of Lading (HBL) document for shipment{' '}
                {shipment.type === 'ocean' ? shipment.blNumber : shipment.code}.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          disabled={loading}
          onClick={handleGenerateHBL}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Generating...
            </>
          ) : (
            'Generate HBL'
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
