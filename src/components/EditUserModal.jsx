import React, { useEffect, useState } from 'react';

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  role: 'admin',
};

const EditUserModal = ({ isOpen, onClose, onEditUser, user, isUpdating, error }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'admin',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.role) {
      return;
    }

    try {
      await onEditUser(formData);
      onClose();
    } catch (error) {
      // Keep the modal open and preserve entered values.
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit User</h2>
            <p className="mt-1 text-sm text-slate-500">Update the user details and access role.</p>
          </div>
          <button className="text-2xl text-slate-400 hover:text-slate-600" onClick={onClose} type="button">×</button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-slate-600" htmlFor="fullName">Full Name</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-slate-600" htmlFor="email">Email Address</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-slate-600" htmlFor="phone">Phone Number</label>
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

          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-slate-600" htmlFor="role">Role</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
