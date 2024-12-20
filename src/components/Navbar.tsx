import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Menu, X, Package, Database, List, FileText, 
  ChevronDown, LogOut, Settings, User, DollarSign, Ship
} from 'lucide-react';
import { Transition } from '@headlessui/react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navigationItems = user?.role === 'manager' ? [
    { name: 'Shipments', path: '/manager', icon: Package },
    { name: 'MAERSK', path: '/maersk', icon: Ship },
    { name: 'Quotes', path: '/quotes', icon: FileText },
    { name: 'Financial', path: '/financial', icon: DollarSign },
    { name: 'Data', path: '/master-data', icon: Database },
  ] : [
    { name: 'My Shipments', path: '/customer', icon: Package },
  ];

  const userMenuItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-hubspot">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                BRL
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  <span className="mr-2">{user?.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <Transition
                show={showUserMenu}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;