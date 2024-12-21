import EntityList from '../../components/master-data/EntityList';

const fields = [
  { key: 'name', label: 'Name', required: true, placeholder: 'Full Name' },
  { key: 'company', label: 'Company', required: true, placeholder: 'Company Name' },
  { key: 'iataCode', label: 'IATA Code', placeholder: 'IATA Code' },
  { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'email@company.com' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
  { key: 'address', label: 'Address', placeholder: 'Street Address' },
  { key: 'city', label: 'City', placeholder: 'City' },
  { key: 'country', label: 'Country', placeholder: 'Country' }
];

export default function FreightForwarderList() {
  return (
    <EntityList
      collectionName="freightForwarders"
      title="Freight Forwarders"
      fields={fields}
    />
  );
}
