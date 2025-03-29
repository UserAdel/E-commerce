import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const togglesidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/*Mobile Toggle Button*/}
      <div className="md:hidden p-4 bg-black flex text-white z-20">
        <button onClick={togglesidebar} className=" ">
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashborad</h1>
      </div>

      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } text-white transition-transform duration-300 w-64 z-20 absolute min-h-screen md:static md:translate-x-0  bg-gray-900 inset-0 overflow-auto`}
      >
        {/* Sidebar */}
        <AdminSidebar/>
      </div>

      {sidebarOpen && (
        <div
          onClick={togglesidebar}
          className="inset-0 md:hidden absolute bg-black/20"
        ></div>
      )}
      {/*Main Content */}
      <div className="flex-grow overflow-auto p-6">
      <Outlet/>
      </div>


    </div>

  );
};

export default AdminLayout;
