import EntityList from '../../components/master-data/EntityList';

const fields = [
  { key: 'code', label: 'SCAC Code', required: true, placeholder: 'e.g., MAEU' },
  { key: 'name', label: 'Name', required: true, placeholder: 'e.g., Maersk Line' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'contact@shipping.com' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
  { key: 'website', label: 'Website', type: 'url', placeholder: 'https://www.shipping.com' },
  { key: 'country', label: 'Country', placeholder: 'e.g., Denmark' }
];

export default function ShippingLineList() {
  return (
    <EntityList
      collectionName="shippingLines"
      title="Shipping Lines"
      fields={fields}
    />
  );
}
