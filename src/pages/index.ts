export { default as HomePage } from './HomePage';
export { default as Login } from './Login';
export { default as Register } from './Register';
export { default as Profile } from './Profile';
export { default as Settings } from './Settings';

// Dashboard Pages
export { CustomerDashboard, ManagerDashboard } from './dashboard';

// MAERSK Pages
export { MaerskDashboard, MaerskTracking } from './maersk';

// Data Pages
export {
  CustomerList,
  ShippingLineList,
  FreightForwarderList,
  AirportList,
  PortList,
  AirlineList,
  CustomsBrokerList,
  TruckerList,
  TerminalList
} from './data';

// Financial Pages
export { default as FinancialManagement } from './FinancialManagement';
export { default as NewTransaction } from './NewTransaction';

// Quote Pages
export { default as QuoteDashboard } from './QuoteDashboard';
export { default as QuoteDetails } from './QuoteDetails';
export { default as NewQuote } from './NewQuote';