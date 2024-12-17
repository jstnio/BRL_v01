import { useEffect, useState } from 'react';
import { useMasterDataStore } from '../../store/masterDataStore';
import { FreightForwarder } from '../../types/masterData';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';
import FreightForwarderForm from '../../components/forms/FreightForwarderForm';

export default function FreightForwarderList() {
  const { entities, loading, fetchEntities, deleteEntity } = useMasterDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<FreightForwarder | undefined>();

  useEffect(() => {
    fetchEntities('freightForwarders');
  }, [fetchEntities]);

  const handleEdit = (entity: FreightForwarder) => {
    setSelectedEntity(entity);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this freight forwarder?')) {
      try {
        await deleteEntity('freightForwarders', id);
      } catch (error) {
        console.error('Error deleting freight forwarder:', error);
      }
    }
  };

  const filteredEntities = (entities.freightForwarders as FreightForwarder[] || []).filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ... rest of the component implementation ... */}
    </div>
  );
}