import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from '../common';

interface AirlineFormData {
  name: string;
  code: string;
  country: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AirlineFormData) => void;
  initialData?: AirlineFormData;
  title: string;
}

export default function AirlineForm({ isOpen, onClose, onSubmit, initialData, title }: Props) {
  const [formData, setFormData] = useState<AirlineFormData>({
    name: '',
    code: '',
    country: '',
    contact: {
      name: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Airline Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Airline Code
              </label>
              <input
                type="text"
                name="code"
                id="code"
                value={formData.code}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="contact.name" className="block text-sm font-medium text-gray-700">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="contact.name"
                    id="contact.name"
                    value={formData.contact.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contact.email"
                    id="contact.email"
                    value={formData.contact.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="contact.phone"
                    id="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
