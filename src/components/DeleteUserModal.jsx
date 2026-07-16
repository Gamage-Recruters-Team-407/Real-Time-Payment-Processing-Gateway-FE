import React from 'react';

const DeleteUserModal = ({ isOpen, onClose, onDeleteUser, user }) => {
  const handleDelete = () => {
    onDeleteUser(user.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Delete User</h2>
          <button className="text-2xl text-slate-400 hover:text-slate-600" onClick={onClose} type="button">×</button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <span className="text-lg">⚠️</span>
            <p>Are you sure you want to delete this user?</p>
          </div>

          {user && (
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{user.name}</h4>
                <p className="text-sm text-slate-600">{user.email}</p>
                <p className="text-sm text-slate-500">{user.id}</p>
              </div>
            </div>
          )}

          <p className="text-sm text-slate-600">
            This action cannot be undone. The user will be permanently removed from the system.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700" onClick={handleDelete}>
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
