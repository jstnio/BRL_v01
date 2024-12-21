import EntityList from '../../components/master-data/EntityList';

const fields = [
  { key: 'code', label: 'Terminal Code', required: true, placeholder: 'e.g., APMT' },
  { key: 'name', label: 'Name', required: true, placeholder: 'e.g., APM Terminals' },
  { key: 'port', label: 'Port', required: true, placeholder: 'e.g., Port of New York' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'contact@terminal.com' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
  { key: 'address', label: 'Address', placeholder: 'Terminal Address' },
  { key: 'city', label: 'City', placeholder: 'City' },
  { key: 'country', label: 'Country', placeholder: 'Country' }
];

export default function TerminalList() {
  return (
    <EntityList
      collectionName="terminals"
      title="Terminals"
      fields={fields}
    />
  );
}
