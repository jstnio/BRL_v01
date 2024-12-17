import { EntityList } from '../../components/common';
import { Airport } from '../../types/masterData';

export default function AirportList() {
  const renderExtraFields = (airport: Airport) => (
    <div className="space-y-1">
      <p className="text-sm font-medium">{airport.code}</p>
      <p className="text-sm text-gray-500">{airport.type}</p>
    </div>
  );

  return (
    <EntityList
      collectionName="airports"
      title="Airports"
      renderExtraFields={renderExtraFields}
    />
  );
}