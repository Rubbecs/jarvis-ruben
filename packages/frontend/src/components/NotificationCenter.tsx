import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { fetchNotifications } from '../api';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data.sort((a: Notification, b: Notification) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-900 border-red-700';
      case 'warning': return 'bg-yellow-900 border-yellow-700';
      case 'success': return 'bg-green-900 border-green-700';
      default: return 'bg-blue-900 border-blue-700';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-20 right-4 w-96 max-h-96 bg-slate-900 border border-blue-500 rounded-lg shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔔</span>
          <h3 className="font-semibold">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-gray-400">Loading...</div>
        )}
        {notifications.length === 0 && !loading && (
          <div className="p-4 text-center text-gray-400">No notifications</div>
        )}
        <div className="p-2 space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-3 rounded border ${getNotificationColor(notif.type)} ${
                notif.read ? 'opacity-60' : 'opacity-100'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">{getNotificationIcon(notif.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm break-words">{notif.message}</p>
                  <time className="text-xs text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
