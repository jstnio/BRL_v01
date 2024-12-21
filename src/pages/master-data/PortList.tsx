import EntityList from '../../components/master-data/EntityList';

const fields = [
  { key: 'code', label: 'Port Code', required: true, placeholder: 'e.g., USNYC' },
  { key: 'name', label: 'Name', required: true, placeholder: 'e.g., Port of New York' },
  { key: 'type', label: 'Type', required: true, placeholder: 'Sea Port / Air Port' },
  { key: 'city', label: 'City', required: true, placeholder: 'e.g., New York' },
  { key: 'country', label: 'Country', required: true, placeholder: 'e.g., United States' }
];

export default function PortList() {
  return (
    <EntityList
      collectionName="ports"
      title="Ports"
      fields={fields}
    />
  );
}
