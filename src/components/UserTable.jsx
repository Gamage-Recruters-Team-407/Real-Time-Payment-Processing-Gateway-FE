import React from 'react';
import { Pencil, RefreshCw, Search, Trash2 } from 'lucide-react';
import { getRoleLabel } from '../services/userService';

const UserTable = ({
  users,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleChange,
  onClearFilters,
  onRefresh,
  loading,
  totalUsers,
  pageSize,
}) => {
  const start = totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalUsers);

  const formatDate = (value) => {
    if (!value) return '-';
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? '-' : parsedDate.toLocaleDateString();
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="m-0 text-xl font-semibold text-[#1a1a2e]">All Users</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-[220px] border-none bg-transparent text-sm outline-none"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>

          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
            onClick={onRefresh}
          >
            <span className="flex items-center gap-2">
              <RefreshCw size={14} />
              Refresh
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead className="bg-[#f8fafc]">
            <tr>
              <th className="border-b-2 border-gray-200 p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
              <th className="border-b-2 border-gray-200 p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</th>
              <th className="border-b-2 border-gray-200 p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Phone Number</th>
              <th className="border-b-2 border-gray-200 p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
              <th className="border-b-2 border-gray-200 p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Created Date</th>
              <th className="border-b-2 border-gray-200 p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-sm text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-sm text-slate-500">
                  {searchTerm || roleFilter ? 'No users match the selected search or role.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const displayName = user?.name || 'Unknown User';
                const initials = displayName.charAt(0).toUpperCase();
                const userId = user?._id || user?.id || '-';

                return (
                  <tr key={userId} className="border-b border-gray-200 transition-colors duration-200 hover:bg-[#f8fafc]">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-xl font-semibold text-white">
                          {initials}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-[#1a1a2e]">{displayName}</span>
                          <span className="text-xs text-gray-400">{userId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-sm text-gray-600">{user?.email || '-'}</td>
                    <td className="p-4 align-middle text-sm text-gray-600">{user?.phone || '-'}</td>
                    <td className="p-4 align-middle text-sm text-gray-600">{getRoleLabel(user?.role || '')}</td>
                    <td className="p-4 align-middle text-sm text-gray-600">{formatDate(user?.createdAt)}</td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-lg border-none bg-gray-100 text-base text-gray-600 transition-all hover:bg-gray-200 hover:text-[#1a1a2e]"
                          onClick={() => onEdit(user)}
                          title="Edit User"
                          type="button"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-lg border-none bg-red-50 text-red-500 transition-all hover:bg-red-100 hover:text-red-600"
                          onClick={() => onDelete(user)}
                          title="Delete User"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
        <div className="text-sm text-gray-500">
          Showing {start} - {end} of {totalUsers} users
        </div>
        <div className="flex gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            type="button"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100 ${
                currentPage === page ? 'border-emerald-500 bg-emerald-500 text-white' : ''
              }`}
              onClick={() => onPageChange(page)}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => onPageChange(currentPage + 1)}
            type="button"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
