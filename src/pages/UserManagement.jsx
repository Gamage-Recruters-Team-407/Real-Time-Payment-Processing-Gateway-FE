import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserTable from '../components/UserTable';

import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import DeleteUserModal from '../components/DeleteUserModal';
import { useAuth } from '../context/AuthContext';
import {
  createUser,
  deleteUser,
  fetchUsers,
  getRoleLabel,
  normalizeRoleValue,
  updateUser,
} from '../services/userService';

const PAGE_SIZE = 6;

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [activeItem, setActiveItem] = useState('users');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, roleFilter]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await fetchUsers({
          page: currentPage,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          role: roleFilter,
        });

        setUsers(result.users || []);
        setTotalUsers(result.total || 0);
        setTotalPages(result.pages || 1);
        setCurrentPage(result.page || currentPage);
      } catch (err) {
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(1);
        setCurrentPage(1);
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPage, debouncedSearch, roleFilter, refreshTrigger]);

  const handleAddUser = async (formData) => {
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: normalizeRoleValue(formData.role),
      };

      await createUser(payload);
      setSuccessMessage('User created successfully');
      setIsAddModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to create user';
      setError(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditUser = async (formData) => {
    if (!selectedUser) return;

    setIsUpdating(true);
    setError('');

    try {
      const userId = selectedUser?._id || selectedUser?.id;
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: normalizeRoleValue(formData.role),
      };

      await updateUser(userId, payload);
      setSuccessMessage('User updated successfully');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to update user';
      setError(message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    setError('');

    try {
      const userId = selectedUser?._id || selectedUser?.id;
      await deleteUser(userId);
      setSuccessMessage('User deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to delete user';
      setError(message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    setSuccessMessage('Users refreshed');
  };

  const handleExportReport = () => {
    const headers = ['User ID', 'Name', 'Email', 'Phone', 'Role', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...users.map((user) => {
        const createdDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-';
        return [
          user?._id || user?.id || '',
          user?.name || '',
          user?.email || '',
          user?.phone || '',
          getRoleLabel(user?.role || ''),
          createdDate,
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
       

      <div className="ml-[260px] flex-1 overflow-y-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="m-0 text-[1.8rem] font-semibold text-[#1a1a2e]">Admin Access Control</h1>
         <Header />
        </div>

        <div className="mb-8 flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-500">Total Users</span>
            <span className="text-2xl font-bold text-emerald-500">{totalUsers}</span>
          </div>
          <button
            className="rounded-lg border-none bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add User
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <UserTable
          users={users}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          searchTerm={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          onClearFilters={handleClearFilters}
          onRefresh={handleRefresh}
          loading={loading}
          totalUsers={totalUsers}
          pageSize={PAGE_SIZE}
        />

        <div className="mt-8 flex justify-end">
          <button
            className="rounded-lg border-none bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={handleExportReport}
            disabled={users.length === 0}
          >
            Export Report
          </button>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
        isSaving={isSaving}
        error={error}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditUser={handleEditUser}
        user={selectedUser}
        isUpdating={isUpdating}
        error={error}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteUser={handleDeleteUser}
        user={selectedUser}
        isDeleting={isDeleting}
        error={error}
      />
    </div>
  );
};

export default UserManagement;
