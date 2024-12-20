import { ShipmentStatus } from '../../types';

interface Props {
  status: ShipmentStatus;
}

export default function StatusBadge({ status }: Props) {
  const getStatusStyles = (status: ShipmentStatus) => {
    switch (status) {
      case 'arrived':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
}
