import React, { createContext, useState, useCallback } from 'react';
import './Notification.css';

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 8000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <div className="notification-container">
        {notifications.map((n) => (
          <div key={n.id} className={`toast ${n.type}`}>
            <div className="toast-content">
              <span className="toast-icon">{n.type === 'success' ? '🐾' : '⚠️'}</span>
              <span className="toast-message">{n.message}</span>
            </div>
            <button className="toast-close" onClick={() => removeNotification(n.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};