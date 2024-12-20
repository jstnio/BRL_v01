import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import { Users, Package, Settings, Database, DollarSign, BarChart2 } from 'lucide-react';
import { Button } from '../components/Button';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Users', value: 156, icon: <Users className="h-6 w-6 text-blue-500" /> },
    { title: 'Active Shipments', value: 448, icon: <Package className="h-6 w-6 text-blue-500" /> },
    { title: 'System Health', value: '99.9%', icon: <Settings className="h-6 w-6 text-blue-500" /> },
    { title: 'Database Size', value: '2.1 GB', icon: <Database className="h-6 w-6 text-blue-500" /> },
    { title: 'Monthly Revenue', value: '$125K', icon: <DollarSign className="h-6 w-6 text-blue-500" /> },
    { title: 'Growth Rate', value: '+12.5%', icon: <BarChart2 className="h-6 w-6 text-blue-500" /> },
  ];

  const quickActions = [
    { title: 'Manage Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { title: 'Master Data', path: '/master-data', icon: <Database className="h-5 w-5" /> },
    { title: 'System Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
    { title: 'View Reports', path: '/admin/reports', icon: <BarChart2 className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={8}>
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Button
                onClick={() => navigate(action.path)}
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2"
              >
                {action.icon}
                {action.title}
              </Button>
            </Col>
          ))}
        </Row>
      </div>

      {/* System Status */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-900">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Server Load</span>
              <span className="text-gray-900">42%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
