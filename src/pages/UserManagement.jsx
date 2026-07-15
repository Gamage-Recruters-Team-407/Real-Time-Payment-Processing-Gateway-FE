import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserTable from '../components/UserTable';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import DeleteUserModal from '../components/DeleteUserModal';
import './UserManagement.css';

const UserManagement = () => {
  const [activeItem, setActiveItem] = useState('users');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([
    {
      id: 'UID-2901-X',
      name: 'Julian Vance',
      email: 'j.vance@paysecure.io',
      phone: '0761298256',
      lastPaymentDate: '2023-11-24',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 'UID-4412-M',
      name: 'Elena Rodriguez',
      email: 'e.rod@paysecure.io',
      phone: '0761298256',
      lastPaymentDate: '2023-11-23',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 'UID-1102-S',
      name: 'Arthur Sterling',
      email: 'sterling@paysecure.io',
      phone: '0761298256',
      lastPaymentDate: '2023-10-12',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: 'UID-8839-K',
      name: 'Sasha Kovar',
      email: 'skovar@paysecure.io',
      phone: '0761298256',
      lastPaymentDate: '2023-11-24',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    {
      id: 'UID-5521-P',
      name: 'Marcus Chen',
      email: 'm.chen@paysecure.io',
      phone: '0761298256',
      lastPaymentDate: '2023-11-20',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 'UID-3398-R',
      name: 'Priya Patel',
      email: 'p.patel@paysecure.io',
      phone: '0761298256',
      lastPaymentDate: '2023-11-18',
      avatar: 'https://i.pravatar.cc/150?img=6'
    }
  ]);

  const totalPages = Math.ceil(users.length / 6);

  const handleAddUser = (formData) => {
    const newUser = {
      id: `UID-${Math.floor(Math.random() * 9000) + 1000}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (userId, formData) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, name: formData.fullName, email: formData.email, phone: formData.phone }
        : user
    ));
    setIsEditModalOpen(false);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
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
    alert('Exporting user report...');
  };

  return (
    <div className="user-management-container">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      <div className="main-content">
        <div className="content-header">
          <h1>Admin Access Control</h1>
          <div className="header-actions">
            {/* <input type="text" placeholder="Search..." className="header-search" /> */}
            <div className="user-profile">
              <img src="" alt="Admin" />
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
