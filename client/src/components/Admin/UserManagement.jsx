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

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    if (!user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      dispatch(fetchUsers());
    }
  }, [user, dispatch]);

  const [formData, setFormData] = useState({
    name: "",
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ userId, newRole }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?"))
      dispatch(deleteUser());
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-6 h-screen">
      <h1 className="text-2xl font-bold">User Management</h1>
      {loading && <p>loading...</p>}
      {error && <p>error:{error}</p>}

      <div className="p-4">
        <div>
          <h2 className="font-bold text-lg mt-4">Add New User</h2>

          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col mt-4">
              <label className="text-gray-500">Name</label>
              <input
                type="text"
                name="name"
                className="border p-2 rounded"
                value={formData.name || ""}
                onChange={handleFormChange}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-gray-500">Email</label>
              <input
                type="email"
                name="email"
                className="border p-2 rounded"
                value={formData.email || ""}
                onChange={handleFormChange}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-gray-500">Password</label>
              <input
                type="password"
                name="password"
                className="border p-2 rounded"
                value={formData.password || ""}
                onChange={handleFormChange}
              />
            </div>

            <div className="flex flex-col mt-4 w-full">
              <label className="text-gray-500">Role</label>
              <select
                name="role"
                className="border p-2 rounded"
                value={formData.role || "admin"}
                onChange={handleFormChange}
              >
                <option value="admin">Admin</option>
                <option value="user">Customer</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-400"
            >
              Add User
            </button>
          </form>
        </div>

        {/* Added overflow container around the table */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto mt-12 shadow-md">
          <table className="w-full text-center">
            <thead className="bg-gray-200 text-lg font-bold sticky top-0">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <select
                      name="role"
                      className="py-1 border"
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      value={user.role}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={(e) => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
