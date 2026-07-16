import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserTable from '../components/UserTable';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import DeleteUserModal from '../components/DeleteUserModal';
import './UserManagement.css';

const STORAGE_KEY = 'admin-users';

const UserManagement = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(() => {
    if (typeof window === 'undefined') return [];

    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error('Failed to load users from storage:', error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  const totalPages = Math.ceil(users.length / 6);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAddUser = (formData) => {
    const newUser = {
      id: `UID-${Math.floor(Math.random() * 9000) + 1000}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (userId, formData) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, name: formData.fullName, email: formData.email, phone: formData.phone }
          : user
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDeleteUser = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleExportReport = () => {
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Last Payment Date'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.lastPaymentDate
      ].join(','))
    ].join('\n');

    // Create blob and download
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
    <div className="user-management-container">
      <Sidebar />
      
      <div className="main-content">
        <div className="content-header">
          <h1>Admin Access Control</h1>
          <div className="header-actions">
            {/* <input type="text" placeholder="Search..." className="header-search" /> */}
            <div className="user-profile">
              <span className="profile-name">
                {currentUser?.name || 'Admin'}
              </span>
              <div className="profile-avatar">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stat-item">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <button className="add-user-btn" onClick={() => setIsAddModalOpen(true)}>
            + Add User
          </button>
        </div>

        <UserTable 
          users={users}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <div className="page-footer">
          <button className="export-btn" onClick={handleExportReport}>
            Export Report
          </button>
        </div>
      </div>

      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddUser={handleAddUser}
      />

      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onEditUser={handleEditUser}
        user={selectedUser}
      />

      <DeleteUserModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onDeleteUser={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;
