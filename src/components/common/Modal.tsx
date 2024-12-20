import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full min-w-[75%] max-w-[95%] bg-white rounded-lg shadow-xl transform transition-all">
          {title && (
            <div className="flex justify-between items-center border-b bg-gradient-to-r from-blue-50 to-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
          
          <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;