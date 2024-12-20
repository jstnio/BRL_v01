import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchTariffs, TariffParams, TariffResponse } from '../../services/ecuWorldwide';
import { Button } from '../Button';
import { showError } from '../../lib/utils';

export default function TariffCheck() {
  const [loading, setLoading] = useState(false);
  const [tariffData, setTariffData] = useState<TariffResponse | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<TariffParams>();

  const onSubmit = async (data: TariffParams) => {
    try {
      setLoading(true);
      const response = await fetchTariffs(data);
      setTariffData(response);
    } catch (error) {
      console.error('Error fetching tariffs:', error);
      showError('Failed to fetch tariff data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">ECU Worldwide Tariff Check</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              {...register('product', { required: 'Product is required' })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Product</option>
              <option value="FCL">FCL</option>
              <option value="LCL">LCL</option>
              <option value="AIR">Air Freight</option>
            </select>
            {errors.product && (
              <p className="mt-1 text-sm text-red-600">{errors.product.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Terms</label>
            <select
              {...register('terms', { required: 'Terms is required' })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Terms</option>
              <option value="CY/CY">CY/CY</option>
              <option value="CFS/CFS">CFS/CFS</option>
              <option value="CY/CFS">CY/CFS</option>
              <option value="CFS/CY">CFS/CY</option>
            </select>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">From (Origin)</label>
            <input
              type="text"
              {...register('from', { required: 'Origin is required' })}
              placeholder="Enter origin location"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.from && (
              <p className="mt-1 text-sm text-red-600">{errors.from.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To (Destination)</label>
            <input
              type="text"
              {...register('to', { required: 'Destination is required' })}
              placeholder="Enter destination location"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.to && (
              <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valid On</label>
            <input
              type="date"
              {...register('valid_on')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('haz')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Hazardous Goods</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('fr')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Freight</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Checking Tariffs...' : 'Check Tariffs'}
          </Button>
        </div>
      </form>

      {tariffData && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Tariff Results</h3>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
            {JSON.stringify(tariffData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
