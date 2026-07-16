import React, { useState } from 'react';
import './AddUserModal.css';

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
      return;
    }

    onAddUser(formData);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Administrative User</h2>
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
  <label htmlFor="password">CORPORATE TEMPORARY PASSWORD</label>
  <input
    type="password"
    id="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Enter 6-digit password"
    pattern="\d{6}"
    maxLength="6"
    inputMode="numeric"
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
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
