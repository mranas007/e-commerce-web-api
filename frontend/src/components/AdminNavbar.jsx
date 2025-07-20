import React, { useState } from "react";
import { FaBars, FaTimes, FaBox, FaUsers, FaShoppingCart, FaChartLine, FaCog, FaSignOutAlt, FaHome } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: FaHome },
    { name: "Products", href: "/admin/products", icon: FaBox },
    { name: "Categories", href: "/admin/categories", icon: FaBox },
    { name: "Users", href: "/admin/users", icon: FaUsers },
    { name: "Orders", href: "/admin/orders", icon: FaShoppingCart },
    { name: "Analytics", href: "/admin/analytics", icon: FaChartLine },
    { name: "Settings", href: "/admin/settings", icon: FaCog },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
              >
                <item.icon className="mr-3" />
                {item.name}
              </a>
            ))}
          </div>

          {/* User section */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || user?.fullname?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.name || user?.fullname || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isAdmin() ? 'Administrator' : 'User'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors duration-200"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Top navbar for mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <FaBars />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;