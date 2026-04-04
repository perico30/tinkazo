import React, { useEffect, useState } from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      const unmountTimer = setTimeout(onClose, 300); // Wait for fade-out to finish
      return () => clearTimeout(unmountTimer);
    }, 3000); // 3 seconds visible

    return () => clearTimeout(exitTimer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 transform transition-all duration-300 ease-out z-50 ${
        isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-4 bg-gray-800 text-white font-semibold px-6 py-3 rounded-full shadow-2xl border border-gray-700">
        <CheckCircleIcon className="h-6 w-6 text-green-400" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
