import React from 'react';
import { FaPlus, FaArrowLeft, FaTimes } from 'react-icons/fa';

const AdminHeader = ({
  title,
  subtitle,
  showAddButton = false,
  onAddClick,
  showBackButton = false,
  onBackClick,
  showCancelButton = false,
  onCancelClick,
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={onBackClick}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaArrowLeft />
                <span>Back</span>
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="flex space-x-3">
            {showAddButton && (
              <button
                onClick={onAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <FaPlus className="text-sm" />
                <span>Add Product</span>
              </button>
            )}
            {showCancelButton && (
              <button
                onClick={onCancelClick}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;