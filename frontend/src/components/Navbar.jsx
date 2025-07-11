import React, { useState } from "react";
import { Link } from "react-router-dom";
// Import React Icons
import { FaHome, FaBox, FaShoppingCart } from 'react-icons/fa';


const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold">
                <Link to="/">eCommerceApp</Link>
            </div>
            <div className="flex space-x-6 items-center">
                <Link to="/" className="flex items-center space-x-1 hover:text-blue-600">
                    <FaHome />
                    <span>Home</span>
                </Link>
                <Link to="/products" className="flex items-center space-x-1 hover:text-blue-600">
                    <FaBox />
                    <span>Products</span>
                </Link>
                <Link to="/cart" className="flex items-center space-x-1 hover:text-blue-600">
                    <FaShoppingCart />
                    <span>Cart</span>
                </Link>
            </div>
            <div className="space-x-4">
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
            </div>
        </nav>
    );
};

export default Navbar;