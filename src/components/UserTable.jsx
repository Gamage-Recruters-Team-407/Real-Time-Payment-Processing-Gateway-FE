import React, { useState } from 'react';

const UserTable = ({ users, onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTotalPages = Math.ceil(filteredUsers.length / 6);

  // Reset to page 1 when search query changes
  React.useEffect(() => {
    setLocalCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setLocalCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-[#1a1a2e] m-0">All Users</h3>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="p-2.5 border border-[#e0e0e0] rounded-lg text-sm w-[250px] outline-none focus:border-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-[#f8fafc]">
          <tr>
            <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Name</th>
            <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Email Address</th>
            <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Phone Number</th>
            <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Last Payment Date</th>
            <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b border-gray-200 transition-colors duration-200 hover:bg-[#f8fafc]">
              <td className="p-4 align-middle">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white text-xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-[#1a1a2e] text-sm">{user.name}</span>
                    <span className="text-xs text-gray-400">{user.id}</span>
                  </div>
                </div>
              </td>
              <td className="p-4 align-middle text-gray-600 text-sm">{user.email}</td>
              <td className="p-4 align-middle text-gray-600 text-sm">{user.phone}</td>
              <td className="p-4 align-middle text-gray-600 text-sm">{user.lastPaymentDate}</td>
              <td className="p-4 align-middle">
                <div className="flex gap-2">
                  <button 
                    className="w-9 h-9 border-none rounded-lg cursor-pointer text-base flex items-center justify-center transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#1a1a2e]"
                    onClick={() => onEdit(user)}
                    title="Edit User"
                  >
                    ✏️
                  </button>
                  <button 
                    className="w-9 h-9 border-none rounded-lg cursor-pointer text-base flex items-center justify-center transition-all bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                    onClick={() => onDelete(user)}
                    title="Delete User"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {filteredUsers.length > 0 ? ((localCurrentPage - 1) * 6) + 1 : 0} - {Math.min(localCurrentPage * 6, filteredUsers.length)} of {filteredUsers.length} administrators
        </div>
        <div className="flex gap-2">
          <button 
            className="w-9 h-9 border border-gray-200 bg-white rounded-lg cursor-pointer text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={localCurrentPage === 1}
            onClick={() => handlePageChange(localCurrentPage - 1)}
          >
            &lt;
          </button>
          {[...Array(filteredTotalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`w-9 h-9 border border-gray-200 bg-white rounded-lg cursor-pointer text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:border-gray-300 ${
                localCurrentPage === index + 1 ? 'bg-emerald-500 text-white border-emerald-500' : ''
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button 
            className="w-9 h-9 border border-gray-200 bg-white rounded-lg cursor-pointer text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={localCurrentPage === filteredTotalPages || filteredTotalPages === 0}
            onClick={() => handlePageChange(localCurrentPage + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
