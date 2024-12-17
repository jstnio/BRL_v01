import { useNavigate } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import TransactionForm from '../components/financial/TransactionForm';

export default function NewTransaction() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center">
          <Receipt className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Transaction</h1>
            <p className="mt-2 text-gray-600">Create a new financial transaction</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        <TransactionForm onClose={() => navigate('/financial')} />
      </div>
    </div>
  );
}