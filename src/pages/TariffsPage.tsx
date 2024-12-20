import React, { useState } from 'react';
import { Card, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import TariffSearchForm from '../components/tariffs/TariffSearchForm';
import { fetchTariffs, TariffRequest, Tariff } from '../services/ecuTariffs';

const TariffsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);

  const columns: TableColumnsType<Tariff> = [
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: 'Traffic',
      dataIndex: 'traffic',
      key: 'traffic',
    },
    {
      title: 'Origin',
      dataIndex: ['pol', 'name'],
      key: 'origin',
      render: (_, record) => (
        `${record.pol.name} (${record.pol.unCode}) - ${record.pol.countryCode}`
      ),
    },
    {
      title: 'Destination',
      dataIndex: ['pod', 'name'],
      key: 'destination',
      render: (_, record) => (
        `${record.pod.name} (${record.pod.unCode}) - ${record.pod.countryCode}`
      ),
    },
    {
      title: 'Booking Office',
      dataIndex: ['bookingOffice', 'name'],
      key: 'bookingOffice',
      render: (_, record) => (
        `${record.bookingOffice.name} - ${record.bookingOffice.location}`
      ),
    },
  ];

  const handleSearch = async (request: TariffRequest) => {
    setLoading(true);
    try {
      const results = await fetchTariffs(request);
      setTariffs(results);
      if (results.length === 0) {
        message.info('No tariffs found for the selected criteria');
      }
    } catch (error) {
      console.error('Error fetching tariffs:', error);
      message.error('Failed to fetch tariffs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Search Tariffs" style={{ marginBottom: '24px' }}>
        <TariffSearchForm onSearch={handleSearch} loading={loading} />
      </Card>

      <Card title="Tariff Results">
        <Table
          columns={columns}
          dataSource={tariffs}
          rowKey={(record) => `${record.pol.unCode}-${record.pod.unCode}`}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default TariffsPage;
