import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../Button';

interface Props {
  onSearch: (params: {
    carrierBookingReference?: string;
    transportDocumentReference?: string;
    equipmentReference?: string;
  }) => void;
}

export default function TrackingSearch({ onSearch }: Props) {
  const [searchType, setSearchType] = useState<'booking' | 'document' | 'equipment'>('document');
  const [searchValue, setSearchValue] = useState('');

  const detectSearchType = (value: string): 'booking' | 'document' | 'equipment' => {
    const cleanValue = value.trim().toUpperCase();
    
    // Check for Maersk booking reference format
    if (cleanValue.startsWith('MAE')) {
      return 'booking';
    }
    
    // Check for container number format
    if (cleanValue.match(/^[A-Z]{4}\d{7}$/) || cleanValue.match(/^MAEU\d{7}$/)) {
      return 'equipment';
    }
    
    // Default to document reference
    return 'document';
  };

  const handleSearch = () => {
    if (!searchValue) return;

    const cleanValue = searchValue.trim().toUpperCase();
    const detectedType = detectSearchType(cleanValue);
    
    // Update the search type if it was auto-detected
    if (searchType !== detectedType) {
      setSearchType(detectedType);
    }

    let formattedValue = cleanValue;
    
    // Only format if it doesn't already have the correct prefix
    if (detectedType === 'booking' && !formattedValue.startsWith('MAE')) {
      formattedValue = `MAE${formattedValue}`;
    }

    if (detectedType === 'equipment' && !formattedValue.match(/^[A-Z]{4}\d{7}$/)) {
      if (formattedValue.match(/^\d+$/)) {
        formattedValue = `MAEU${formattedValue.padStart(7, '0')}`;
      }
    }

    const params = {
      carrierBookingReference: detectedType === 'booking' ? formattedValue : undefined,
      transportDocumentReference: detectedType === 'document' ? formattedValue : undefined,
      equipmentReference: detectedType === 'equipment' ? formattedValue : undefined,
    };

    console.log('Searching with params:', params);
    onSearch(params);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        <div className="flex space-x-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="document">Document Reference</option>
            <option value="booking">Booking Reference</option>
            <option value="equipment">Equipment Reference</option>
          </select>
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={`Enter ${searchType} reference...`}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button onClick={handleSearch} disabled={!searchValue}>
            Track
          </Button>
        </div>
      </div>
    </div>
  );
}