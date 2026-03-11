import React, { createContext, useState, useCallback } from 'react';
import './Notification.css';

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <div className="notification-container">
        {notifications.map((n) => (
          <div key={n.id} className={`toast ${n.type}`}>
            <span className="toast-icon">{n.type === 'success' ? '🐾' : '⚠️'}</span>
            <span className="toast-message">{n.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};