import React, { useState } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Add New Administrative User</h2>
          <button className="text-2xl text-slate-400 hover:text-slate-600" onClick={onClose} type="button">×</button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-slate-600" htmlFor="fullName">FULL LEGAL NAME</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full legal name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-slate-600" htmlFor="email">CORPORATE EMAIL ADDRESS</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter corporate email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-slate-600" htmlFor="password">CORPORATE TEMPORARY PASSWORD</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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

          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-slate-600" htmlFor="phone">PHONE NUMBER</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
