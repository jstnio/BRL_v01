import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMasterDataStore } from '../../store/masterDataStore';
import { useFinancialStore } from '../../store/financialStore';
import { Transaction, TransactionType } from '../../types/financial';
import { X, DollarSign } from 'lucide-react';
import { Button } from '../Button';
import DatePickerField from '../DatePickerField';

interface Props {
  transaction?: Transaction;
  onClose: () => void;
}

export default function TransactionForm({ transaction, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { entities, fetchEntities } = useMasterDataStore();
  const { addTransaction, updateTransaction } = useFinancialStore();

  const form = useForm({
    defaultValues: transaction || {
      type: 'receivable',
      status: 'pending',
      referenceNumber: `BRL-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      description: '',
      amount: 0,
      currency: 'USD',
      exchangeRate: 1,
      dueDate: new Date().toISOString(),
      issueDate: new Date().toISOString(),
      entity: {
        id: '',
        type: 'customer',
        name: '',
        document: ''
      },
      relatedDocuments: [],
      notes: '',
      attachments: []
    }
  });

  const { register, handleSubmit, watch, setValue } = form;
  const transactionType = watch('type') as TransactionType;
  const entityType = watch('entity.type');

  useEffect(() => {
    const fetchAllEntities = async () => {
      await Promise.all([
        fetchEntities('customers'),
        fetchEntities('freightForwarders')
      ]);
    };
    fetchAllEntities();
  }, [fetchEntities]);

  const getFilteredEntities = () => {
    switch (entityType) {
      case 'customer':
        return entities.customers || [];
      case 'agent':
        return entities.freightForwarders || [];
      case 'vendor':
        return entities.freightForwarders || [];
      default:
        return [];
    }
  };

  const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedEntity = getFilteredEntities().find(entity => entity.id === selectedId);
    setValue('entity.id', selectedId);
    setValue('entity.name', selectedEntity?.name || '');
    setValue('entity.document', selectedEntity?.taxId || '');
  };

  const handleSave = async (data: any) => {
    try {
      setLoading(true);
      if (transaction) {
        await updateTransaction(transaction.id, data);
      } else {
        await addTransaction(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-6 p-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <DollarSign className="h-6 w-6 mr-2 text-primary-600" />
          {transaction ? 'Edit Transaction' : 'New Transaction'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="receivable">Receivable</option>
            <option value="payable">Payable</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reference Number</label>
          <input
            type="text"
            {...register('referenceNumber')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Entity Type</label>
          <select
            {...register('entity.type')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="agent">International Agent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Entity</label>
          <select
            value={watch('entity.id')}
            onChange={handleEntityChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Entity</option>
            {getFilteredEntities().map(entity => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              step="0.01"
              {...register('amount')}
              className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            {...register('currency')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BRL">BRL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
          <input
            type="number"
            step="0.0001"
            {...register('exchangeRate')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Issue Date</label>
          <DatePickerField
            selected={new Date(watch('issueDate'))}
            onChange={(date) => form.setValue('issueDate', date?.toISOString() || '')}
            label=""
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <DatePickerField
            selected={new Date(watch('dueDate'))}
            onChange={(date) => form.setValue('dueDate', date?.toISOString() || '')}
            label=""
            minDate={new Date(watch('issueDate'))}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={2}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            {...register('notes')}
            rows={2}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
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
          {loading ? 'Saving...' : (transaction ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
}