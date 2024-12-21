import EntityList from '../../components/master-data/EntityList';

const fields = [
  { key: 'code', label: 'IATA Code', required: true, placeholder: 'e.g., JFK' },
  { key: 'name', label: 'Name', required: true, placeholder: 'e.g., John F. Kennedy International Airport' },
  { key: 'city', label: 'City', required: true, placeholder: 'e.g., New York' },
  { key: 'country', label: 'Country', required: true, placeholder: 'e.g., United States' }
];

export default function AirportList() {
  return (
    <EntityList
      collectionName="airports"
      title="Airports"
      fields={fields}
    />
  );
}
