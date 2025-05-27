import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              E-Commerce
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="hover:text-gray-300 transition-colors">
                Home
              </Link>
              <Link to="/products" className="hover:text-gray-300 transition-colors">
                Products
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-gray-300 transition-colors">
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="hover:text-gray-300 transition-colors">
              Cart
            </Link>
            {user ? (
              <Link to="/profile" className="hover:text-gray-300 transition-colors">
                Profile
              </Link>
            ) : (
              <Link to="/login" className="hover:text-gray-300 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 