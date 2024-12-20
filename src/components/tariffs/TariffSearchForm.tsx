import React from 'react';
import { Form, Select, Button, Switch, DatePicker } from 'antd';
import LocationSelect from './LocationSelect';
import { TariffRequest } from '../../services/ecuTariffs';

const { Option } = Select;

interface TariffSearchFormProps {
  onSearch: (values: TariffRequest) => void;
  loading?: boolean;
}

const TariffSearchForm: React.FC<TariffSearchFormProps> = ({ onSearch, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const request: TariffRequest = {
      product: values.product,
      from: values.from,
      to: values.to,
      terms: values.terms,
      accountId: 519222,
      valid_on: values.valid_on?.toISOString(),
      haz: values.haz || false,
      fr: values.fr || false
    };
    onSearch(request);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        product: 'LCL',
        terms: 'prepaid',
        haz: false,
        fr: false
      }}
    >
      <Form.Item
        name="product"
        label="Product Type"
        rules={[{ required: true, message: 'Please select a product type' }]}
      >
        <Select>
          <Option value="LCL">LCL</Option>
          <Option value="FCL">FCL</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="terms"
        label="Freight Terms"
        rules={[{ required: true, message: 'Please select freight terms' }]}
      >
        <Select>
          <Option value="prepaid">Prepaid</Option>
          <Option value="collect">Collect</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="from"
        label="Origin"
        rules={[{ required: true, message: 'Please select origin location' }]}
      >
        <LocationSelect placeholder="Search origin location" />
      </Form.Item>

      <Form.Item
        name="to"
        label="Destination"
        rules={[{ required: true, message: 'Please select destination location' }]}
      >
        <LocationSelect placeholder="Search destination location" />
      </Form.Item>

      <Form.Item name="valid_on" label="Valid On">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="haz" label="Hazardous Materials" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="fr" label="Include Future Rates" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Search Tariffs
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TariffSearchForm;
