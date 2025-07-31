import React from 'react';
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const AdminProductCard = ({ product, formatPrice, confirmDelete }) => {
  return (
    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img
          src={product.images && product.images.length > 0 ? `${import.meta.env.VITE_PRODUCT_IMAGES_URL}${product.images[0].url}` : "https://via.placeholder.com/300x200?text=No+Image"}
          // src={product.images && product.images.length > 0 ? `${import.meta.env.PRODUCT_IMAGES_URL}/${product.images[0].url}` : "https://via.placeholder.com/300x200?text=No+Image"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={() => window.location.href = `/admin/products/${product.id}`}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
            title="View Details"
          >
            <FaEye className="text-xs" />
          </button>
          <button
            onClick={() => window.location.href = `/admin/products/edit/${product.id}`}
            className="bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 transition-colors duration-200"
            title="Edit Product"
          >
            <FaEdit className="text-xs" />
          </button>
          <button
            onClick={() => confirmDelete(product)}
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
            title="Delete Product"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-bold text-lg">
            {formatPrice(product.price)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 10 ? 'bg-green-100 text-green-800' : product.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
            {product.quantity > 10 ? 'In Stock' :
             product.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Stock: {product.quantity || 0} units
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;