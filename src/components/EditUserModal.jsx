import React, { useState, useEffect } from 'react';
import './EditUserModal.css';

const EditUserModal = ({ isOpen, onClose, onEditUser, user }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditUser(user.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Administrative User</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">FULL LEGAL NAME</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full legal name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">CORPORATE EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter corporate email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">PHONE NUMBER</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
