import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFinancialStore } from '../../store/financialStore';
import { PaymentRecord, PaymentMethod } from '../../types/financial';
import { X, DollarSign, Calendar } from 'lucide-react';
import { Button } from '../Button';
import DatePickerField from '../DatePickerField';

interface Props {
  transactionId: string;
  payment?: PaymentRecord;
  onClose: () => void;
}

export default function PaymentForm({ transactionId, payment, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { addPayment, updatePayment } = useFinancialStore();

  const form = useForm({
    defaultValues: payment || {
      transactionId,
      amount: 0,
      currency: 'USD',
      paymentDate: new Date().toISOString(),
      paymentMethod: 'bank_transfer',
      referenceNumber: '',
      notes: ''
    }
  });

  const { register, handleSubmit, watch } = form;

  const handleSave = async (data: any) => {
    try {
      setLoading(true);
      if (payment) {
        await updatePayment(payment.id, data);
      } else {
        await addPayment(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {payment ? 'Edit Payment' : 'Record Payment'}
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
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            {...register('paymentMethod')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
            <option value="check">Check</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Date</label>
          <DatePickerField
            selected={new Date(watch('paymentDate'))}
            onChange={(date) => form.setValue('paymentDate', date?.toISOString() || '')}
            label=""
            maxDate={new Date()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reference Number</label>
          <input
            type="text"
            {...register('referenceNumber')}
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
          {loading ? 'Saving...' : (payment ? 'Update' : 'Record Payment')}
        </Button>
      </div>
    </form>
  );
}