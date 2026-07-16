import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserTable from '../components/UserTable';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import DeleteUserModal from '../components/DeleteUserModal';

const STORAGE_KEY = 'admin-users';

const UserManagement = () => {
  const [activeItem, setActiveItem] = useState('users');
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

    setUsers(prevUsers => {
      const updatedUsers = [...prevUsers, newUser];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
    });

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
    <div className="flex min-h-screen bg-[#f5f7fa] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      <div className="flex-1 p-8 ml-[260px] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[1.8rem] font-semibold text-[#1a1a2e] m-0">Admin Access Control</h1>
          <div className="flex items-center gap-4">
            {/* <input type="text" placeholder="Search..." className="p-2.5 border border-[#e0e0e0] rounded-lg text-sm w-[250px] outline-none focus:border-emerald-500" /> */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-[#374151]">
                {currentUser?.name || 'Admin'}
              </span>
              <div className="w-10 h-10 rounded-[60%] flex items-center justify-center bg-emerald-500 text-white text-xl font-semibold border-2 border-emerald-500">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 mb-8 flex justify-between items-center shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500 font-medium">Total Users</span>
            <span className="text-2xl font-bold text-emerald-500">{users.length}</span>
          </div>
          <button 
            className="bg-emerald-500 text-white border-none px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer hover:bg-emerald-600 hover:-translate-y-0.5 transition-all"
            onClick={() => setIsAddModalOpen(true)}
          >
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

        <div className="flex justify-end mt-8">
          <button 
            className="bg-emerald-500 text-white border-none px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer hover:bg-emerald-600 hover:-translate-y-0.5 transition-all"
            onClick={handleExportReport}
          >
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
