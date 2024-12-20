import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;