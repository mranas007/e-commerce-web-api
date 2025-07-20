import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AdminHeader from "../../components/Admin/AdminHeader";
import DeleteConfirmationModal from "../../components/Admin/DeleteConfirmationModal";
import ImageModal from "../../components/Admin/ImageModal";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import AdminNavbar from "../../components/AdminNavbar";
import { useAuth } from "../../contexts/AuthContext";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Product/get-product/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosInstance.delete(`/Product/delete-product/${id}`);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock > 10) return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
    if (stock > 0) return { text: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Check authentication
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
              <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate("/admin/products")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Product Details"
          subtitle="View and manage product information"
          showBackButton={true}
          onBackClick={() => navigate("/admin/products")}
        >
          <button
            onClick={() => navigate(`/admin/products/edit/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <FaEdit />
            <span>Edit Product</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </AdminHeader>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
                <div className="relative">
                  {product.imageUrl ? (
                    <div className="relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setShowImageModal(true)}
                        className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                        title="View Full Size"
                      >
                        <FaEye />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <FaEye className="text-gray-400 text-4xl mb-2" />
                        <p className="text-gray-500">No image available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Product Name</label>
                      <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Category</label>
                      <p className="text-gray-900">{product.category || "Uncategorized"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Description</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{product.description}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-600">Price</label>
                      <p className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-600">Stock Quantity</label>
                      <p className="text-lg font-semibold text-gray-900">{product.stock || 0} units</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-600">Stock Status</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Actions</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-600">Product Status</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-600">Product ID</label>
                      <p className="text-sm text-gray-500 font-mono">{product.id}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${id}`)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <FaEdit />
                          <span>Edit Product</span>
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        show={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <ImageModal
        show={showImageModal}
        imageUrl={product.imageUrl}
        altText={product.name}
        onClose={() => setShowImageModal(false)}
      />
    </div>
  );
};

export default ViewProduct;