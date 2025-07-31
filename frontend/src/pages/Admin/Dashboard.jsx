import React, { useState, useEffect } from "react";
import { FaBox, FaUsers, FaShoppingCart, FaChartLine, FaCog, FaPlus } from "react-icons/fa";
import AdminHeader from "../../components/Admin/AdminHeader";
import { useAuth } from "../../contexts/AuthContext";
import AdminNavbar from "../../components/Admin/AdminNavbar";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // You can add API calls here to fetch actual stats
      // For now, using mock data
      setStats({
        totalProducts: 24,
        totalUsers: 156,
        totalOrders: 89,
        revenue: 15420
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminMenuItems = [
    {
      title: "Products",
      description: "Manage product inventory",
      icon: FaBox,
      color: "bg-blue-500",
      href: "/admin/products"
    },
    {
      title: "Users",
      description: "View and manage users",
      icon: FaUsers,
      color: "bg-green-500",
      href: "/admin/users"
    },
    {
      title: "Orders",
      description: "Track and manage orders",
      icon: FaShoppingCart,
      color: "bg-purple-500",
      href: "/admin/orders"
    },
    {
      title: "Analytics",
      description: "View sales and performance",
      icon: FaChartLine,
      color: "bg-orange-500",
      href: "/admin/analytics"
    },
    {
      title: "Settings",
      description: "Configure store settings",
      icon: FaCog,
      color: "bg-gray-500",
      href: "/admin/settings"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Admin Dashboard"
          subtitle={`Welcome back, ${user?.name || user?.fullname || 'Admin'}`}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <FaBox className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <FaUsers className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <FaShoppingCart className="text-purple-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100">
                    <FaChartLine className="text-orange-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => window.location.href = "/admin/products/add"}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                >
                  <FaPlus className="text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Add New Product</p>
                    <p className="text-sm text-gray-600">Create a new product listing</p>
                  </div>
                </button>

                <button
                  onClick={() => window.location.href = "/admin/orders"}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
                >
                  <FaShoppingCart className="text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Orders</p>
                    <p className="text-sm text-gray-600">Check recent orders</p>
                  </div>
                </button>

                <button
                  onClick={() => window.location.href = "/admin/analytics"}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors duration-200"
                >
                  <FaChartLine className="text-orange-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Analytics</p>
                    <p className="text-sm text-gray-600">Check performance metrics</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Admin Menu */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminMenuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => window.location.href = item.href}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-full ${item.color} bg-opacity-10`}>
                          <item.icon className={`text-xl ${item.color.replace('bg-', 'text-')}`} />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;