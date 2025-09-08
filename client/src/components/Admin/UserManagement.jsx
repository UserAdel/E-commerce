import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  fetchUsers,
  updateUser,
  deleteUser,
} from "../../redux/slices/adminSlice";
import { toast } from "sonner";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    users = [],
    loading,
    error,
  } = useSelector((state) => state.admin) || {};

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    dispatch(fetchUsers());
  }, [user, dispatch, navigate]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      await dispatch(addUser(formData)).unwrap();
      toast.success("User added successfully");
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "admin",
      });
    } catch (error) {
      toast.error(error || "Failed to add user");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const result = await dispatch(updateUser({ userId, newRole })).unwrap();
      // Update the local state immediately
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      );
      dispatch({ type: "admin/fetchUsers/fulfilled", payload: updatedUsers });
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="md:ml-16 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {/* Add User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New User</h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
