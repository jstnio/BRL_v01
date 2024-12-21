import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { initializeData } from './services/initializeData';
import {
  HomePage,
  Login,
  Register,
  Dashboard,
  CustomerDashboard,
  AdminDashboard,
  NewShipment,
  ShipmentList,
  ShipmentDetails,
  MasterData,
  QuotationPage,
  TariffsPage,
  QuoteDetails,
  NewQuote,
  QuoteDashboard
} from './pages';
import {
  AirlineList,
  AirportList,
  CustomerList,
  CustomsBrokerList,
  FreightForwarderList,
  PortList,
  ShippingLineList,
  TerminalList,
  TruckerList
} from './pages/master-data';
import Apollo from './pages/Apollo';

export default function App() {
  const { user, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (user) {
      initializeData();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Toaster />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute role="manager">
                  <Dashboard />
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

            {/* Admin Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Shipment Routes */}
            <Route
              path="shipments"
              element={
                <ProtectedRoute>
                  <ShipmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="shipments/:id"
              element={
                <ProtectedRoute>
                  <ShipmentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="shipments/new"
              element={
                <ProtectedRoute>
                  <NewShipment />
                </ProtectedRoute>
              }
            />

            {/* Master Data Routes */}
            <Route
              path="master-data"
              element={
                <ProtectedRoute role="manager">
                  <MasterData />
                </ProtectedRoute>
              }
            >
              <Route path="airlines" element={<AirlineList />} />
              <Route path="airports" element={<AirportList />} />
              <Route path="customers" element={<CustomerList />} />
              <Route path="customs-brokers" element={<CustomsBrokerList />} />
              <Route path="freight-forwarders" element={<FreightForwarderList />} />
              <Route path="ports" element={<PortList />} />
              <Route path="shipping-lines" element={<ShippingLineList />} />
              <Route path="terminals" element={<TerminalList />} />
              <Route path="truckers" element={<TruckerList />} />
            </Route>

            {/* Quotation and Tariffs Routes */}
            <Route 
              path="quotation" 
              element={
                <ProtectedRoute>
                  <QuotationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="quotes" 
              element={
                <ProtectedRoute>
                  <QuoteDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="quotes/new" 
              element={
                <ProtectedRoute>
                  <NewQuote />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="quotes/:id" 
              element={
                <ProtectedRoute>
                  <QuoteDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="tariffs" 
              element={
                <ProtectedRoute>
                  <TariffsPage />
                </ProtectedRoute>
              } 
            />

            {/* Apollo Route */}
            <Route
              path="apollo"
              element={
                <ProtectedRoute role="manager">
                  <Apollo />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}