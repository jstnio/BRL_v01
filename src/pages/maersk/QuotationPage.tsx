import React, { useState } from 'react';
import { PageHeader } from '../../components/common';
import { Button } from '../../components/Button';
import { fetchQuotation, fetchLocations, QuotationRequest, QuotationResponse } from '../../services/ecuQuotation';
import { DollarSign, Package, MapPin } from 'lucide-react';

interface LocationOption {
  value: string;
  label: string;
}

export default function QuotationPage() {
  const [loading, setLoading] = useState(false);
  const [quotations, setQuotations] = useState<QuotationResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<QuotationRequest>({
    weight: 0,
    volume: 0,
    poRUnCode: '',
    poDUnCode: '',
    productType: 'LCL',
    cargoClass: 'General',
    accountId: 519222,
    isHazardousMaterial: false,
    currencyCode: 'USD',
    fromType: 'Port',
    toType: 'Port'
  });

  // Location search state
  const [originOptions, setOriginOptions] = useState<LocationOption[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<LocationOption[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const searchLocations = async (searchTerm: string, isOrigin: boolean) => {
    if (searchTerm.length < 2) return;
    
    setLoadingLocations(true);
    try {
      const locations = await fetchLocations(searchTerm);
      const options = locations.map(loc => ({
        value: loc.unCode,
        label: `${loc.name}, ${loc.country} (${loc.unCode})`
      }));
      
      if (isOrigin) {
        setOriginOptions(options);
      } else {
        setDestinationOptions(options);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const quotes = await fetchQuotation(formData);
      setQuotations(quotes);
    } catch (error) {
      setError('Failed to fetch quotation. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="ECU Worldwide Quotation"
        description="Get instant quotes for your shipments"
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="poRUnCode"
                    value={formData.poRUnCode}
                    onChange={handleInputChange}
                    onKeyUp={(e) => searchLocations(e.currentTarget.value, true)}
                    placeholder="Search origin port"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                  {originOptions.length > 0 && (
                    <ul className="mt-1 max-h-40 overflow-auto bg-white border border-gray-300 rounded-md shadow-sm">
                      {originOptions.map(option => (
                        <li
                          key={option.value}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, poRUnCode: option.value }));
                            setOriginOptions([]);
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="poDUnCode"
                    value={formData.poDUnCode}
                    onChange={handleInputChange}
                    onKeyUp={(e) => searchLocations(e.currentTarget.value, false)}
                    placeholder="Search destination port"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                  {destinationOptions.length > 0 && (
                    <ul className="mt-1 max-h-40 overflow-auto bg-white border border-gray-300 rounded-md shadow-sm">
                      {destinationOptions.map(option => (
                        <li
                          key={option.value}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, poDUnCode: option.value }));
                            setDestinationOptions([]);
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Volume */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Volume (m³)</label>
                <input
                  type="number"
                  name="volume"
                  value={formData.volume}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="LCL">LCL</option>
                  <option value="FCL">FCL</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isHazardousMaterial"
                    checked={formData.isHazardousMaterial}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Hazardous Material</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center"
              >
                {loading ? (
                  'Getting Quotes...'
                ) : (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Get Quotes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {quotations.map((quote, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quote Option {index + 1}</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {quote.rate.toLocaleString('en-US', {
                      style: 'currency',
                      currency: formData.currencyCode || 'USD'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    <Package className="inline-block w-4 h-4 mr-1" />
                    {quote.weight}kg / {quote.volume}m³
                  </p>
                </div>
              </div>

              {quote.quoteOfferDetails.map((detail, detailIndex) => (
                <div key={detailIndex} className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <MapPin className="inline-block w-4 h-4 mr-1" />
                        From: {detail.poRUnCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <MapPin className="inline-block w-4 h-4 mr-1" />
                        To: {detail.poDUnCode}
                      </p>
                    </div>
                  </div>

                  {detail.quoteAdditionalServices.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Additional Services:</h4>
                      <ul className="mt-2 grid grid-cols-2 gap-2">
                        {detail.quoteAdditionalServices.map((service, serviceIndex) => (
                          <li key={serviceIndex} className="text-sm text-gray-600">
                            • {service.additionalServiceId}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
