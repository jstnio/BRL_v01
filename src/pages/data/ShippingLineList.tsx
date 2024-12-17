import { useEffect, useState } from 'react';
import { useMasterDataStore } from '../../store/masterDataStore';
import { ShippingLine } from '../../types/masterData';
import { Plus, Search, Edit2, Trash2, Ship } from 'lucide-react';
import ShippingLineForm from '../../components/forms/ShippingLineForm';

export default function ShippingLineList() {
  const { entities, loading, fetchEntities, deleteEntity } = useMasterDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<ShippingLine | undefined>();

  useEffect(() => {
    fetchEntities('shippingLines');
  }, [fetchEntities]);

  const handleEdit = (entity: ShippingLine) => {
    setSelectedEntity(entity);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shipping line?')) {
      try {
        await deleteEntity('shippingLines', id);
      } catch (error) {
        console.error('Error deleting shipping line:', error);
      }
    }
  };

  const filteredEntities = (entities.shippingLines as ShippingLine[] || []).filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ... rest of the component implementation ... */}
    </div>
  );
}