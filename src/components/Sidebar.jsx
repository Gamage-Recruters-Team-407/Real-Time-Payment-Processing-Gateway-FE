import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ activeItem, onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item) => {
    if (typeof onItemClick === 'function') {
      onItemClick(item.id);
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const menuItems = [
    { id: 'account', label: 'Account Management', icon: '👤', path: '/profile' },
    { id: 'users', label: 'User Management', icon: '👥', path: '/user-management' },
    { id: 'fraud', label: 'Fraud Detection', icon: '🛡️', path: '/fraud-detection' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/notifications' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  const currentActiveItem = activeItem || (menuItems.find((item) => item.path === location.pathname)?.id || 'account');

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Gamage Pay</h2>
        <p>Admin Portal</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${currentActiveItem === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="new-analysis-btn">
          <span>📊</span>
          <span>New Analysis</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
