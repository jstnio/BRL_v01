import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { Layout, ProtectedRoute, Toast } from './components';
import {
  HomePage,
  Login,
  Register,
  Profile,
  Settings,
  CustomerDashboard,
  ManagerDashboard,
  MaerskDashboard,
  MaerskTracking,
  CustomerList,
  ShippingLineList,
  FreightForwarderList,
  AirportList,
  PortList,
  AirlineList,
  CustomsBrokerList,
  TruckerList,
  TerminalList,
  QuoteDashboard,
  QuoteDetails,
  NewQuote,
  FinancialManagement,
  NewTransaction
} from './pages';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="profile"
            element={
              <ProtectedRoute role={['customer', 'manager']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute role={['customer', 'manager']}>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          {/* Customer Routes */}
          <Route
            path="customer"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* MAERSK Routes */}
          <Route
            path="maersk"
            element={
              <ProtectedRoute role="manager">
                <MaerskDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="maersk/tracking"
            element={
              <ProtectedRoute role="manager">
                <MaerskTracking />
              </ProtectedRoute>
            }
          />

          {/* Financial Routes */}
          <Route
            path="financial"
            element={
              <ProtectedRoute role="manager">
                <FinancialManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="financial/new-transaction"
            element={
              <ProtectedRoute role="manager">
                <NewTransaction />
              </ProtectedRoute>
            }
          />

          {/* Quote Routes */}
          <Route
            path="quotes"
            element={
              <ProtectedRoute role="manager">
                <QuoteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="quotes/new"
            element={
              <ProtectedRoute role="manager">
                <NewQuote />
              </ProtectedRoute>
            }
          />
          <Route
            path="quotes/:id"
            element={
              <ProtectedRoute role="manager">
                <QuoteDetails />
              </ProtectedRoute>
            }
          />

          {/* Master Data Routes */}
          <Route
            path="master-data/customers"
            element={
              <ProtectedRoute role="manager">
                <CustomerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/shipping-lines"
            element={
              <ProtectedRoute role="manager">
                <ShippingLineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/freight-forwarders"
            element={
              <ProtectedRoute role="manager">
                <FreightForwarderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/airports"
            element={
              <ProtectedRoute role="manager">
                <AirportList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/ports"
            element={
              <ProtectedRoute role="manager">
                <PortList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/airlines"
            element={
              <ProtectedRoute role="manager">
                <AirlineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/customs-brokers"
            element={
              <ProtectedRoute role="manager">
                <CustomsBrokerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/truckers"
            element={
              <ProtectedRoute role="manager">
                <TruckerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/terminals"
            element={
              <ProtectedRoute role="manager">
                <TerminalList />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;