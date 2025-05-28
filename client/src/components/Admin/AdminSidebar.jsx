import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaSignLanguage, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {logout} from "../../redux/slices/authSlice"
import {clearCart} from "../../redux/slices/cartSlice"

const AdminSidebar = () => {
  const navigate = useNavigate();

  const dispatch=useDispatch();


  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };
  
  return (
    <div className="text-white h-full p-6">
      <div className="mb-6">
        <Link
          to="/"
          className="text-2xl font-bold block py-2 cursor-pointer text-white hover:text-gray-300"
        >
          Rabbit
        </Link>
      </div>

      <div>
        <Link to="/admin" className="text-center text-xl font-medium mb-8">
          Admin Dashboard
        </Link>
        <nav className="">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaUser />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/Products"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaUser />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaClipboardList />
            <span>Orders</span>
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaStore />
            <span>Shop</span>
          </NavLink>
        </nav>
        <div className="mt-12 mb-6">
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 space-x-2 flex items-center justify-center text-white rounded text-xl w-full p-3">
            <FaSignOutAlt className=""/>  <span>logout</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
