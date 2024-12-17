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
      {/* Navbar implementation */}
    </nav>
  );
};

export default Navbar;