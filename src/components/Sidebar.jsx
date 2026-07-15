import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'account', label: 'Account Management', icon: '👤' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'fraud', label: 'Fraud Detection', icon: '🛡️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

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
            className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onItemClick(item.id)}
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
