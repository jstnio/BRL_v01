import React, { useState } from 'react';
import { PageHeader } from '../../components/common';
import { Button } from '../../components/Button';
import { fetchTariffs, TariffParams } from '../../services/ecuWorldwide';
import { DollarSign, Ship } from 'lucide-react';

export default function TariffPage() {
  const [loading, setLoading] = useState(false);
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<TariffParams>({
    product: 'LCL',
    from: '',
    to: '',
    terms: 'CY/CY',
    valid_on: '',
    haz: false,
    fr: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchTariffs(formData);
      setTariffs(Array.isArray(result) ? result : [result]);
    } catch (error) {
      setError('Failed to fetch tariffs. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="ECU Worldwide Tariffs"
        description="Check tariffs for your shipments"
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin</label>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  placeholder="e.g., USHOU"
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  placeholder="e.g., BRSSZ"
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
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="LCL">LCL</option>
                  <option value="FCL">FCL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Terms</label>
                <select
                  name="terms"
                  value={formData.terms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="CY/CY">CY/CY</option>
                  <option value="CFS/CFS">CFS/CFS</option>
                  <option value="CY/CFS">CY/CFS</option>
                  <option value="CFS/CY">CFS/CY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Valid On</label>
                <input
                  type="date"
                  name="valid_on"
                  value={formData.valid_on}
                  onChange={handleInputChange}
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="haz"
                    checked={formData.haz}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Hazardous Material</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="fr"
                    checked={formData.fr}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Freight Release</span>
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
                  'Checking Tariffs...'
                ) : (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Check Tariffs
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

          {tariffs.map((tariff, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formData.from} → {formData.to}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <Ship className="inline-block w-4 h-4 mr-1" />
                    {formData.product} - {formData.terms}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {typeof tariff.rate === 'number' 
                      ? tariff.rate.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })
                      : 'Rate not available'
                    }
                  </p>
                  {tariff.validUntil && (
                    <p className="text-sm text-gray-500">
                      Valid until: {new Date(tariff.validUntil).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {tariff.additionalCharges && tariff.additionalCharges.length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Charges:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {tariff.additionalCharges.map((charge: any, chargeIndex: number) => (
                      <div key={chargeIndex} className="text-sm">
                        <span className="font-medium">{charge.description}:</span>{' '}
                        {charge.amount.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
