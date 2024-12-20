import { useState } from 'react';
import { Card, Row, Col, Form, Input, DatePicker, Select } from 'antd';
import { Package, DollarSign } from 'lucide-react';
import { Button } from '../components/Button';
import { LocationSelect } from '../components/LocationSelect';

const { Option } = Select;

interface QuotationForm {
  origin: string;
  destination: string;
  cargoType: string;
  weight: number;
  volume: number;
  containerType?: string;
  departureDate: Date;
}

export default function QuotationPage() {
  const [loading, setLoading] = useState(false);
  const [quotation, setQuotation] = useState<any>(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values: QuotationForm) => {
    setLoading(true);
    try {
      // TODO: Call quotation API
      const mockQuotation = {
        oceanFreight: {
          baseRate: 2500,
          surcharges: 350,
          total: 2850,
          transitTime: '25-30 days',
          carrier: 'Maersk Line'
        },
        airFreight: {
          baseRate: 4800,
          surcharges: 650,
          total: 5450,
          transitTime: '3-5 days',
          carrier: 'Emirates SkyCargo'
        }
      };
      setQuotation(mockQuotation);
    } catch (error) {
      console.error('Error fetching quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <DollarSign className="h-8 w-8 text-primary-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Get Quote</h1>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Shipment Details">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="origin"
                    label="Origin"
                    rules={[{ required: true, message: 'Please select origin' }]}
                  >
                    <LocationSelect placeholder="Select origin location" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="destination"
                    label="Destination"
                    rules={[{ required: true, message: 'Please select destination' }]}
                  >
                    <LocationSelect placeholder="Select destination location" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="cargoType"
                    label="Cargo Type"
                    rules={[{ required: true, message: 'Please select cargo type' }]}
                  >
                    <Select placeholder="Select cargo type">
                      <Option value="general">General Cargo</Option>
                      <Option value="hazardous">Hazardous</Option>
                      <Option value="perishable">Perishable</Option>
                      <Option value="valuable">Valuable</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="containerType"
                    label="Container Type"
                  >
                    <Select placeholder="Select container type">
                      <Option value="20ft">20ft Standard</Option>
                      <Option value="40ft">40ft Standard</Option>
                      <Option value="40hc">40ft High Cube</Option>
                      <Option value="reefer">Reefer</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="weight"
                    label="Weight (kg)"
                    rules={[{ required: true, message: 'Please enter weight' }]}
                  >
                    <Input type="number" min={0} placeholder="Enter weight" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="volume"
                    label="Volume (m³)"
                    rules={[{ required: true, message: 'Please enter volume' }]}
                  >
                    <Input type="number" min={0} placeholder="Enter volume" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="departureDate"
                    label="Departure Date"
                    rules={[{ required: true, message: 'Please select date' }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full"
                  >
                    Get Quote
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          {quotation && (
            <div className="space-y-6">
              <Card title="Ocean Freight Quote">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Rate</span>
                    <span className="font-medium">${quotation.oceanFreight.baseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surcharges</span>
                    <span className="font-medium">${quotation.oceanFreight.surcharges}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">${quotation.oceanFreight.total}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Transit Time: {quotation.oceanFreight.transitTime}</p>
                    <p>Carrier: {quotation.oceanFreight.carrier}</p>
                  </div>
                </div>
              </Card>

              <Card title="Air Freight Quote">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Rate</span>
                    <span className="font-medium">${quotation.airFreight.baseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surcharges</span>
                    <span className="font-medium">${quotation.airFreight.surcharges}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">${quotation.airFreight.total}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Transit Time: {quotation.airFreight.transitTime}</p>
                    <p>Carrier: {quotation.airFreight.carrier}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {!quotation && (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4" />
                <p>Fill out the form to get your freight quotes</p>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
