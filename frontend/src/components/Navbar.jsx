import React, { useState } from "react";
import { Link } from "react-router-dom";
// Import React Icons
import { FaHome, FaBox, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { user, token, logout, isAdmin } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(true);
    };

    return (
        <>
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center relative">
                <div className="text-xl font-bold">
                    <Link to="/">Dig Store</Link>
                </div>
                {/* Hamburger menu button for mobile */}
                <button
                    className="md:hidden flex items-center text-2xl focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        )}
                    </svg>
                </button>
                {/* Desktop menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/home" className="flex items-center space-x-1 hover:text-blue-600">
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    <Link to="/products" className="flex items-center space-x-1 hover:text-blue-600">
                        <FaBox />
                        <span>Products</span>
                    </Link>
                    {token && (
                        <Link to="/cart" className="flex items-center space-x-1 hover:text-blue-600">
                            <FaShoppingCart />
                            <span>Cart</span>
                        </Link>
                    )}
                </div>
                <div className="hidden md:flex space-x-4 items-center">
                    {token ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.name?.charAt(0) || user?.fullname?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.name || user?.fullname || 'User'}
                                </span>
                            </div>
                            {isAdmin() && (
                                <Link
                                    to="/admin"
                                    className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
                                >
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition flex items-center space-x-1"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
                {/* Mobile menu - Animated from left to right */}
                <div
                    className={`
                        fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-30
                        transform transition-transform duration-300 ease-in-out
                        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
                        md:hidden
                    `}
                    style={{ willChange: 'transform' }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        
                        <button
                            className="text-2xl focus:outline-none"
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col items-start px-6 py-4 space-y-4">
                        <Link
                            to="/home"
                            className="flex items-center space-x-2 w-full py-2 hover:text-blue-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaHome />
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/products"
                            className="flex items-center space-x-2 w-full py-2 hover:text-blue-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaBox />
                            <span>Products</span>
                        </Link>
                        {token && (
                            <Link
                                to="/cart"
                                className="flex items-center space-x-2 w-full py-2 hover:text-blue-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                <FaShoppingCart />
                                <span>Cart</span>
                            </Link>
                        )}
                        <div className="flex flex-col w-full space-y-2 pt-2 border-t">
                            {token ? (
                                <>
                                    <div className="flex items-center space-x-2 py-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-medium">
                                                {user?.name?.charAt(0) || user?.fullname?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {user?.name || user?.fullname || 'User'}
                                        </span>
                                    </div>
                                    {isAdmin() && (
                                        <Link
                                            to="/admin"
                                            className="w-full px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition text-left"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            confirmLogout();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition text-left flex items-center space-x-2"
                                    >
                                        <FaSignOutAlt />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="w-full px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition text-left"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-left"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* Overlay for mobile menu */}
                {menuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu overlay"
                    />
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to logout? You'll need to login again to access your account.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;