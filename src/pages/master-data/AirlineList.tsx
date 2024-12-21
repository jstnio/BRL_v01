import EntityList from '../../components/master-data/EntityList';

const fields = [
  { key: 'code', label: 'Code', required: true, placeholder: 'e.g., AA' },
  { key: 'name', label: 'Name', required: true, placeholder: 'e.g., American Airlines' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'contact@airline.com' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
  { key: 'country', label: 'Country', placeholder: 'United States' }
];

export default function AirlineList() {
  return (
    <EntityList
      collectionName="airlines"
      title="Airlines"
      fields={fields}
    />
  );
}
