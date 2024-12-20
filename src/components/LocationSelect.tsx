import { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { searchLocations } from '../lib/api';

const { Option } = Select;

interface Location {
  id: string;
  city: string;
  country: string;
  code: string;
}

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function LocationSelect({ value, onChange, placeholder }: Props) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Location[]>([]);

  const fetchLocations = async (searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const locations = await searchLocations(searchText);
      setOptions(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchLocations, 500);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, []);

  const handleSearch = (searchText: string) => {
    debouncedFetch(searchText);
  };

  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      className="w-full"
    >
      {options.map((location) => (
        <Option key={location.id} value={location.id}>
          {location.city}, {location.country} ({location.code})
        </Option>
      ))}
    </Select>
  );
}
