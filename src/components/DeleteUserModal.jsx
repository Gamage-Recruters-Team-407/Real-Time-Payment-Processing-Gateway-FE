import React from 'react';
import './DeleteUserModal.css';

const DeleteUserModal = ({ isOpen, onClose, onDeleteUser, user }) => {
  const handleDelete = () => {
    onDeleteUser(user.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container delete-modal">
        <div className="modal-header">
          <h2>Delete User</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="delete-warning">
            <span className="warning-icon">⚠️</span>
            <p>Are you sure you want to delete this user?</p>
          </div>
          
          {user && (
            <div className="user-preview">
              <div className="user-avatar">
                <img src={user.avatar} alt={user.name} />
              </div>
              <div className="user-details">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <p>{user.id}</p>
              </div>
            </div>
          )}

          <p className="delete-confirmation">
            This action cannot be undone. The user will be permanently removed from the system.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="delete-btn" onClick={handleDelete}>
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
