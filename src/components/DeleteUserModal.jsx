import React from 'react';

const DeleteUserModal = ({ isOpen, onClose, onDeleteUser, user, isDeleting, error }) => {
  const handleDelete = async () => {
    try {
      await onDeleteUser();
      onClose();
    } catch (error) {
      // Keep the modal open and preserve the current state.
    }
  };

  const displayName = user?.name || 'this user';
  const userId = user?._id || user?.id || '-';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Delete User</h2>
          <button className="text-2xl text-slate-400 hover:text-slate-600" onClick={onClose} type="button">×</button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <span className="text-lg">⚠️</span>
            <p>Are you sure you want to permanently delete {displayName}?</p>
          </div>

          {user && (
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
                {(displayName || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{displayName}</h4>
                <p className="text-sm text-slate-600">{user.email || '-'}</p>
                <p className="text-sm text-slate-500">{userId}</p>
              </div>
            </div>
          )}

          <p className="text-sm text-slate-600">
            This action permanently removes the user from the system and cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-400" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
