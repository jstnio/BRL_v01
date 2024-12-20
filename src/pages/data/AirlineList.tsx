import { useState, useEffect } from 'react';
import { Plane, Search, Filter, X } from 'lucide-react';
import { useMasterDataStore } from '../../store/masterDataStore';
import { BaseEntity } from '../../types/common';
import EntityList from '../../components/common/EntityList';
import { Modal } from '../../components/common';
import { showError, showSuccess } from '../../lib/utils';

interface Airline extends BaseEntity {
  code: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AirlineList() {
  const { entities, loading, fetchEntities, addEntity, updateEntity, deleteEntity } = useMasterDataStore();
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [filteredAirlines, setFilteredAirlines] = useState<Airline[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  useEffect(() => {
    fetchEntities('airlines');
  }, [fetchEntities]);

  useEffect(() => {
    const allAirlines = (entities['airlines'] || []) as Airline[];
    setAirlines(allAirlines);
  }, [entities]);

  useEffect(() => {
    let filtered = airlines;

    if (searchQuery) {
      filtered = filtered.filter(airline => 
        airline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airline.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(airline => airline.country === selectedCountry);
    }

    setFilteredAirlines(filtered);
  }, [searchQuery, selectedCountry, airlines]);

  const countries = [...new Set(airlines.map(airline => airline.country))].sort();

  const handleAdd = () => {
    setSelectedAirline(null);
    setShowForm(true);
  };

  const handleEdit = (index: number) => {
    setSelectedAirline(filteredAirlines[index]);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    const airline = filteredAirlines[index];
    if (window.confirm(`Are you sure you want to delete ${airline.name}?`)) {
      try {
        await deleteEntity('airlines', airline.id);
        // Update local state
        const updatedAirlines = airlines.filter(a => a.id !== airline.id);
        setAirlines(updatedAirlines);
        showSuccess('Airline deleted successfully');
      } catch (error) {
        console.error('Error deleting airline:', error);
        showError('Failed to delete airline');
      }
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const contactName = formData.get('contact.name') as string;
    const contactEmail = formData.get('contact.email') as string;
    const contactPhone = formData.get('contact.phone') as string;
    
    const airlineData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      country: formData.get('country') as string,
      contact: {
        name: contactName || '',
        email: contactEmail || '',
        phone: contactPhone || '',
      },
    };

    try {
      if (selectedAirline) {
        const updatedAirline = await updateEntity('airlines', selectedAirline.id, airlineData);
        // Update local state
        const updatedAirlines = airlines.map(airline => 
          airline.id === selectedAirline.id ? { ...airline, ...airlineData } : airline
        );
        setAirlines(updatedAirlines);
        showSuccess('Airline updated successfully');
      } else {
        const newAirline = await addEntity('airlines', airlineData);
        // Update local state
        setAirlines(prev => [...prev, { ...airlineData, id: newAirline.id }]);
        showSuccess('Airline added successfully');
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving airline:', error);
      showError('Failed to save airline');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
  };

  if (loading && airlines.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Airlines</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage airline partners and their contact information
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plane className="h-5 w-5 mr-2" />
            Add Airline
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
                placeholder="Search airlines..."
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
                {(selectedCountry) && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {1}
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
                      Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Countries</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredAirlines.map((airline, index) => (
            <li key={airline.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Plane className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{airline.name}</div>
                    <div className="text-sm text-gray-500">
                      {airline.code} • {airline.country}
                    </div>
                    {airline.contact?.name && (
                      <div className="text-sm text-gray-500">
                        Contact: {airline.contact.name}
                        {airline.contact.email && ` • ${airline.contact.email}`}
                        {airline.contact.phone && ` • ${airline.contact.phone}`}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="inline-flex items-center p-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filteredAirlines.length === 0 && (
            <li className="px-4 py-8 text-center">
              <Plane className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No airlines found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || selectedCountry
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding a new airline.'}
              </p>
            </li>
          )}
        </ul>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={selectedAirline ? 'Edit Airline' : 'Add Airline'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Airline Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={selectedAirline?.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Airline Code
              </label>
              <input
                type="text"
                name="code"
                id="code"
                defaultValue={selectedAirline?.code}
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
                defaultValue={selectedAirline?.country}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
              <span className="text-xs text-gray-500">Optional</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="contact.name" className="block text-sm font-medium text-gray-700">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contact.name"
                  id="contact.name"
                  defaultValue={selectedAirline?.contact?.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                  defaultValue={selectedAirline?.contact?.email}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                  defaultValue={selectedAirline?.contact?.phone}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {selectedAirline ? 'Update' : 'Add'} Airline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}