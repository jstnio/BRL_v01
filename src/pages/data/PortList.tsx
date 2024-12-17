import { EntityList } from '../../components/common';
import { Port } from '../../types/masterData';

export default function PortList() {
  const renderExtraFields = (port: Port) => (
    <div className="space-y-1">
      <p className="text-sm font-medium">{port.code}</p>
      <p className="text-sm text-gray-500">{port.type}</p>
    </div>
  );

  return (
    <EntityList
      collectionName="ports"
      title="Ports"
      renderExtraFields={renderExtraFields}
    />
  );
}