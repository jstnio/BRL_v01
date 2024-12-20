import { useCallback, useState } from 'react';
import { Select } from 'antd';
import { searchLocationsCodes } from '../../services/ecuCodes';
import debounce from 'lodash/debounce';

interface LocationOption {
  value: string;
  label: string;
  data: any;
}

interface LocationSelectProps {
  value?: string;
  onChange?: (value: string, option: LocationOption) => void;
  placeholder?: string;
}

const LocationSelect = ({
  value,
  onChange,
  placeholder = 'Search for a location...'
}: LocationSelectProps) => {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(async (searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchLocationsCodes(searchText);
      const formattedOptions = results.map(location => ({
        value: location.unCode,
        label: `${location.name} (${location.unCode}) - ${location.country}`,
        data: location
      }));
      setOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = debounce(fetchOptions, 300);

  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={debouncedFetch}
      onChange={(value, option) => onChange?.(value, option as LocationOption)}
      notFoundContent={loading ? 'Loading...' : 'No locations found'}
      options={options}
      style={{ width: '100%' }}
    />
  );
};

export default LocationSelect;
