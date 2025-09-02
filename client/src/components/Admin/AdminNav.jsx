import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {
  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-xl font-bold">
              Admin Panel
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/admin"
                className="hover:text-gray-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className="hover:text-gray-300 transition-colors"
              >
                Products
              </Link>
              <Link
                to="/admin/orders"
                className="hover:text-gray-300 transition-colors"
              >
                Orders
              </Link>
              <Link
                to="/admin/users"
                className="hover:text-gray-300 transition-colors"
              >
                Users
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="hover:text-gray-300 transition-colors"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav; 