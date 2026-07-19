import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const initialFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  role: "admin",
};

const AddUserModal = ({
  isOpen,
  onClose,
  onAddUser,
  isSaving,
  error,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      formData.password.length < 6 ||
      formData.password !== formData.confirmPassword
    ) {
      return;
    }

    try {
      await onAddUser(formData);

      setFormData(initialFormState);
      setShowPassword(false);
      setShowConfirmPassword(false);
      onClose();
    } catch (error) {
      // Keep modal open and preserve entered values.
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Add New User
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a system account and assign the appropriate role.
            </p>
          </div>

          <button
            type="button"
            className="text-2xl text-slate-400 hover:text-slate-600"
            onClick={onClose}
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="text-sm font-medium uppercase tracking-wide text-slate-600"
              htmlFor="fullName"
            >
              Full Name
            </label>

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
            <label
              className="text-sm font-medium uppercase tracking-wide text-slate-600"
              htmlFor="email"
            >
              Corporate Email Address
            </label>

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
            <label
              className="text-sm font-medium uppercase tracking-wide text-slate-600"
              htmlFor="phone"
            >
              Phone Number
            </label>

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

          {/* Temporary Password */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium uppercase tracking-wide text-slate-600"
              htmlFor="password"
            >
              Temporary Password
            </label>

            <div className="relative">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter at least 6 characters"
                minLength={6}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previousValue) => !previousValue)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 shrink-0 text-slate-400 hover:text-slate-600"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium uppercase tracking-wide text-slate-600"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (previousValue) => !previousValue
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 shrink-0 text-slate-400 hover:text-slate-600"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium uppercase tracking-wide text-slate-600"
              htmlFor="role"
            >
              Role
            </label>

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
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;