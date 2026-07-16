import React, { useState } from 'react';
import './UserTable.css';

const UserTable = ({ users, onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTotalPages = Math.ceil(filteredUsers.length / 6);

  // Reset to page 1 when search query changes
  React.useEffect(() => {
    setLocalCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setLocalCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="user-table-container">
      <div className="table-header">
        <h3>All Users</h3>
        <div className="table-actions">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Last Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="user-name-cell">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-id">{user.id}</span>
                </div>
              </td>
              <td className="user-email">{user.email}</td>
              <td className="user-phone">{user.phone}</td>
              <td className="user-last-payment">{user.lastPaymentDate}</td>
              <td className="user-actions">
                <button 
                  className="action-btn edit-btn" 
                  onClick={() => onEdit(user)}
                  title="Edit User"
                >
                  ✏️
                </button>
                <button 
                  className="action-btn delete-btn" 
                  onClick={() => onDelete(user)}
                  title="Delete User"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <div className="pagination-info">
          Showing {filteredUsers.length > 0 ? ((localCurrentPage - 1) * 6) + 1 : 0} - {Math.min(localCurrentPage * 6, filteredUsers.length)} of {filteredUsers.length} administrators
        </div>
        <div className="pagination-controls">
          <button 
            className="pagination-btn" 
            disabled={localCurrentPage === 1}
            onClick={() => handlePageChange(localCurrentPage - 1)}
          >
            &lt;
          </button>
          {[...Array(filteredTotalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn ${localCurrentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button 
            className="pagination-btn" 
            disabled={localCurrentPage === filteredTotalPages || filteredTotalPages === 0}
            onClick={() => handlePageChange(localCurrentPage + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
