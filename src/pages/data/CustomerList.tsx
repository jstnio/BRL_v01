import { useState, useEffect } from 'react';
import { Users, Search, Filter } from 'lucide-react';
import { useMasterDataStore } from '../../store/masterDataStore';
import { BaseEntity } from '../../types/common';
import EntityList from '../../components/common/EntityList';
import { Modal } from '../../components/common';
import { showError, showSuccess } from '../../lib/utils';

interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export default function CustomerList() {
  const { entities, loading, fetchEntities, addEntity, updateEntity, deleteEntity } = useMasterDataStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    fetchEntities('customers');
    fetchEntities('countries');
  }, [fetchEntities]);

  useEffect(() => {
    const allCustomers = (entities['customers'] || []) as Customer[];
    setCustomers(allCustomers);
    
    const allCountries = (entities['countries'] || []) as any[];
    // Filter out duplicate countries based on name
    const uniqueCountries = Array.from(new Set(allCountries.map(country => country.name)))
      .map(name => allCountries.find(country => country.name === name))
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    setCountries(uniqueCountries);
  }, [entities]);

  useEffect(() => {
    let filtered = customers;

    if (searchQuery) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.address?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(customer => customer.address?.city === selectedCity);
    }

    setFilteredCustomers(filtered);
  }, [searchQuery, selectedCity, customers]);

  const cities = [...new Set(customers.filter(c => c.address?.city).map(c => c.address!.city))].sort();

  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (index: number) => {
    setSelectedCustomer(filteredCustomers[index]);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    const customer = filteredCustomers[index];
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await deleteEntity('customers', customer.id);
        const updatedCustomers = customers.filter(c => c.id !== customer.id);
        setCustomers(updatedCustomers);
        showSuccess('Customer deleted successfully');
      } catch (error) {
        console.error('Error deleting customer:', error);
        showError('Failed to delete customer');
      }
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const customerData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        postalCode: formData.get('postalCode') as string,
        country: formData.get('country') as string,
      },
    };

    try {
      if (selectedCustomer) {
        const updatedCustomer = await updateEntity('customers', selectedCustomer.id, customerData);
        const updatedCustomers = customers.map(customer => 
          customer.id === selectedCustomer.id ? { ...customer, ...customerData } : customer
        );
        setCustomers(updatedCustomers);
        showSuccess('Customer updated successfully');
      } else {
        const newCustomer = await addEntity('customers', customerData);
        setCustomers(prev => [...prev, { ...customerData, id: newCustomer.id }]);
        showSuccess('Customer added successfully');
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving customer:', error);
      showError('Failed to save customer');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage customer information and details
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Users className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                  showFilters
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {selectedCity && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    1
                  </span>
                )}
              </button>

              {showFilters && (
                <div className="absolute z-10 right-0 mt-2 w-72 bg-white rounded-md shadow-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Cities</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <EntityList
          items={filteredCustomers}
          renderItem={(customer: Customer) => (
            <div className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{customer.name}</p>
                    {customer.address && (
                      <div className="mt-1 text-sm text-gray-500">
                        {customer.address.city && customer.address.country && (
                          <span>{`${customer.address.city}, ${customer.address.country}`}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={selectedCustomer?.name || ''}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={selectedCustomer?.email || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              defaultValue={selectedCustomer?.phone || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              id="street"
              defaultValue={selectedCustomer?.address?.street || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                defaultValue={selectedCustomer?.address?.city || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                defaultValue={selectedCustomer?.address?.state || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                defaultValue={selectedCustomer?.address?.postalCode || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                name="country"
                id="country"
                defaultValue={selectedCustomer?.address?.country || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 flex space-x-3">
            <button
              type="submit"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              {selectedCustomer ? 'Update' : 'Add'} Customer
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}