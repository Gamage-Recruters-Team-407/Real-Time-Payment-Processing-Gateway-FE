import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";

import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import DeleteUserModal from "../components/DeleteUserModal";

import { useAuth } from "../context/AuthContext";

import {
  createUser,
  deleteUser,
  fetchUsers,
  getRoleLabel,
  normalizeRoleValue,
  updateUser,
} from "../services/userService";

const PAGE_SIZE = 6;

const UserManagement = () => {
  const { user: currentUser } = useAuth();

  const [activeItem, setActiveItem] = useState("users");

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

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, roleFilter]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");

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

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPage, debouncedSearch, roleFilter, refreshTrigger]);

  const handleAddUser = async (formData) => {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        name: formData.fullName?.trim(),
        email: formData.email?.trim(),
        password: formData.password,
        phone: formData.phone?.trim() || "",
        role: normalizeRoleValue(formData.role),
      };

      await createUser(payload);

      setSuccessMessage("User created successfully");
      setIsAddModalOpen(false);
      setCurrentPage(1);
      setRefreshTrigger((previousValue) => previousValue + 1);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to create user";

      setError(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditUser = async (formData) => {
    if (!selectedUser) {
      return;
    }

    setIsUpdating(true);
    setError("");
    setSuccessMessage("");

    try {
      const userId = selectedUser?._id || selectedUser?.id;

      if (!userId) {
        throw new Error("User ID is missing");
      }

      const payload = {
        name: formData.fullName?.trim(),
        email: formData.email?.trim(),
        phone: formData.phone?.trim() || "",
        role: normalizeRoleValue(formData.role),
      };

      await updateUser(userId, payload);

      setSuccessMessage("User updated successfully");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setRefreshTrigger((previousValue) => previousValue + 1);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to update user";

      setError(message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      return;
    }

    setIsDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      const userId = selectedUser?._id || selectedUser?.id;

      if (!userId) {
        throw new Error("User ID is missing");
      }

      await deleteUser(userId);

      setSuccessMessage("User deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((previousPage) => previousPage - 1);
      } else {
        setRefreshTrigger((previousValue) => previousValue + 1);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to delete user";

      setError(message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (user) => {
    setError("");
    setSuccessMessage("");
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setError("");
    setSuccessMessage("");
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setCurrentPage(1);
    setError("");
    setSuccessMessage("");
  };

  const handleRefresh = () => {
    setError("");
    setSuccessMessage("");
    setRefreshTrigger((previousValue) => previousValue + 1);
  };

  const getDisplayUserId = (user) => {
    const mongoId = user?._id || user?.id || "";

    if (!mongoId) {
      return "N/A";
    }

    const prefix =
      user?.role?.toLowerCase() === "admin" ? "ADM" : "USR";

    return `${prefix}-${mongoId.slice(-8).toUpperCase()}`;
  };

  const handleExportReport = () => {
    if (users.length === 0) {
      setError("No users available to export");
      setSuccessMessage("");
      return;
    }

    try {
      const document = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const generatedDate = new Date().toLocaleString();

      document.setFont("helvetica", "bold");
      document.setFontSize(20);
      document.text("User Management Report", 14, 18);

      document.setFont("helvetica", "normal");
      document.setFontSize(10);
      document.text(`Generated Date: ${generatedDate}`, 14, 26);
      document.text(`Total Users: ${totalUsers}`, 14, 32);

      if (debouncedSearch) {
        document.text(`Search: ${debouncedSearch}`, 80, 26);
      }

      if (roleFilter) {
        document.text(
          `Role Filter: ${getRoleLabel(roleFilter)}`,
          80,
          32
        );
      }

      const tableRows = users.map((user, index) => {
        const createdDate = user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "-";

        return [
          (currentPage - 1) * PAGE_SIZE + index + 1,
          getDisplayUserId(user),
          user?.name || "Unknown User",
          user?.email || "-",
          user?.phone || "-",
          getRoleLabel(user?.role || ""),
          createdDate,
        ];
      });

      autoTable(document, {
        startY: 40,
        head: [
          [
            "No.",
            "User ID",
            "Name",
            "Email Address",
            "Phone Number",
            "Role",
            "Created Date",
          ],
        ],
        body: tableRows,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fontStyle: "bold",
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
        columnStyles: {
          0: {
            cellWidth: 14,
            halign: "center",
          },
          1: {
            cellWidth: 31,
          },
          2: {
            cellWidth: 40,
          },
          3: {
            cellWidth: 60,
          },
          4: {
            cellWidth: 36,
          },
          5: {
            cellWidth: 25,
          },
          6: {
            cellWidth: 30,
          },
        },
        margin: {
          top: 15,
          left: 14,
          right: 14,
          bottom: 16,
        },
        didDrawPage: (data) => {
          const pageWidth = document.internal.pageSize.getWidth();
          const pageHeight = document.internal.pageSize.getHeight();
          const pageNumber = document.internal.getCurrentPageInfo().pageNumber;

          document.setFont("helvetica", "normal");
          document.setFontSize(9);

          document.text(
            `Page ${pageNumber}`,
            pageWidth - 30,
            pageHeight - 8
          );

          document.text(
            "Real-Time Payment Processing Gateway",
            14,
            pageHeight - 8
          );
        },
      });

      const reportDate = new Date().toISOString().split("T")[0];

      document.save(`user_management_report_${reportDate}.pdf`);

      setError("");
      setSuccessMessage("PDF report exported successfully");
    } catch (exportError) {
      setSuccessMessage("");
      setError(
        exportError?.message || "Unable to export the PDF report"
      );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f5f7fa] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-8 m-0 text-[1.8rem] font-semibold text-[#1a1a2e]">
              Admin Access Control
            </h1>

            <div className="mb-8 flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Total Users
                </span>

                <span className="text-2xl font-bold text-emerald-500">
                  {totalUsers}
                </span>
              </div>

              <button
                type="button"
                className="rounded-lg border-none bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setIsAddModalOpen(true);
                }}
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
                type="button"
                className="rounded-lg border-none bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                onClick={handleExportReport}
                disabled={users.length === 0 || loading}
              >
                Export PDF
              </button>
            </div>
          </div>
        </main>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => {
          if (!isSaving) {
            setIsAddModalOpen(false);
            setError("");
          }
        }}
        onAddUser={handleAddUser}
        isSaving={isSaving}
        error={error}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          if (!isUpdating) {
            setIsEditModalOpen(false);
            setSelectedUser(null);
            setError("");
          }
        }}
        onEditUser={handleEditUser}
        user={selectedUser}
        isUpdating={isUpdating}
        error={error}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
            setError("");
          }
        }}
        onDeleteUser={handleDeleteUser}
        user={selectedUser}
        currentUser={currentUser}
        isDeleting={isDeleting}
        error={error}
      />
    </div>
  );
};

export default UserManagement;