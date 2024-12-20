import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, FileText } from 'lucide-react';
import { Shipment } from '../../types';
import { Modal } from '../common';
import { OceanShipmentForm, AirShipmentForm } from '../forms';
import { HBLModal } from '../hbl';

interface Props {
  shipment: Shipment;
}

export default function ShipmentActions({ shipment }: Props) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHBLModal, setShowHBLModal] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit shipment data:', shipment);
    setShowEditForm(true);
  };

  const handleClose = () => {
    setShowEditForm(false);
    setShowDeleteModal(false);
    setShowHBLModal(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/shipment/${shipment.id}`);
  };

  const handleHBL = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowHBLModal(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // Update will be handled by the form component
      handleClose();
    } catch (error) {
      console.error('Error updating shipment:', error);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={handleView}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        {shipment.type === 'ocean' && (
          <button
            onClick={handleHBL}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
            title="Generate HBL"
          >
            <FileText className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={handleEdit}
          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
          title="Edit Shipment"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Delete Shipment"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showEditForm && (
        <Modal
          isOpen={showEditForm}
          onClose={handleClose}
          title={`Edit ${shipment.type === 'ocean' ? 'Ocean' : 'Air'} Shipment`}
        >
          {shipment.type === 'ocean' ? (
            <OceanShipmentForm
              shipment={shipment}
              onClose={handleClose}
              onSubmit={handleFormSubmit}
            />
          ) : (
            <AirShipmentForm
              shipment={shipment}
              onClose={handleClose}
              onSubmit={handleFormSubmit}
            />
          )}
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={handleClose}
          title="Delete Shipment"
        >
          <div className="p-6">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this shipment? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete
                  handleClose();
                }}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showHBLModal && (
        <HBLModal
          shipment={shipment}
          onClose={() => setShowHBLModal(false)}
          isOpen={showHBLModal}
        />
      )}
    </>
  );
}