import { useForm } from 'react-hook-form';
import { ShippingLine } from '../../types/masterData';
import { EntityForm } from '../common';
import { ContactTable } from '../contacts';

export default function ShippingLineForm({ entity, onClose }: { entity?: ShippingLine; onClose: () => void }) {
  const form = useForm({
    defaultValues: entity || {
      name: '',
      country: '',
      office: '',
      phone: '',
      accountExecutive: {
        name: '',
        email: '',
        phone: '',
        mobile: ''
      },
      notes: '',
      active: true
    }
  });

  const { register } = form;

  const extraFields = (
    <div className="space-y-6">
      {/* Form fields implementation */}
    </div>
  );

  return (
    <EntityForm
      collectionName="shippingLines"
      entity={entity}
      onClose={onClose}
      title={entity ? 'Edit Shipping Line' : 'Add Shipping Line'}
      extraFields={extraFields}
      form={form}
    />
  );
}