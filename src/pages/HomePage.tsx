import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// High-quality logistics images from Unsplash
const HERO_IMAGE = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070";

export default function HomePage() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'manager') {
        navigate('/dashboard');
      } else if (user.role === 'customer') {
        navigate('/customer');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, don't render the homepage content
  if (user) return null;

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleTrackShipment = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Global Logistics"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-display font-bold text-white tracking-tight sm:text-6xl">
              Global Logistics Solutions for Modern Business
            </h1>
            <p className="mt-6 text-xl text-gray-100 max-w-2xl">
              Streamline your international shipping with our comprehensive freight forwarding platform. From ocean freight to air cargo, we handle it all.
            </p>
            <div className="mt-10 flex gap-4">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={handleTrackShipment}
                className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                Track Shipment
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}